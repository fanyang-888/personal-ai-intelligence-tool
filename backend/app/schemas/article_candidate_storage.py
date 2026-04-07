"""Pydantic shape for persisting normalized candidates (aware UTC ``published_at``)."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.utils.datetime_parse import iso_to_utc_datetime


class ArticleCandidateStorage(BaseModel):
    """Use before DB insert to ensure TIMESTAMPTZ-safe datetimes."""

    model_config = ConfigDict(extra="ignore")

    title: str
    url: str
    published_at: datetime | None = None
    author_name: str | None = None
    raw_meta: dict[str, Any] = Field(default_factory=dict)

    @field_validator("published_at", mode="before")
    @classmethod
    def coerce_published_at(cls, v: Any) -> datetime | None:
        if v is None or isinstance(v, datetime):
            return v
        if isinstance(v, str):
            return iso_to_utc_datetime(v)
        return None
