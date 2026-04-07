from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ArticleCreate(BaseModel):
    """Payload for inserting an article (adapters / ingestion)."""

    source_id: UUID
    title: str = Field(min_length=1)
    url: str = Field(
        min_length=1,
        description="Stable fetch identity; must match DB UNIQUE and create_article ON CONFLICT key.",
    )
    canonical_url: str | None = Field(
        default=None,
        description="Optional metadata; service layer may merge/update by canonical when set.",
    )
    published_at: datetime | None = None
    fetched_at: datetime | None = None
    raw_text: str | None = None
    cleaned_text: str | None = None
    excerpt: str | None = None
    content_hash: str | None = None
    language: str | None = None
    author_name: str | None = None
    organization_name: str | None = None
    raw_meta: dict[str, Any] = Field(default_factory=dict)
    word_count: int | None = Field(default=None, ge=0)


class ArticleRead(BaseModel):
    """Read shape for future article APIs."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    source_id: UUID
    title: str
    url: str
    canonical_url: str | None
    published_at: datetime | None
    fetched_at: datetime | None
    raw_text: str | None
    cleaned_text: str | None
    excerpt: str | None
    content_hash: str | None
    language: str | None
    author_name: str | None
    organization_name: str | None
    raw_meta: dict[str, Any]
    word_count: int | None
    created_at: datetime
    updated_at: datetime
