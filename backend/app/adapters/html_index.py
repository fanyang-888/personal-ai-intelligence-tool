"""HTML index link extraction (BeautifulSoup — avoid regex on markup)."""

from __future__ import annotations

import re
from typing import Any
from urllib.parse import urljoin, urlparse

from bs4 import BeautifulSoup

_SLUG_RE = re.compile(r"^[a-z0-9-]+$", re.I)


def extract_anthropic_news_candidates(html: str, base_url: str = "https://www.anthropic.com") -> list[dict[str, Any]]:
    """Collect article links from Anthropic newsroom HTML (SSR); titles from link text or slug."""
    soup = BeautifulSoup(html, "html.parser")
    base = base_url.rstrip("/")
    urls: dict[str, str] = {}
    for a in soup.find_all("a", href=True):
        href = (a.get("href") or "").strip()
        if not href or href.startswith("#"):
            continue
        full = urljoin(base + "/", href)
        parsed = urlparse(full)
        host = (parsed.netloc or "").lower().split(":", 1)[0]
        if host not in ("www.anthropic.com", "anthropic.com"):
            continue
        path = (parsed.path or "").rstrip("/")
        segments = [p for p in path.split("/") if p]
        if len(segments) < 2 or segments[0] != "news":
            continue
        slug = segments[1]
        if not slug or not _SLUG_RE.match(slug):
            continue
        canon = f"https://www.anthropic.com/news/{slug}"
        text = a.get_text(strip=True)
        if canon not in urls or (text and len(text) > len(urls[canon])):
            urls[canon] = text or ""
    entries: list[dict[str, Any]] = []
    for url in sorted(urls):
        title = urls[url].strip()
        if not title:
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
                "_parser": "html_index_bs4",
            }
        )
    return entries
