"""Abstract base for trusted source adapters."""

from __future__ import annotations

from abc import ABC, abstractmethod
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from typing import Any

from app.schemas.trusted_source_config import TrustedSourceConfig


class BaseSourceAdapter(ABC):
    """Fetch and normalize article candidates from one configured trusted source."""

    source_name: str
    adapter_key: str

    def __init__(self, source_config: TrustedSourceConfig | dict) -> None:
        if isinstance(source_config, dict):
            source_config = TrustedSourceConfig.model_validate(source_config)
        self.source_config = source_config

    @abstractmethod
    async def fetch_index(self) -> list[dict[str, Any]]:
        """Fetch recent article candidates (normalized dicts)."""

    async def fetch_article(self, item: dict[str, Any]) -> dict[str, Any]:
        """Full body fetch deferred (Day 3+)."""
        return {
            "url": item.get("url"),
            "html": None,
            "status": "deferred",
        }

    def normalize(self, raw: dict[str, Any]) -> dict[str, Any]:
        """Map parser-specific ``raw`` into the shared candidate schema."""
        title = (raw.get("title") or "").strip() or "Untitled"
        url = (raw.get("link") or "").strip()
        author = raw.get("author")
        author_name = author.strip() if isinstance(author, str) and author.strip() else None
        published_at = _published_at_iso(raw)
        raw_meta = {
            "summary": raw.get("summary"),
            "tags": raw.get("tags") or [],
            "feed_title": raw.get("feed_title"),
            "parser": raw.get("_parser"),
        }
        return {
            "title": title,
            "url": url,
            "published_at": published_at,
            "author_name": author_name,
            "raw_meta": raw_meta,
        }


def _published_at_iso(raw: dict[str, Any]) -> str | None:
    pub = raw.get("published")
    if isinstance(pub, str) and pub.strip():
        try:
            return parsedate_to_datetime(pub).isoformat()
        except (TypeError, ValueError):
            return pub.strip()
    tup = raw.get("published_parsed")
    if tup:
        try:
            dt = datetime(
                tup.tm_year,
                tup.tm_mon,
                tup.tm_mday,
                tup.tm_hour,
                tup.tm_min,
                tup.tm_sec,
                tzinfo=timezone.utc,
            )
            return dt.isoformat()
        except (TypeError, ValueError, AttributeError):
            pass
    return None
