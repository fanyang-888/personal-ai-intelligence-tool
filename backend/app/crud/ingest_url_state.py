"""Track repeated HTTP 403 (and similar) per normalized URL to avoid retry loops."""

from __future__ import annotations

import logging
from datetime import datetime, timedelta, timezone

from sqlalchemy import delete
from sqlalchemy.orm import Session

from app.models.ingest_url_state import IngestUrlState
from app.utils.url_normalize import normalize_article_url

logger = logging.getLogger(__name__)

_MAX_403_BEFORE_BLOCK = 3
# After permanent_failure, allow automatic retry once this window passes (proxy / deploy change).
_RETRY_COOLDOWN = timedelta(days=7)


def ingest_url_key(url: str) -> str:
    """Stable key aligned with ``articles.url`` normalization (absolute permalinks)."""
    return normalize_article_url(url.strip(), base=None)


def is_url_ingest_blocked(db: Session, url: str) -> bool:
    """Block only ``permanent_failure`` rows until ``retry_at`` (if set) has passed.

    Legacy rows with ``permanent_failure`` and ``retry_at IS NULL`` stay blocked until
    :func:`force_reset_ingest_url_failures` or manual DB fix.
    """
    key = ingest_url_key(url)
    row = db.get(IngestUrlState, key)
    if row is None or row.ingestion_status != "permanent_failure":
        return False
    now = datetime.now(timezone.utc)
    if row.retry_at is None:
        return True
    return now < row.retry_at


def record_fetch_success(db: Session, url: str) -> None:
    key = ingest_url_key(url)
    row = db.get(IngestUrlState, key)
    if row is None:
        return
    row.http_403_count = 0
    row.ingestion_status = "pending"
    row.retry_at = None
    logger.debug("ingest_url_state reset url_key=%s", key[:120])


def record_http_403(db: Session, url: str) -> None:
    key = ingest_url_key(url)
    row = db.get(IngestUrlState, key)
    now = datetime.now(timezone.utc)
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
        row.retry_at = now + _RETRY_COOLDOWN
        logger.error(
            "ingest_url_state permanent_failure url_key=%s count=%s retry_after=%s",
            key[:120],
            row.http_403_count,
            row.retry_at.isoformat() if row.retry_at else "",
        )
    else:
        row.ingestion_status = "failed_retriable"
        logger.warning(
            "ingest_url_state 403 url_key=%s count=%s",
            key[:120],
            row.http_403_count,
        )


def force_reset_ingest_url_failures(db: Session) -> int:
    """Clear all URL fetch state (403 counters and bans). For ``--force-retry-failures``."""
    r = db.execute(delete(IngestUrlState))
    n = r.rowcount if r.rowcount is not None else 0
    logger.warning("ingest_url_states cleared rows=%s", n)
    return int(n)
