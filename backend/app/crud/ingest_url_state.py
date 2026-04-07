"""Track repeated HTTP 403 (and similar) per normalized URL to avoid retry loops."""

from __future__ import annotations

import logging

from sqlalchemy.orm import Session

from app.models.ingest_url_state import IngestUrlState
from app.utils.url_normalize import normalize_article_url

logger = logging.getLogger(__name__)

_MAX_403_BEFORE_BLOCK = 3


def ingest_url_key(url: str) -> str:
    """Stable key aligned with ``articles.url`` normalization (absolute permalinks)."""
    return normalize_article_url(url.strip(), base=None)


def is_url_ingest_blocked(db: Session, url: str) -> bool:
    key = ingest_url_key(url)
    row = db.get(IngestUrlState, key)
    return row is not None and row.ingestion_status == "permanent_failure"


def record_fetch_success(db: Session, url: str) -> None:
    key = ingest_url_key(url)
    row = db.get(IngestUrlState, key)
    if row is None:
        return
    row.http_403_count = 0
    row.ingestion_status = "pending"
    logger.debug("ingest_url_state reset url_key=%s", key[:120])


def record_http_403(db: Session, url: str) -> None:
    key = ingest_url_key(url)
    row = db.get(IngestUrlState, key)
    if row is None:
        db.add(
            IngestUrlState(
                url_key=key,
                http_403_count=1,
                ingestion_status="failed_retriable",
            )
        )
        logger.warning(
            "ingest_url_state first_403 url_key=%s count=1",
            key[:120],
        )
        return
    row.http_403_count += 1
    if row.http_403_count >= _MAX_403_BEFORE_BLOCK:
        row.ingestion_status = "permanent_failure"
        logger.error(
            "ingest_url_state permanent_failure url_key=%s count=%s",
            key[:120],
            row.http_403_count,
        )
    else:
        row.ingestion_status = "failed_retriable"
        logger.warning(
            "ingest_url_state 403 url_key=%s count=%s",
            key[:120],
            row.http_403_count,
        )
