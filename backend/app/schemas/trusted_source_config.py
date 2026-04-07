"""Validated trusted-source definitions (YAML-backed, Week 2 Day 2)."""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field, HttpUrl


IngestionMethod = Literal["rss", "rss_primary_html_fallback"]


class TrustedSourceConfig(BaseModel):
    """One trusted publisher entry; drives adapter registry and fetch behavior."""

    name: str = Field(min_length=1)
    slug: str = Field(min_length=1, pattern=r"^[a-z0-9-]+$")
    type: str = Field(min_length=1, description="High-level channel, e.g. company_news")
    base_url: HttpUrl
    feed_url: HttpUrl | None = None
    index_url: HttpUrl
    adapter_key: str = Field(min_length=1)
    ingestion_method: IngestionMethod
    is_active: bool = True
    fetch_frequency_minutes: int = Field(ge=1)
    source_priority: int = Field(ge=0, description="Lower = higher priority for future ranking")
    default_language: str = Field(min_length=2, max_length=16)
