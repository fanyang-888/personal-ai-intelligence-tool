"""Translate draft fields from English to Chinese (Simplified).

Runs after generate_draft.py.  For each draft that has been generated but
not yet translated, calls GPT-4o-mini once to produce all zh fields in a
single JSON response.

Usage:
    cd backend/
    python -m scripts.translate_drafts [--batch-size N]
"""

from __future__ import annotations

import argparse
import json
import logging
import sys
from datetime import datetime, timezone

from sqlalchemy import select

from app.config import settings
from app.db import SessionLocal
from app.logging_config import configure_logging
from app.models.draft import Draft

configure_logging()
logger = logging.getLogger(__name__)

MODEL = "gpt-4o-mini"

_SYSTEM = """You are a professional translator specializing in AI/tech content.
Translate the following English LinkedIn-style post draft fields into Simplified Chinese (简体中文).
Keep technical terms (model names, company names, benchmark names, product names) in English.
Be concise and accurate — preserve the tone and structure of the original.
Do not add opinions or extra content.

Return JSON with exactly these keys:
{
  "hook_zh": "translated opening hook sentence",
  "summary_text_zh": "translated summary paragraph",
  "takeaways_zh": ["takeaway 1", "takeaway 2", "takeaway 3"],
  "career_take_zh": "translated career interpretation paragraph",
  "closing_zh": "translated closing sentence or question (empty string if original is empty)",
  "full_text_zh": "complete translated post combining all sections"
}
JSON only."""


def _translate_draft(client, draft: Draft) -> dict:
    takeaways = draft.takeaways or []
    user = (
        f"Hook: {draft.hook or ''}\n\n"
        f"Summary:\n{draft.summary_text or ''}\n\n"
        f"Takeaways:\n" + "\n".join(f"- {t}" for t in takeaways) + "\n\n"
        f"Career take: {draft.career_take or ''}\n\n"
        f"Closing: {draft.closing or ''}\n\n"
        f"Full post:\n{draft.full_text or ''}"
    )
    response = client.chat.completions.create(
        model=MODEL,
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": _SYSTEM},
            {"role": "user", "content": user},
        ],
        temperature=0.2,
        max_tokens=800,
    )
    raw = response.choices[0].message.content or "{}"
    return json.loads(raw)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Translate draft fields to Chinese")
    parser.add_argument("--batch-size", type=int, default=10)
    args = parser.parse_args(argv if argv is not None else sys.argv[1:])

    key = settings.openai_api_key
    if not key:
        logger.warning("translate_drafts skipped: OPENAI_API_KEY not set")
        return 0

    from openai import OpenAI
    client = OpenAI(api_key=key.get_secret_value())

    with SessionLocal() as db:
        drafts = list(
            db.execute(
                select(Draft).where(
                    Draft.generated_at.is_not(None),
                    Draft.translated_at.is_(None),
                ).limit(args.batch_size)
            ).scalars().all()
        )

        if not drafts:
            logger.info("translate_drafts: nothing to translate")
            return 0

        processed = skipped = 0
        for draft in drafts:
            try:
                data = _translate_draft(client, draft)
                draft.hook_zh = (data.get("hook_zh") or "").strip() or None
                draft.summary_text_zh = (data.get("summary_text_zh") or "").strip() or None
                draft.takeaways_zh = data.get("takeaways_zh") or []
                draft.career_take_zh = (data.get("career_take_zh") or "").strip() or None
                draft.closing_zh = (data.get("closing_zh") or "").strip() or None
                draft.full_text_zh = (data.get("full_text_zh") or "").strip() or None
                draft.translated_at = datetime.now(timezone.utc)
                processed += 1
                logger.info("translated draft id=%s", draft.id)
            except Exception:
                logger.exception("failed to translate draft id=%s", draft.id)
                skipped += 1

        if processed:
            db.commit()

    logger.info("translate_drafts done: processed=%d skipped=%d", processed, skipped)
    return 0 if skipped == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
