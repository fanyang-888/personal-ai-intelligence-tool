"""Score all unscored articles in the database.

Usage (from backend/):
    python -m scripts.score_articles
    python -m scripts.score_articles --batch-size 200
    python -m scripts.score_articles --rescore-all   # reset scores and re-run
"""

from __future__ import annotations

import argparse
import logging
import sys

from app.db import session_scope
from app.logging_config import configure_logging
from app.models.article import Article
from app.services.scoring import score_unscored_articles

logger = logging.getLogger(__name__)


def _rescore_all(db) -> None:
    """Reset all signal_score fields so every article gets re-scored."""
    from sqlalchemy import update
    db.execute(
        update(Article).values(signal_score=None, score_components=None, scored_at=None)
    )
    db.commit()
    logger.info("reset all scores — will re-score everything")


def main(argv: list[str] | None = None) -> int:
    configure_logging()
    parser = argparse.ArgumentParser(description="Score unscored articles")
    parser.add_argument("--batch-size", type=int, default=500, help="Articles per batch (default 500)")
    parser.add_argument("--rescore-all", action="store_true", help="Reset existing scores first")
    args = parser.parse_args(argv)

    with session_scope() as db:
        if args.rescore_all:
            _rescore_all(db)

        result = score_unscored_articles(db, batch_size=args.batch_size)

    print(f"Done — processed={result['processed']} skipped={result['skipped']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
