"""Generic RSS adapter — works for any RSS/Atom feed.

Content strategy:
  1. If the RSS entry carries full inline content (e.g. Substack ``<content:encoded>``
     or a long ``<description>``), use it directly — no HTTP fetch needed.
  2. Otherwise fetch the article URL and extract via the generic HTML extractor.

This covers:
  - VentureBeat AI   (full text in RSS <description>)
  - Import AI        (full HTML in <content:encoded>)
  - TLDR AI          (excerpt only — falls back to URL fetch)
  - Hugging Face Blog (no RSS body — falls back to URL fetch)
"""

from __future__ import annotations

import logging
from typing import Any

import httpx
from bs4 import BeautifulSoup

from app.adapters.article_html import extract_generic_article, fetch_html
from app.adapters.base import BaseSourceAdapter
from app.adapters.http_client import ingestion_http_client
from app.adapters.ingestion_limits import apply_entry_limits
from app.adapters.rss import fetch_feed_entries

logger = logging.getLogger(__name__)

# Minimum characters to trust RSS inline content instead of fetching the URL.
_MIN_RSS_CONTENT_CHARS = 400


def _strip_html(html: str) -> str:
    """Quick plain-text extraction from an HTML string (no HTTP fetch)."""
    try:
        soup = BeautifulSoup(html, "html.parser")
        return soup.get_text(separator="\n", strip=True)
    except Exception:
        return html


class GenericRSSAdapter(BaseSourceAdapter):
    source_name = "Generic RSS"
    adapter_key = "generic_rss"

    # ------------------------------------------------------------------
    # Index
    # ------------------------------------------------------------------

    async def fetch_index(self) -> list[dict[str, Any]]:
        slug = self.source_config.slug
        logger.info("fetch_index start source=%s slug=%s", self.source_name, slug)
        if not self.source_config.feed_url:
            logger.error("fetch_index failure source=%s reason=no_feed_url", slug)
            raise ValueError("generic_rss requires feed_url")
        try:
            etag: str | None = getattr(self.source_config, "etag", None)
            async with ingestion_http_client(self.source_config) as client:
                raw_entries, new_etag = await fetch_feed_entries(
                    str(self.source_config.feed_url), client, etag=etag
                )
            # Store etag for caller to persist
            self._new_etag: str | None = new_etag
            if not raw_entries:
                logger.info(
                    "fetch_index 304_not_modified source=%s slug=%s",
                    self.source_name, slug,
                )
                return []
            rows = apply_entry_limits(
                [r for r in raw_entries if r.get("link")],
                self.source_config,
            )
            candidates = [self._normalize_with_content(r) for r in rows]
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

    def _normalize_with_content(self, raw: dict[str, Any]) -> dict[str, Any]:
        """Extend base normalize() to preserve RSS inline content in raw_meta."""
        candidate = self.normalize(raw)
        rss_content = raw.get("rss_content")
        if rss_content:
            candidate["raw_meta"]["rss_content"] = rss_content
        return candidate

    # ------------------------------------------------------------------
    # Article fetch
    # ------------------------------------------------------------------

    async def fetch_article(self, item: dict[str, Any]) -> dict[str, Any]:
        url = (item.get("url") or "").strip()
        if not url:
            return {
                "status": "failed",
                "error": "missing candidate url",
                "error_type": "ValueError",
                "adapter_key": self.adapter_key,
            }

        raw_meta = dict(item.get("raw_meta") or {})
        rss_content: str | None = raw_meta.get("rss_content")

        # --- Strategy 1: inline RSS content ---
        if rss_content and len(rss_content) >= _MIN_RSS_CONTENT_CHARS:
            plain = _strip_html(rss_content)
            if len(plain) >= _MIN_RSS_CONTENT_CHARS:
                raw_meta["full_fetch"] = {
                    "site": "rss_inline",
                    "extraction_method": "rss_content",
                    "http_final_url": url,
                    "paragraph_ratio": None,
                    "parser_version": "rss_inline/v1",
                }
                logger.info(
                    "fetch_article rss_inline source=%s url=%s chars=%d",
                    self.source_config.slug,
                    url[:120],
                    len(plain),
                )
                return {
                    "status": "ok",
                    "url": url,
                    "raw_text": plain,
                    "canonical_url": url,
                    "title_guess": None,
                    "author_guess": None,
                    "excerpt": None,
                    "raw_meta": raw_meta,
                }

        # --- Strategy 2: fetch URL ---
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

        extracted = extract_generic_article(html, final_url)
        raw_text = (extracted.get("raw_text") or "").strip()
        if len(raw_text) < 200:
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

        raw_meta["full_fetch"] = {
            "site": self.source_config.slug,
            "extraction_method": extracted.get("extraction_method"),
            "http_final_url": extracted.get("http_final_url"),
            "paragraph_ratio": extracted.get("paragraph_ratio"),
            "parser_version": extracted.get("parser_version"),
        }
        return {
            "status": "ok",
            "url": url,
            "raw_text": raw_text,
            "canonical_url": extracted.get("canonical_url"),
            "title_guess": extracted.get("title_guess"),
            "author_guess": extracted.get("author_guess"),
            "excerpt": extracted.get("excerpt"),
            "raw_meta": raw_meta,
        }
