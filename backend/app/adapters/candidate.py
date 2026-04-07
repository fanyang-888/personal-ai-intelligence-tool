"""Normalized shape returned from ``fetch_index`` (before DB persistence)."""

from __future__ import annotations

from typing import TypedDict


class ArticleCandidate(TypedDict):
    """Shared article candidate for ingestion pipelines."""

    title: str
    url: str
    published_at: str | None
    author_name: str | None
    raw_meta: dict
