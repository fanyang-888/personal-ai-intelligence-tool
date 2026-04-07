"""Persist normalized full-article fetches (service layer on top of ``create_article``)."""

from __future__ import annotations

import logging
from datetime import datetime, timezone
from enum import Enum
from typing import Any
from uuid import UUID

from sqlalchemy.orm import Session

from app.crud.article import create_article
from app.schemas.article import ArticleCreate
from app.schemas.normalized_article import NormalizedFetchedArticle
from app.schemas.trusted_source_config import TrustedSourceConfig
from app.utils.datetime_parse import iso_to_utc_datetime
from app.utils.text_stats import content_sha256_hex, minimal_clean_text, word_count

logger = logging.getLogger(__name__)

# Reject empty shells / failed extractions (tune per environment if needed).
_MIN_BODY_CHARS = 80


def normalized_from_candidate_fetch(
    *,
    source_id: UUID,
    config: TrustedSourceConfig,
    candidate: dict[str, Any],
    fetch_ok: dict[str, Any],
) -> NormalizedFetchedArticle:
    """Build :class:`NormalizedFetchedArticle` from index candidate + successful ``fetch_article``."""
    title = (fetch_ok.get("title_guess") or candidate.get("title") or "").strip()
    author = fetch_ok.get("author_guess") or candidate.get("author_name")
    author_s = author.strip() if isinstance(author, str) and author.strip() else None
    pub = iso_to_utc_datetime(candidate.get("published_at"))
    raw = (fetch_ok.get("raw_text") or "").strip()
    return NormalizedFetchedArticle(
        source_id=source_id,
        title=title or "Untitled",
        url=(candidate.get("url") or "").strip(),
        canonical_url=fetch_ok.get("canonical_url"),
        author_name=author_s,
        organization_name=config.name,
        published_at=pub,
        fetched_at=datetime.now(timezone.utc),
        raw_text=raw,
        cleaned_text=minimal_clean_text(raw),
        excerpt=(fetch_ok.get("excerpt") or "").strip() or None,
        language=config.default_language,
        raw_meta=dict(fetch_ok.get("raw_meta") or {}),
    )


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
