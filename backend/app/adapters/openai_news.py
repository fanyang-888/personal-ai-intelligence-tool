"""OpenAI News — RSS first, optional HTML fallback flag (RSS is primary in practice)."""

from __future__ import annotations

import logging
from typing import Any

from app.adapters.base import BaseSourceAdapter
from app.adapters.http_client import ingestion_http_client
from app.adapters.ingestion_limits import apply_entry_limits
from app.adapters.rss import fetch_feed_entries

logger = logging.getLogger(__name__)


class OpenAINewsAdapter(BaseSourceAdapter):
    source_name = "OpenAI News"
    adapter_key = "openai_news"

    async def fetch_index(self) -> list[dict[str, Any]]:
        slug = self.source_config.slug
        logger.info("fetch_index start source=%s slug=%s", self.source_name, slug)
        if not self.source_config.feed_url:
            logger.error("fetch_index failure source=%s reason=no_feed_url", slug)
            raise ValueError("openai_news requires feed_url")
        try:
            async with ingestion_http_client(self.source_config) as client:
                raw_entries = await fetch_feed_entries(str(self.source_config.feed_url), client)
            rows = apply_entry_limits(
                [r for r in raw_entries if r.get("link")],
                self.source_config,
            )
            if not rows and self.source_config.ingestion_method == "rss_primary_html_fallback":
                logger.warning(
                    "fetch_index rss empty source=%s; HTML fallback not implemented for OpenAI (Day 3)",
                    slug,
                )
            candidates = [self.normalize(r) for r in rows]
            logger.info(
                "fetch_index success source=%s slug=%s items=%s",
                self.source_name,
                slug,
                len(candidates),
            )
            return candidates
        except Exception as e:
            logger.exception(
                "fetch_index failure source=%s slug=%s type=%s msg=%s",
                self.source_name,
                slug,
                type(e).__name__,
                e,
            )
            raise
