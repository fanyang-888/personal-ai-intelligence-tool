"""Draft Generation Service.

Generates a human-reviewable LinkedIn-style post from a story cluster.

Each draft contains:
  hook          — attention-grabbing opening line
  summary_text  — concise summary of what happened
  takeaways     — 3 career-relevant bullet points
  career_take   — one "career-oriented interpretation" paragraph
  closing       — optional closing line or question
  full_text     — the complete formatted post (ready to copy-paste)

Input: a Cluster that has already been summarized (cluster.summary is set).
Output: a Draft row inserted into the DB.

The product does NOT auto-publish. Drafts start with status="draft" and
require human review before any publishing action.
"""

from __future__ import annotations

import json
import logging
import uuid
from datetime import datetime, timezone
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import settings
from app.models.cluster import Cluster
from app.models.draft import Draft

logger = logging.getLogger(__name__)

DRAFT_MODEL = "gpt-4o-mini"


def _get_client():
    from openai import OpenAI
    key = settings.openai_api_key
    if not key:
        raise RuntimeError("OPENAI_API_KEY is not configured")
    return OpenAI(api_key=key.get_secret_value(), timeout=60.0)


_DRAFT_SYSTEM = """You are a LinkedIn content strategist helping an AI-curious early-career professional
share insights from AI news. Write a concise, authentic LinkedIn post draft.

Return JSON:
{
  "hook": "One punchy opening sentence that makes someone stop scrolling",
  "summary_text": "2-3 sentences explaining what happened and why it's significant",
  "takeaways": [
    "Takeaway 1 — concrete and specific",
    "Takeaway 2 — concrete and specific",
    "Takeaway 3 — concrete and specific"
  ],
  "career_take": "1-2 sentences on what this means for your career as a PM / developer / student in AI",
  "closing": "An optional question or call-to-action to spark conversation (or empty string)"
}

Style rules:
- No corporate jargon. Sound like a smart human, not a press release.
- Each takeaway starts with a strong verb or number.
- Keep total post under 280 words.
- JSON only."""


def _draft_user_prompt(cluster: Cluster) -> str:
    parts = [
        f"Story: {cluster.representative_title}",
        f"Type: {cluster.type} cluster | Sources: {cluster.source_count} | Score: {cluster.cluster_score}",
    ]
    if cluster.summary:
        parts.append(f"\nCluster summary:\n{cluster.summary}")
    if cluster.takeaways:
        parts.append("\nKey takeaways:\n" + "\n".join(f"- {t}" for t in cluster.takeaways))
    if cluster.why_it_matters:
        parts.append(f"\nWhy it matters: {cluster.why_it_matters}")
    if cluster.why_it_matters_pm:
        parts.append(f"For PMs: {cluster.why_it_matters_pm}")
    if cluster.why_it_matters_dev:
        parts.append(f"For devs: {cluster.why_it_matters_dev}")
    if cluster.why_it_matters_students:
        parts.append(f"For students: {cluster.why_it_matters_students}")
    return "\n".join(parts)


def _format_full_text(data: dict[str, Any]) -> str:
    """Assemble the final LinkedIn post text from structured fields."""
    lines = []
    if data.get("hook"):
        lines.append(data["hook"])
        lines.append("")
    if data.get("summary_text"):
        lines.append(data["summary_text"])
        lines.append("")
    takeaways = data.get("takeaways") or []
    if takeaways:
        for t in takeaways[:3]:
            lines.append(f"→ {t}")
        lines.append("")
    if data.get("career_take"):
        lines.append(data["career_take"])
    if data.get("closing"):
        lines.append("")
        lines.append(data["closing"])
    return "\n".join(lines).strip()


def generate_draft_for_cluster(db: Session, cluster: Cluster) -> Draft:
    """Generate and persist a Draft for the given cluster. Commits the row."""
    if not settings.openai_api_key:
        raise RuntimeError("OPENAI_API_KEY is not configured")

    client = _get_client()
    response = client.chat.completions.create(
        model=DRAFT_MODEL,
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": _DRAFT_SYSTEM},
            {"role": "user", "content": _draft_user_prompt(cluster)},
        ],
        temperature=0.6,   # slightly higher for more natural-sounding output
        max_tokens=600,
    )
    raw = response.choices[0].message.content or "{}"
    data = json.loads(raw)

    full_text = _format_full_text(data)

    draft = Draft(
        id=uuid.uuid4(),
        cluster_id=cluster.id,
        hook=(data.get("hook") or "").strip() or None,
        summary_text=(data.get("summary_text") or "").strip() or None,
        takeaways=data.get("takeaways") or [],
        career_take=(data.get("career_take") or "").strip() or None,
        closing=(data.get("closing") or "").strip() or None,
        full_text=full_text,
        status="draft",
        generated_at=datetime.now(timezone.utc),
    )
    db.add(draft)
    db.commit()
    logger.info("draft generated id=%s cluster_id=%s", draft.id, cluster.id)
    return draft


def generate_daily_draft(db: Session) -> Draft | None:
    """Pick the top scored summarized cluster without a draft today and generate one.

    Returns the generated Draft, or None if there's nothing to draft.
    """
    # Find top cluster with a summary but no existing draft
    cluster = db.execute(
        select(Cluster)
        .where(
            Cluster.summarized_at.is_not(None),
            ~Cluster.drafts.any(),  # no drafts yet
        )
        .order_by(Cluster.cluster_score.desc().nullslast())
        .limit(1)
    ).scalar_one_or_none()

    if cluster is None:
        logger.info("generate_daily_draft: no eligible cluster found")
        return None

    logger.info(
        "generating daily draft for cluster id=%s title=%.60s",
        cluster.id, cluster.representative_title,
    )
    return generate_draft_for_cluster(db, cluster)
