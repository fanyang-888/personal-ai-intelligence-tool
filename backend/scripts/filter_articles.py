"""Filter unassessed articles and mark them keep / filtered-out.

Usage (from backend/):
    python -m scripts.filter_articles
    python -m scripts.filter_articles --batch-size 200
    python -m scripts.filter_articles --reassess-all   # reset verdicts and re-run
"""

from __future__ import annotations

import argparse
import logging
import sys

from app.db import session_scope
from app.logging_config import configure_logging
from app.models.article import Article
from app.services.filtering import filter_unassessed_articles

logger = logging.getLogger(__name__)


def _reassess_all(db) -> None:
    """Reset all filter verdicts so every article gets re-assessed."""
    from sqlalchemy import update
    db.execute(
        update(Article).values(is_filtered_out=None, filter_reason=None)
    )
    db.commit()
    logger.info("reset all filter verdicts — will reassess everything")


def main(argv: list[str] | None = None) -> int:
    configure_logging()
    parser = argparse.ArgumentParser(description="Filter unassessed articles")
    parser.add_argument("--batch-size", type=int, default=500, help="Articles per batch (default 500)")
    parser.add_argument("--reassess-all", action="store_true", help="Reset existing verdicts first")
    args = parser.parse_args(argv)

    with session_scope() as db:
        if args.reassess_all:
            _reassess_all(db)

        result = filter_unassessed_articles(db, batch_size=args.batch_size)

    print(
        f"Done — assessed={result['assessed']} "
        f"kept={result['kept']} "
        f"filtered_out={result['filtered_out']} "
        f"skipped={result['skipped']}"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
