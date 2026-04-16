"""arXiv RSS adapter for cs.AI and cs.LG feeds.

Thin subclass of GenericRSSAdapter.  The only difference is that arXiv RSS
entries carry the full abstract inline in <description>, so we:
  1. Strip HTML tags from the description.
  2. Remove the leading "Abstract:" prefix that arXiv RSS sometimes includes.

The inline-content strategy in GenericRSSAdapter handles the rest — arXiv
abstracts are typically 1000–2000 characters, well above the 400-char
threshold, so no URL fetching is needed.

URL deduplication in the ingest pipeline handles papers that appear in both
cs.AI and cs.LG feeds (same arxiv.org/abs/XXXX URL → silently skipped on
second insertion).
"""

from __future__ import annotations

from typing import Any

from app.adapters.generic_rss import GenericRSSAdapter, _strip_html


class ArxivRSSAdapter(GenericRSSAdapter):
    source_name = "arXiv RSS"
    adapter_key = "arxiv"

    def _normalize_with_content(self, raw: dict[str, Any]) -> dict[str, Any]:
        candidate = super()._normalize_with_content(raw)

        # arXiv RSS puts the abstract in <description> (mapped to raw["summary"]
        # by feedparser) — re-clean it in case base class picked up HTML entities.
        rss_content: str = (
            candidate["raw_meta"].get("rss_content")
            or raw.get("summary")
            or ""
        )
        plain = _strip_html(rss_content).strip()

        # Strip the "Abstract:" label that arXiv occasionally prepends.
        if plain.lower().startswith("abstract:"):
            plain = plain[9:].strip()

        if plain:
            candidate["raw_meta"]["rss_content"] = plain

        return candidate
