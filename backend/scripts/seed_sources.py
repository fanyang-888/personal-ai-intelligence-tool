"""Insert dev seed rows into ``sources`` if missing (idempotent by ``name``).

Run from ``backend/``:

    python -m scripts.seed_sources

Requires ``DATABASE_URL`` (and other app env vars) via ``.env`` or the environment.
"""

from __future__ import annotations

import logging

from sqlalchemy import select

from app.db import session_scope
from app.logging_config import configure_logging
from app.models.source import Source

logger = logging.getLogger(__name__)

# Stable display names — re-running skips rows that already exist with the same name.
_SEED_SOURCES: tuple[dict[str, object], ...] = (
    {
        "name": "Seed: Example RSS",
        "type": "rss",
        "base_url": "https://example.com",
        "feed_url": "https://example.com/news/rss",
        "is_active": True,
        "fetch_frequency_minutes": 60,
    },
    {
        "name": "Seed: Example Web crawl",
        "type": "web",
        "base_url": "https://example.org/docs",
        "feed_url": None,
        "is_active": True,
        "fetch_frequency_minutes": 120,
    },
)


def seed_sources() -> int:
    """Returns number of rows inserted."""
    configure_logging()
    inserted = 0
    with session_scope() as db:
        for row in _SEED_SOURCES:
            name = str(row["name"])
            exists = db.execute(select(Source.id).where(Source.name == name)).first()
            if exists:
                logger.info("skip existing source name=%r", name)
                continue
            db.add(Source(**row))
            inserted += 1
            logger.info("inserted source name=%r", name)
    return inserted


if __name__ == "__main__":
    n = seed_sources()
    logger.info("seed_sources done: inserted %s row(s)", n)
