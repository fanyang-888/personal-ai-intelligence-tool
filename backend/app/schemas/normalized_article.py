"""Normalized full-article shape after fetch + parse (before DB persistence)."""

from __future__ import annotations

from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, Field


class NormalizedFetchedArticle(BaseModel):
    """Fields required for a successful persist: ``source_id``, ``title``, ``url``, ``fetched_at``,
    and at least one non-empty body field (``raw_text`` or ``cleaned_text``) — enforced in
    :func:`app.services.article_ingest.persist_fetched_article`.
    """

    source_id: UUID
    title: str
    url: str
    canonical_url: str | None = None
    author_name: str | None = None
    organization_name: str | None = None
    published_at: datetime | None = None
    fetched_at: datetime
    raw_text: str | None = None
    cleaned_text: str | None = None
    excerpt: str | None = None
    content_hash: str | None = None
    word_count: int | None = None
    language: str | None = None
    raw_meta: dict[str, Any] = Field(default_factory=dict)
