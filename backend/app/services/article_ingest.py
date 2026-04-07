"""Persist normalized full-article fetches (service layer on top of ``create_article``)."""

from __future__ import annotations

import logging
from enum import Enum
from sqlalchemy.orm import Session

from app.crud.article import create_article
from app.schemas.article import ArticleCreate
from app.schemas.normalized_article import NormalizedFetchedArticle
from app.utils.text_stats import content_sha256_hex, minimal_clean_text, word_count

logger = logging.getLogger(__name__)

# Reject empty shells / failed extractions (tune per environment if needed).
_MIN_BODY_CHARS = 80


class PersistArticleOutcome(str, Enum):
    inserted = "inserted"
    duplicate = "duplicate"
    rejected = "rejected"


def persist_fetched_article(
    db: Session,
    normalized: NormalizedFetchedArticle,
    *,
    adapter_key: str = "",
) -> PersistArticleOutcome:
    """Map ``normalized`` → ``ArticleCreate`` and insert. Duplicate ``url`` → duplicate (not error).

    ``content_hash`` / ``word_count`` are filled from ``cleaned_text`` or ``raw_text`` when omitted.
    """
    title = (normalized.title or "").strip()
    if not title:
        logger.warning(
            "ingest rejected reason=empty_title adapter=%s url=%s",
            adapter_key,
            normalized.url[:200],
        )
        return PersistArticleOutcome.rejected

    raw_t = (normalized.raw_text or "").strip()
    cleaned = (normalized.cleaned_text or "").strip()
    if not cleaned and raw_t:
        cleaned = minimal_clean_text(raw_t)
    if not raw_t and cleaned:
        raw_t = cleaned

    if len(cleaned) < _MIN_BODY_CHARS and len(raw_t) < _MIN_BODY_CHARS:
        logger.warning(
            "ingest rejected reason=short_body adapter=%s url=%s raw_len=%s cleaned_len=%s",
            adapter_key,
            normalized.url[:200],
            len(raw_t),
            len(cleaned),
        )
        return PersistArticleOutcome.rejected

    basis = cleaned if cleaned else raw_t
    wc = normalized.word_count if normalized.word_count is not None else word_count(basis)
    ch = normalized.content_hash if normalized.content_hash else content_sha256_hex(basis)

    meta = dict(normalized.raw_meta)
    ing_meta = meta.get("ingestion")
    if not isinstance(ing_meta, dict):
        ing_meta = {}
    ing_meta = {**ing_meta, "word_count": wc}
    if adapter_key:
        ing_meta["adapter_key"] = adapter_key
    meta = {**meta, "ingestion": ing_meta}

    payload = ArticleCreate(
        source_id=normalized.source_id,
        title=title,
        url=normalized.url,
        canonical_url=normalized.canonical_url,
        published_at=normalized.published_at,
        fetched_at=normalized.fetched_at,
        raw_text=raw_t or None,
        cleaned_text=cleaned or None,
        excerpt=(normalized.excerpt or "").strip() or None,
        content_hash=ch,
        language=normalized.language,
        author_name=normalized.author_name,
        organization_name=normalized.organization_name,
        raw_meta=meta,
    )
    row = create_article(db, payload)
    if row is None:
        logger.info(
            "ingest duplicate_skip adapter=%s url=%s",
            adapter_key,
            normalized.url[:200],
        )
        return PersistArticleOutcome.duplicate
    logger.info(
        "ingest inserted adapter=%s article_id=%s url=%s",
        adapter_key,
        row.id,
        normalized.url[:200],
    )
    return PersistArticleOutcome.inserted
