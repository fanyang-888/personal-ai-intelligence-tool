"""OpenAI News — RSS first, optional HTML fallback flag (RSS is primary in practice)."""

from __future__ import annotations

import logging
from typing import Any

import httpx

from app.adapters.article_html import extract_openai_article, fetch_html
from app.adapters.base import BaseSourceAdapter
from app.adapters.http_client import ingestion_http_client
from app.adapters.ingestion_limits import apply_entry_limits
from app.adapters.rss import fetch_feed_entries

logger = logging.getLogger(__name__)


class OpenAINewsAdapter(BaseSourceAdapter):
    source_name = "OpenAI News"
    adapter_key = "openai_news"

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
        except httpx.HTTPStatusError as e:
            logger.warning(
                "fetch_article http error adapter=%s url=%s status=%s",
                self.adapter_key,
                url[:200],
                e.response.status_code,
            )
            return {
                "status": "failed",
                "error": str(e),
                "error_type": type(e).__name__,
                "http_status": e.response.status_code,
                "url": url,
                "adapter_key": self.adapter_key,
            }
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
        extracted = extract_openai_article(html, final_url)
        raw = (extracted.get("raw_text") or "").strip()
        if len(raw) < 200:
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
                        "paragraph_ratio": extracted.get("paragraph_ratio"),
                        "parser_version": extracted.get("parser_version"),
                    }
                },
            }
        base_meta = dict(item.get("raw_meta") or {})
        base_meta["full_fetch"] = {
            "site": "openai.com",
            "extraction_method": extracted.get("extraction_method"),
            "http_final_url": extracted.get("http_final_url"),
            "paragraph_ratio": extracted.get("paragraph_ratio"),
            "parser_version": extracted.get("parser_version"),
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
