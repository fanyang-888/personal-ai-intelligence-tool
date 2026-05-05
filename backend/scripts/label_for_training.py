"""Label articles with LLM scores for ML training data collection.

Queries articles that passed filtering, sends each one to gpt-4o-mini to
score three dimensions used in scoring.py (currently hardcoded as 3.0):

  - audience_fit          (1–5) How well does this match an AI practitioner/researcher?
  - practical_relevance   (1–5) How actionable / directly useful is this?
  - novelty               (1–5) How new/surprising is this vs. typical AI news?

Output: JSONL file where each line is one labeled example:
  {"article_id": "...", "title": "...", "text": "...",
   "audience_fit": 4, "practical_relevance": 3, "novelty": 2, "model": "gpt-4o-mini"}

Supports resuming — already-labeled article_ids in the output file are skipped.

Usage (from backend/):
    # Against local DB (default .env)
    python -m scripts.label_for_training --output data/labels.jsonl

    # Against production DB (Railway)
    DATABASE_URL="postgresql+psycopg://..." python -m scripts.label_for_training \\
        --output data/labels.jsonl --limit 500

    # Dry run — show what would be labeled, no API calls
    python -m scripts.label_for_training --dry-run --limit 10

    # Estimate cost before running
    python -m scripts.label_for_training --cost-estimate --limit 500
"""

from __future__ import annotations

import argparse
import json
import logging
import os
import sys
import time
from pathlib import Path

from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session, sessionmaker

from app.config import settings
from app.logging_config import configure_logging
from app.models.article import Article

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
LABEL_MODEL = "gpt-4o-mini"
MAX_TEXT_CHARS = 1200          # truncate article text sent to LLM
REQUESTS_PER_MINUTE = 400      # gpt-4o-mini tier-1 limit; conservative
BATCH_SIZE = 20                # articles per LLM call (saves tokens via batching)
RETRY_ATTEMPTS = 3
RETRY_DELAY_SEC = 5.0

# Cost estimate constants (gpt-4o-mini as of 2025)
# Input: $0.15/1M tokens, Output: $0.60/1M tokens
INPUT_COST_PER_TOKEN = 0.15 / 1_000_000
OUTPUT_COST_PER_TOKEN = 0.60 / 1_000_000
AVG_INPUT_TOKENS_PER_ARTICLE = 350   # rough estimate
AVG_OUTPUT_TOKENS_PER_ARTICLE = 30   # just 3 numbers + field names

# ---------------------------------------------------------------------------
# Prompt
# ---------------------------------------------------------------------------
SYSTEM_PROMPT = """You are scoring AI news articles for a personalized digest aimed at
AI practitioners, researchers, ML engineers, and product managers.

Score each article on three dimensions (integer 1–5):

audience_fit:
  5 = Highly relevant for AI practitioners/researchers (model releases, benchmarks, papers, tools)
  4 = Relevant (product updates, industry moves with technical depth)
  3 = Moderately relevant (general tech news touching AI)
  2 = Tangentially relevant (business news, general tech)
  1 = Not relevant (sports, politics, unrelated domains)

practical_relevance:
  5 = Immediately actionable (new tool/API/technique you can use today)
  4 = Very useful (important update that affects how you work)
  3 = Useful background knowledge
  2 = Interesting but not directly applicable
  1 = Purely informational / entertainment

novelty:
  5 = Breaking new ground (first-of-kind result, unexpected finding, major shift)
  4 = Meaningfully new (significant update or new capability)
  3 = Incremental progress (expected improvement, routine release)
  2 = Minor update or rehash of known information
  1 = Duplicate / old news / nothing new

Respond with a JSON array. Each element must have exactly these keys:
  article_id, audience_fit, practical_relevance, novelty

Example:
[
  {"article_id": "abc123", "audience_fit": 4, "practical_relevance": 3, "novelty": 2},
  {"article_id": "def456", "audience_fit": 5, "practical_relevance": 5, "novelty": 4}
]

Return ONLY the JSON array, no other text."""


def _build_user_message(batch: list[dict]) -> str:
    """Build the user message for a batch of articles."""
    lines = []
    for item in batch:
        text_snippet = (item["text"] or "")[:MAX_TEXT_CHARS].replace("\n", " ")
        lines.append(
            f'article_id: {item["article_id"]}\n'
            f'title: {item["title"]}\n'
            f'text: {text_snippet}\n'
            f'---'
        )
    return "\n".join(lines)


