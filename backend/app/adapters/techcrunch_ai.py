"""TechCrunch AI category — RSS only."""

from __future__ import annotations

import logging
from typing import Any

from app.adapters.base import BaseSourceAdapter
from app.adapters.http_client import ingestion_http_client
from app.adapters.ingestion_limits import apply_entry_limits
from app.adapters.rss import fetch_feed_entries

logger = logging.getLogger(__name__)


class TechCrunchAIAdapter(BaseSourceAdapter):
    source_name = "TechCrunch AI"
    adapter_key = "techcrunch_ai"

    async def fetch_index(self) -> list[dict[str, Any]]:
        slug = self.source_config.slug
        logger.info("fetch_index start source=%s slug=%s", self.source_name, slug)
        if not self.source_config.feed_url:
            logger.error("fetch_index failure source=%s reason=no_feed_url", slug)
            raise ValueError("techcrunch_ai requires feed_url")
        try:
            async with ingestion_http_client(self.source_config) as client:
                raw_entries = await fetch_feed_entries(str(self.source_config.feed_url), client)
            rows = apply_entry_limits(
                [r for r in raw_entries if r.get("link")],
                self.source_config,
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
