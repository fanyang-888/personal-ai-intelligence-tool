"""Cluster unclustered articles into story clusters.

Usage (from backend/):
    python -m scripts.cluster_articles
    python -m scripts.cluster_articles --reset   # unassign all clusters and re-run
"""

from __future__ import annotations

import argparse
import logging
import sys

from app.db import session_scope
from app.logging_config import configure_logging
from app.services.clustering import run_clustering

logger = logging.getLogger(__name__)


def _reset_all(db) -> None:
    """Clear all cluster assignments and delete all clusters so we can re-run."""
    from sqlalchemy import update, delete
    from app.models.article import Article
    from app.models.cluster import Cluster

    db.execute(update(Article).values(cluster_id=None))
    db.execute(delete(Cluster))
    db.commit()
    logger.info("reset: cleared all cluster assignments and cluster rows")


def main(argv: list[str] | None = None) -> int:
    configure_logging()
    parser = argparse.ArgumentParser(description="Cluster unclustered articles")
    parser.add_argument("--reset", action="store_true", help="Clear existing clusters and re-run")
    args = parser.parse_args(argv)

    with session_scope() as db:
        if args.reset:
            _reset_all(db)

        result = run_clustering(db)

    print(
        f"Done — articles_processed={result['articles_processed']} "
        f"clusters_created={result['clusters_created']}"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
