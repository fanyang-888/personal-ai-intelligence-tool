"""Persistence helpers for articles (used by ingestion adapters)."""

from __future__ import annotations

import logging

from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from app.models.article import Article
from app.schemas.article import ArticleCreate

logger = logging.getLogger(__name__)


def create_article(db: Session, article_in: ArticleCreate) -> Article | None:
    """Insert an article. Returns ``None`` if ``url`` already exists (unique constraint).

    Does not commit. With :func:`app.db.session_scope`, the scope commits on exit.
    With FastAPI :func:`app.db.get_db`, call ``db.commit()`` in the route after success.
    """
    data = article_in.model_dump()
    stmt = (
        insert(Article)
        .values(**data)
        .on_conflict_do_nothing(index_elements=["url"])
        .returning(Article.id)
    )
    article_id = db.execute(stmt).scalar_one_or_none()
    if article_id is None:
        logger.debug("skip duplicate url=%s", article_in.url[:200])
        return None
    article = db.get(Article, article_id)
    logger.info("inserted article id=%s url=%s", article_id, article_in.url[:200])
    return article