# ---------------------------------------------------------------------------
# OpenAI call
# ---------------------------------------------------------------------------

def _call_openai(batch: list[dict], client) -> list[dict]:
    """Call gpt-4o-mini for a batch of articles. Returns list of score dicts."""
    user_msg = _build_user_message(batch)

    for attempt in range(RETRY_ATTEMPTS):
        try:
            response = client.chat.completions.create(
                model=LABEL_MODEL,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_msg},
                ],
                temperature=0.1,        # low temperature for consistent scoring
                response_format={"type": "json_object"},
                max_tokens=len(batch) * 40 + 50,
            )
            raw = response.choices[0].message.content.strip()

            # Parse — model might return {"results": [...]} or just [...]
            parsed = json.loads(raw)
            if isinstance(parsed, dict):
                # Try common wrapper keys
                for key in ("results", "articles", "scores", "data"):
                    if key in parsed and isinstance(parsed[key], list):
                        parsed = parsed[key]
                        break
                else:
                    # Maybe it's a single article as a dict
                    parsed = [parsed]

            if not isinstance(parsed, list):
                raise ValueError(f"Expected list, got {type(parsed)}: {raw[:200]}")

            return parsed

        except (json.JSONDecodeError, ValueError) as e:
            logger.warning("parse error attempt %d/%d: %s", attempt + 1, RETRY_ATTEMPTS, e)
            if attempt == RETRY_ATTEMPTS - 1:
                raise
            time.sleep(RETRY_DELAY_SEC)

        except Exception as e:
            logger.warning("API error attempt %d/%d: %s", attempt + 1, RETRY_ATTEMPTS, e)
            if attempt == RETRY_ATTEMPTS - 1:
                raise
            time.sleep(RETRY_DELAY_SEC * (attempt + 1))

    return []


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _load_existing_ids(output_path: Path) -> set[str]:
    """Return set of article_ids already in the output file."""
    if not output_path.exists():
        return set()
    ids = set()
    with output_path.open() as f:
        for line in f:
            line = line.strip()
            if line:
                try:
                    ids.add(json.loads(line)["article_id"])
                except (json.JSONDecodeError, KeyError):
                    pass
    return ids


def _validate_scores(scores: list[dict], batch: list[dict]) -> list[dict]:
    """Validate and fix score dicts. Returns only valid entries."""
    batch_ids = {item["article_id"] for item in batch}
    valid = []
    for s in scores:
        aid = str(s.get("article_id", ""))
        if aid not in batch_ids:
            logger.warning("  score for unknown article_id=%s, skipping", aid)
            continue
        for dim in ("audience_fit", "practical_relevance", "novelty"):
            val = s.get(dim)
            if not isinstance(val, (int, float)) or not (1 <= val <= 5):
                logger.warning("  invalid %s=%r for article_id=%s, defaulting to 3", dim, val, aid)
                s[dim] = 3
            else:
                s[dim] = int(round(val))
        valid.append(s)
    return valid


# ---------------------------------------------------------------------------
# Main logic
# ---------------------------------------------------------------------------

def _fetch_articles(db: Session, limit: int) -> list[dict]:
    """Fetch articles eligible for labeling."""
    rows = db.scalars(
        select(Article)
        .where(
            Article.is_filtered_out == False,  # noqa: E712
            (Article.excerpt.is_not(None)) | (Article.cleaned_text.is_not(None)),
        )
        .order_by(Article.published_at.desc().nullslast())
        .limit(limit)
    ).all()

    return [
        {
            "article_id": str(r.id),
            "title": r.title or "",
            "text": (r.excerpt or r.cleaned_text or ""),
        }
        for r in rows
    ]


