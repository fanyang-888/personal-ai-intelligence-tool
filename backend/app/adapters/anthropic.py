"""Anthropic Newsroom — RSS if configured; otherwise HTML index link extraction."""

from __future__ import annotations

import logging
from typing import Any

from app.adapters.article_html import extract_anthropic_article, fetch_html
from app.adapters.base import BaseSourceAdapter
from app.adapters.html_index import extract_anthropic_news_candidates
from app.adapters.http_client import ingestion_http_client
from app.adapters.http_fetch import get_with_retry
from app.adapters.ingestion_limits import apply_entry_limits
from app.adapters.rss import fetch_feed_entries

logger = logging.getLogger(__name__)


class AnthropicNewsroomAdapter(BaseSourceAdapter):
    source_name = "Anthropic Newsroom"
    adapter_key = "anthropic_newsroom"

    async def fetch_article(self, item: dict[str, Any]) -> dict[str, Any]:
        url = (item.get("url") or "").strip()
        if not url:
            return {
                "status": "failed",
                "error": "missing candidate url",
                "error_type": "ValueError",
                "adapter_key": self.adapter_key,
            }
        try:
            async with ingestion_http_client(self.source_config) as client:
                html, final_url = await fetch_html(client, url)
        except Exception as e:
            logger.exception(
                "fetch_article http failure adapter=%s url=%s",
                self.adapter_key,
                url[:200],
            )
            return {
                "status": "failed",
                "error": str(e),
                "error_type": type(e).__name__,
                "url": url,
                "adapter_key": self.adapter_key,
            }
        extracted = extract_anthropic_article(html, final_url)
        raw = (extracted.get("raw_text") or "").strip()
        if len(raw) < 40:
            return {
                "status": "failed",
                "error": "empty_or_short_extraction",
                "error_type": "ParseError",
                "url": url,
                "adapter_key": self.adapter_key,
                "raw_meta": {
                    "full_fetch": {
                        "extraction_method": extracted.get("extraction_method"),
                        "http_final_url": extracted.get("http_final_url"),
                    }
                },
            }
        base_meta = dict(item.get("raw_meta") or {})
        base_meta["full_fetch"] = {
            "site": "anthropic.com",
            "extraction_method": extracted.get("extraction_method"),
            "http_final_url": extracted.get("http_final_url"),
        }
        return {
            "status": "ok",
            "url": url,
            "raw_text": raw,
            "canonical_url": extracted.get("canonical_url"),
            "title_guess": extracted.get("title_guess"),
            "author_guess": extracted.get("author_guess"),
            "excerpt": extracted.get("excerpt"),
            "raw_meta": base_meta,
        }

    async def fetch_index(self) -> list[dict[str, Any]]:
        slug = self.source_config.slug
        logger.info("fetch_index start source=%s slug=%s", self.source_name, slug)
        raw_entries: list[dict[str, Any]] = []
        try:
            async with ingestion_http_client(self.source_config) as client:
                if self.source_config.feed_url:
                    try:
                        raw_entries = await fetch_feed_entries(
                            str(self.source_config.feed_url), client
                        )
                        raw_entries = [r for r in raw_entries if r.get("link")]
                    except Exception as e:
                        logger.warning(
                            "fetch_index rss skipped source=%s slug=%s type=%s msg=%s",
                            self.source_name,
                            slug,
                            type(e).__name__,
                            e,
                        )
                if not raw_entries:
                    logger.info(
                        "fetch_index html_index source=%s slug=%s url=%s",
                        self.source_name,
                        slug,
                        self.source_config.index_url,
                    )
                    resp = await get_with_retry(client, str(self.source_config.index_url))
                    base = str(self.source_config.base_url).rstrip("/")
                    raw_entries = extract_anthropic_news_candidates(resp.text, base_url=base)
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
