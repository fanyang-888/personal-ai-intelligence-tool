"""Align PostgreSQL ``sources`` rows with ``trusted_sources.yaml`` (by ``slug``)."""

from __future__ import annotations

import logging
from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.source import Source
from app.schemas.trusted_source_config import TrustedSourceConfig

logger = logging.getLogger(__name__)


def upsert_source_from_trusted_config(db: Session, config: TrustedSourceConfig) -> Source:
    """Insert or update a ``Source`` keyed by ``config.slug``.

    Legacy rows from ``scripts.seed_sources`` keep ``slug=NULL`` and are untouched.
    Trusted publishers use slugs such as ``openai-news`` matching the YAML file.
    """
    stmt = select(Source).where(Source.slug == config.slug)
    row = db.execute(stmt).scalar_one_or_none()
    feed = str(config.feed_url) if config.feed_url else None
    base = str(config.base_url)
    if row is not None:
        row.name = config.name
        row.type = config.type
        row.base_url = base
        row.feed_url = feed
        row.is_active = config.is_active
        row.fetch_frequency_minutes = config.fetch_frequency_minutes
        db.flush()
        logger.info("updated source slug=%s id=%s", config.slug, row.id)
        return row
    src = Source(
        slug=config.slug,
        name=config.name,
        type=config.type,
        base_url=base,
        feed_url=feed,
        is_active=config.is_active,
        fetch_frequency_minutes=config.fetch_frequency_minutes,
    )
    db.add(src)
    db.flush()
    logger.info("inserted source slug=%s id=%s", config.slug, src.id)
    return src


def update_source_poll_state(
    db: Session,
    source_id: int,
    *,
    etag: str | None = None,
) -> None:
    """Stamp ``last_polled_at`` and optionally update ``etag`` for the given source."""
    row = db.get(Source, source_id)
    if row is None:
        return
    row.last_polled_at = datetime.now(timezone.utc)
    if etag is not None:
        row.etag = etag
    db.commit()