def run(
    output_path: Path,
    limit: int,
    dry_run: bool = False,
    cost_estimate: bool = False,
    batch_size: int = BATCH_SIZE,
) -> None:
    configure_logging()

    # ---- Cost estimate mode ----
    if cost_estimate:
        est_input = limit * AVG_INPUT_TOKENS_PER_ARTICLE
        est_output = limit * AVG_OUTPUT_TOKENS_PER_ARTICLE
        est_cost = est_input * INPUT_COST_PER_TOKEN + est_output * OUTPUT_COST_PER_TOKEN
        print(f"\nCost estimate for {limit} articles:")
        print(f"  Input tokens : ~{est_input:,}")
        print(f"  Output tokens: ~{est_output:,}")
        print(f"  Estimated cost: ~${est_cost:.4f} USD")
        print(f"  Model: {LABEL_MODEL}\n")
        return

    # ---- Load existing labels ----
    output_path.parent.mkdir(parents=True, exist_ok=True)
    already_labeled = _load_existing_ids(output_path)
    if already_labeled:
        logger.info("resuming: %d articles already labeled, skipping them", len(already_labeled))

    # ---- Fetch articles ----
    from app.db import SessionLocal
    db = SessionLocal()
    try:
        all_articles = _fetch_articles(db, limit)
    finally:
        db.close()

    articles = [a for a in all_articles if a["article_id"] not in already_labeled]
    logger.info(
        "fetched %d articles total, %d need labeling (limit=%d)",
        len(all_articles), len(articles), limit,
    )

    if not articles:
        logger.info("nothing to label — all done!")
        return

    if dry_run:
        print(f"\nDry run — would label {len(articles)} articles in batches of {batch_size}")
        for i, a in enumerate(articles[:5]):
            print(f"  [{i+1}] {a['article_id'][:8]}... | {a['title'][:70]}")
        if len(articles) > 5:
            print(f"  ... and {len(articles) - 5} more")
        return

    # ---- OpenAI client ----
    try:
        from openai import OpenAI
    except ImportError:
        logger.error("openai package not installed: pip install openai")
        sys.exit(1)

    api_key = settings.openai_api_key
    if not api_key:
        logger.error("OPENAI_API_KEY not set in .env")
        sys.exit(1)

    client = OpenAI(api_key=api_key.get_secret_value())

    # ---- Process in batches ----
    labeled = 0
    failed = 0
    batches = [articles[i:i + batch_size] for i in range(0, len(articles), batch_size)]

    with output_path.open("a") as out_f:
        for bi, batch in enumerate(batches):
            logger.info(
                "batch %d/%d — labeling %d articles...",
                bi + 1, len(batches), len(batch),
            )

            try:
                scores = _call_openai(batch, client)
                scores = _validate_scores(scores, batch)

                # Build lookup by article_id
                score_map = {str(s["article_id"]): s for s in scores}

                for item in batch:
                    aid = item["article_id"]
                    if aid not in score_map:
                        logger.warning("  no score returned for article_id=%s, skipping", aid[:8])
                        failed += 1
                        continue

                    s = score_map[aid]
                    record = {
                        "article_id": aid,
                        "title": item["title"],
                        "text": item["text"][:MAX_TEXT_CHARS],
                        "audience_fit": s["audience_fit"],
                        "practical_relevance": s["practical_relevance"],
                        "novelty": s["novelty"],
                        "model": LABEL_MODEL,
                    }
                    out_f.write(json.dumps(record, ensure_ascii=False) + "\n")
                    out_f.flush()
                    labeled += 1

            except Exception:
                logger.exception("batch %d/%d failed entirely, skipping", bi + 1, len(batches))
                failed += len(batch)

            # Rate limiting: stay under RPM limit
            if bi < len(batches) - 1:
                time.sleep(60 / REQUESTS_PER_MINUTE * batch_size)

    logger.info(
        "done — labeled=%d failed=%d output=%s",
        labeled, failed, output_path,
    )
    print(f"\n✓ Labeled {labeled} articles → {output_path}")
    if failed:
        print(f"  ✗ {failed} articles failed (retry by re-running — already-labeled are skipped)")


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main(argv: list[str] | None = None) -> int:
    configure_logging()
    parser = argparse.ArgumentParser(
        description="Label articles with LLM scores for ML training data"
    )
    parser.add_argument(
        "--output",
        default="data/labels.jsonl",
        help="Output JSONL file path (default: data/labels.jsonl)",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=600,
        help="Max articles to label (default: 600)",
    )
    parser.add_argument(
        "--batch-size",
        type=int,
        default=BATCH_SIZE,
        help=f"Articles per LLM call (default: {BATCH_SIZE})",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would be labeled without making API calls",
    )
    parser.add_argument(
        "--cost-estimate",
        action="store_true",
        help="Print cost estimate and exit",
    )
    args = parser.parse_args(argv)

    run(
        output_path=Path(args.output),
        limit=args.limit,
        dry_run=args.dry_run,
        cost_estimate=args.cost_estimate,
        batch_size=args.batch_size,
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
