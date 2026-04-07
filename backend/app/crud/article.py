"""Persistence helpers for articles (used by ingestion adapters)."""

from __future__ import annotations

import logging
from typing import Any

from sqlalchemy import or_, select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from app.models.article import Article
from app.schemas.article import ArticleCreate

logger = logging.getLogger(__name__)


def create_article(db: Session, article_in: ArticleCreate) -> Article | None:
    """Insert an article. Returns ``None`` if ``url`` already exists (unique constraint).

    Dedupe is on **``url`` only** (not ``canonical_url``). Pass the fetch identity you use for
    stable comparison (typically the final request URL or normalized permalink).

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


def find_article_by_canonical_or_url(db: Session, canonical: str) -> Article | None:
    """Return a row whose ``canonical_url`` or ``url`` equals ``canonical`` (normalized caller)."""
    if not canonical or not canonical.strip():
        return None
    c = canonical.strip()
    return db.execute(
        select(Article).where(or_(Article.canonical_url == c, Article.url == c)).limit(1)
    ).scalar_one_or_none()


def get_article_by_url(db: Session, url: str) -> Article | None:
    return db.execute(select(Article).where(Article.url == url)).scalar_one_or_none()


def apply_article_create_to_row(row: Article, data: dict[str, Any]) -> None:
    """Copy insert-shaped fields onto an existing ORM row (refresh / merge)."""
    for key in (
        "source_id",
        "title",
        "url",
        "canonical_url",
        "published_at",
        "fetched_at",
        "raw_text",
        "cleaned_text",
        "excerpt",
        "content_hash",
        "language",
        "author_name",
        "organization_name",
        "raw_meta",
        "word_count",
    ):
        if key in data:
            setattr(row, key, data[key])
