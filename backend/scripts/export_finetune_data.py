"""Export training data for LoRA fine-tuning.

Pulls article summaries and cluster summaries from the DB and converts
them into instruction-following format (ChatML) for fine-tuning Qwen2.5-7B.

Two tasks exported:
  1. article_summarize — input: title + article text
                         output: {short_summary, takeaways, why_it_matters}

  2. cluster_summarize — input: cluster title + article summaries
                         output: {summary, takeaways, why_it_matters,
                                  why_it_matters_pm, why_it_matters_dev,
                                  why_it_matters_students}

Output: data/finetune_train.jsonl  (80%) + data/finetune_eval.jsonl (20%)

Usage (from backend/):
    DATABASE_URL="..." python -m scripts.export_finetune_data
    DATABASE_URL="..." python -m scripts.export_finetune_data --output-dir data/
"""

from __future__ import annotations

import argparse
import json
import logging
import random
import sys
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.db import SessionLocal
from app.logging_config import configure_logging
from app.models.article import Article
from app.models.cluster import Cluster

logger = logging.getLogger(__name__)

ARTICLE_SYSTEM_PROMPT = """You are an AI news analyst. Given an article title and body text, output a JSON object with exactly these keys:
- short_summary: 2-3 sentence objective summary of the article
- takeaways: list of exactly 3 concise takeaways (each under 20 words)
- why_it_matters: 1 paragraph explaining significance for AI practitioners, engineers, or researchers

Respond with valid JSON only. No markdown, no explanation."""

CLUSTER_SYSTEM_PROMPT = """You are an AI news analyst. Given a story cluster title and summaries of its source articles, output a JSON object with exactly these keys:
- summary: 3-4 sentence narrative summary of the overall story
- takeaways: list of exactly 3 cluster-level takeaways (each under 20 words)
- why_it_matters: general significance paragraph
- why_it_matters_pm: significance specifically for product managers
- why_it_matters_dev: significance specifically for software engineers
- why_it_matters_students: significance for students and job seekers

Respond with valid JSON only. No markdown, no explanation."""


def _article_user_message(article: Article) -> str:
    text = (article.excerpt or article.cleaned_text or "")[:1200]
    return f"Title: {article.title}\n\nArticle text:\n{text}"


def _article_assistant_message(article: Article) -> str:
    return json.dumps({
        "short_summary": article.short_summary or "",
        "takeaways": article.takeaways or [],
        "why_it_matters": article.why_it_matters or "",
    }, ensure_ascii=False)


def _cluster_user_message(cluster: Cluster) -> str:
    # Use summaries of member articles as context
    article_snippets = []
    for i, art in enumerate(cluster.articles[:6]):  # max 6 articles
        snippet = (art.short_summary or art.excerpt or "")[:300]
        if snippet:
            article_snippets.append(f"[{i+1}] {snippet}")
    context = "\n".join(article_snippets) if article_snippets else (cluster.summary or "")[:600]
    return f"Story title: {cluster.representative_title}\n\nSource article summaries:\n{context}"


def _cluster_assistant_message(cluster: Cluster) -> str:
    return json.dumps({
        "summary": cluster.summary or "",
        "takeaways": cluster.takeaways or [],
        "why_it_matters": cluster.why_it_matters or "",
        "why_it_matters_pm": cluster.why_it_matters_pm or "",
        "why_it_matters_dev": cluster.why_it_matters_dev or "",
        "why_it_matters_students": cluster.why_it_matters_students or "",
    }, ensure_ascii=False)


def _to_chatml(system: str, user: str, assistant: str, task: str) -> dict:
    """Format as ChatML conversation dict for fine-tuning."""
    return {
        "task": task,
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": user},
            {"role": "assistant", "content": assistant},
        ]
    }


def export(output_dir: Path, eval_ratio: float = 0.2, seed: int = 42) -> None:
    configure_logging()
    output_dir.mkdir(parents=True, exist_ok=True)

    db: Session = SessionLocal()
    examples: list[dict] = []

    try:
        # ---- Article summarization examples ----
        articles = db.scalars(
            select(Article).where(
                Article.short_summary.is_not(None),
                Article.takeaways.is_not(None),
                Article.why_it_matters.is_not(None),
                (Article.excerpt.is_not(None)) | (Article.cleaned_text.is_not(None)),
            )
        ).all()

        logger.info("Found %d summarized articles", len(articles))
        for art in articles:
            user_msg = _article_user_message(art)
            asst_msg = _article_assistant_message(art)
            # Skip if assistant output is basically empty
            parsed = json.loads(asst_msg)
            if not parsed["short_summary"] or not parsed["takeaways"]:
                continue
            examples.append(_to_chatml(ARTICLE_SYSTEM_PROMPT, user_msg, asst_msg, "article_summarize"))

        # ---- Cluster summarization examples ----
        clusters = db.scalars(
            select(Cluster)
            .where(
                Cluster.summary.is_not(None),
                Cluster.why_it_matters_pm.is_not(None),
                Cluster.why_it_matters_dev.is_not(None),
            )
            .options(joinedload(Cluster.articles))
        ).unique().all()

        logger.info("Found %d summarized clusters", len(clusters))
        for cl in clusters:
            user_msg = _cluster_user_message(cl)
            asst_msg = _cluster_assistant_message(cl)
            parsed = json.loads(asst_msg)
            if not parsed["summary"]:
                continue
            examples.append(_to_chatml(CLUSTER_SYSTEM_PROMPT, user_msg, asst_msg, "cluster_summarize"))

    finally:
        db.close()

    # ---- Shuffle and split ----
    random.seed(seed)
    random.shuffle(examples)
    n_eval = max(1, int(len(examples) * eval_ratio))
    eval_set = examples[:n_eval]
    train_set = examples[n_eval:]

    # ---- Write ----
    train_path = output_dir / "finetune_train.jsonl"
    eval_path = output_dir / "finetune_eval.jsonl"

    with train_path.open("w") as f:
        for ex in train_set:
            f.write(json.dumps(ex, ensure_ascii=False) + "\n")

    with eval_path.open("w") as f:
        for ex in eval_set:
            f.write(json.dumps(ex, ensure_ascii=False) + "\n")

    logger.info("\n✓ Exported %d training examples → %s", len(train_set), train_path)
    logger.info("✓ Exported %d eval examples    → %s", len(eval_set), eval_path)

    # ---- Stats ----
    task_counts = {}
    for ex in examples:
        task_counts[ex["task"]] = task_counts.get(ex["task"], 0) + 1
    logger.info("\nTask breakdown:")
    for task, count in task_counts.items():
        logger.info("  %-30s %d", task, count)


def main(argv: list[str] | None = None) -> int:
    configure_logging()
    parser = argparse.ArgumentParser(description="Export fine-tuning training data")
    parser.add_argument("--output-dir", default="data", help="Output directory (default: data/)")
    parser.add_argument("--eval-ratio", type=float, default=0.2, help="Eval split ratio (default: 0.2)")
    args = parser.parse_args(argv)

    export(Path(args.output_dir), eval_ratio=args.eval_ratio)
    return 0


if __name__ == "__main__":
    sys.exit(main())
