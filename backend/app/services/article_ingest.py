"""Persist normalized full-article fetches (service layer on top of ``create_article``)."""

from __future__ import annotations

import logging
from datetime import datetime, timezone
from enum import Enum
from typing import Any
from uuid import UUID

from sqlalchemy.orm import Session

from app.crud.article import (
    apply_article_create_to_row,
    create_article,
    find_article_by_canonical_or_url,
    get_article_by_url,
)
from app.schemas.article import ArticleCreate
from app.schemas.normalized_article import NormalizedFetchedArticle
from app.schemas.trusted_source_config import TrustedSourceConfig
from app.utils.datetime_parse import iso_to_utc_datetime
from app.utils.text_stats import content_sha256_hex, minimal_clean_text, word_count
from app.utils.url_normalize import normalize_article_url

logger = logging.getLogger(__name__)

# Full article should be substantial; cookie banners often exceed 80 chars.
_MIN_BODY_CHARS = 400
# When DOM fallback is used, require a minimum share of text inside <p> vs total (nav-heavy pages fail).
_MIN_PARAGRAPH_RATIO_DOM = 0.12


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
    updated = "updated"
    duplicate = "duplicate"
    rejected = "rejected"


def _full_fetch_meta(raw_meta: dict[str, Any]) -> dict[str, Any]:
    ff = raw_meta.get("full_fetch")
    return ff if isinstance(ff, dict) else {}


def persist_fetched_article(
    db: Session,
    normalized: NormalizedFetchedArticle,
    *,
    adapter_key: str = "",
) -> PersistArticleOutcome:
    """Insert or update by ``url`` / ``canonical_url``. Re-fetching the same ``url`` overwrites body fields.

    ``content_hash`` uses SHA-256 over cleaned/raw text (see module comment in ``text_stats``); identical
    text across URLs yields identical hashes (possible future cross-post merge signal — not applied today).
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

    meta_in = dict(normalized.raw_meta)
    ff = _full_fetch_meta(meta_in)
    method = ff.get("extraction_method")
    p_ratio = ff.get("paragraph_ratio")
    if (
        isinstance(method, str)
        and method != "json_ld"
        and p_ratio is not None
        and isinstance(p_ratio, (int, float))
        and float(p_ratio) < _MIN_PARAGRAPH_RATIO_DOM
    ):
        logger.warning(
            "ingest rejected reason=low_paragraph_density adapter=%s url=%s method=%s ratio=%s",
            adapter_key,
            normalized.url[:200],
            method,
            p_ratio,
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

    url_n = normalize_article_url(normalized.url, base=None)
    canonical_raw = (normalized.canonical_url or "").strip()
    canonical_n = normalize_article_url(canonical_raw, base=None) if canonical_raw else None

    payload = ArticleCreate(
        source_id=normalized.source_id,
        title=title,
        url=url_n,
        canonical_url=canonical_n,
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
        word_count=wc,
    )
    data = payload.model_dump()

    if canonical_n:
        existing = find_article_by_canonical_or_url(db, canonical_n)
        if existing is not None:
            if url_n != existing.url:
                occupant = get_article_by_url(db, url_n)
                if occupant is None or occupant.id == existing.id:
                    data["url"] = url_n
                else:
                    data["url"] = existing.url
            apply_article_create_to_row(existing, data)
            logger.info(
                "ingest updated (canonical match) adapter=%s article_id=%s url=%s",
                adapter_key,
                existing.id,
                url_n[:200],
            )
            return PersistArticleOutcome.updated

    row = create_article(db, payload)
    if row is not None:
        logger.info(
            "ingest inserted adapter=%s article_id=%s url=%s",
            adapter_key,
            row.id,
            url_n[:200],
        )
        return PersistArticleOutcome.inserted

    by_url = get_article_by_url(db, url_n)
    if by_url is not None:
        apply_article_create_to_row(by_url, data)
        logger.info(
            "ingest updated (same url re-fetch) adapter=%s article_id=%s url=%s",
            adapter_key,
            by_url.id,
            url_n[:200],
        )
        return PersistArticleOutcome.updated

    logger.info(
        "ingest duplicate_skip adapter=%s url=%s",
        adapter_key,
        url_n[:200],
    )
    return PersistArticleOutcome.duplicate
