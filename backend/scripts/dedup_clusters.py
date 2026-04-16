"""Merge duplicate cross-day clusters into existing open clusters.

Runs after cluster_articles.py and update_cluster_status.py.  Finds new
clusters created in this pipeline run and merges them into existing open
clusters when their titles are sufficiently similar (TF-IDF cosine >= 0.35).

Usage:
    cd backend/
    python -m scripts.dedup_clusters [--min-similarity 0.35]
"""

from __future__ import annotations

import argparse
import logging
import sys

from app.db import SessionLocal
from app.logging_config import configure_logging
from app.services.cluster_dedup import run_dedup

configure_logging()
logger = logging.getLogger(__name__)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Merge duplicate cross-day clusters")
    parser.add_argument("--min-similarity", type=float, default=0.35)
    args = parser.parse_args(argv if argv is not None else sys.argv[1:])

    with SessionLocal() as db:
        stats = run_dedup(db, min_similarity=args.min_similarity)

    logger.info("dedup_clusters done: %s", stats)
    return 0


if __name__ == "__main__":
    sys.exit(main())
