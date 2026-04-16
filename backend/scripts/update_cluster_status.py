"""Update cluster lifecycle status based on age and article volume.

Runs after cluster_articles.py.  Reclassifies every cluster from the
default "new" status to ongoing / escalating / peaking / fading as
the story ages and article count accumulates.

Usage:
    cd backend/
    python -m scripts.update_cluster_status
"""

from __future__ import annotations

import logging
import sys

from app.db import SessionLocal
from app.logging_config import configure_logging
from app.services.status_tracking import update_all_cluster_statuses

configure_logging()
logger = logging.getLogger(__name__)


def main(argv: list[str] | None = None) -> int:
    with SessionLocal() as db:
        status_counts = update_all_cluster_statuses(db)

    if not status_counts:
        logger.info("update_cluster_status: no clusters found")
        return 0

    logger.info("update_cluster_status done: %s", status_counts)
    return 0


if __name__ == "__main__":
    sys.exit(main())
