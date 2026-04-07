from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ArticleCreate(BaseModel):
    """Payload for inserting an article (adapters / ingestion)."""

    source_id: UUID
    title: str = Field(min_length=1)
    url: str = Field(min_length=1)
    canonical_url: str | None = None
    published_at: datetime | None = None
    fetched_at: datetime | None = None
    raw_text: str | None = None
    cleaned_text: str | None = None
    excerpt: str | None = None
    content_hash: str | None = None
    language: str | None = None


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
    created_at: datetime
    updated_at: datetime
