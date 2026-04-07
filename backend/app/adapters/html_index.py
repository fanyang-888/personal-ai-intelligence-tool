"""Minimal HTML link extraction for sites without a usable public RSS (stdlib only)."""

from __future__ import annotations

import re
from typing import Any
from urllib.parse import urljoin

# Anthropic newsroom listing embeds these patterns in SSR HTML (verified W2D2).
_ABS_NEWS = re.compile(
    r"https://www\.anthropic\.com/news/[a-z0-9-]+/?",
    re.IGNORECASE,
)
_REL_NEWS = re.compile(r"""href=["'](/news/[a-z0-9-]+/?)["']""", re.IGNORECASE)


def extract_anthropic_news_candidates(html: str) -> list[dict[str, Any]]:
    """Return pseudo-feed entries with ``link`` and a title derived from the URL slug."""
    base = "https://www.anthropic.com"
    urls: set[str] = set()
    for m in _ABS_NEWS.finditer(html):
        urls.add(m.group(0).rstrip("/"))
    for m in _REL_NEWS.finditer(html):
        urls.add(urljoin(base, m.group(1)).rstrip("/"))
    entries: list[dict[str, Any]] = []
    for url in sorted(urls):
        slug = url.rsplit("/", maxsplit=1)[-1]
        title = slug.replace("-", " ").strip().title() or url
        entries.append(
            {
                "title": title,
                "link": url,
                "published": None,
                "published_parsed": None,
                "author": None,
                "summary": "",
                "tags": [],
                "feed_title": None,
                "_parser": "html_index",
            }
        )
    return entries
