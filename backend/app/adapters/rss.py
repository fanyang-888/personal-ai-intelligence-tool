"""RSS/Atom fetch + parse (sync parser offloaded to a thread)."""

from __future__ import annotations

import asyncio
from typing import Any

import feedparser
import httpx

from app.adapters.http_fetch import get_with_retry


async def fetch_feed_entries(
    url: str,
    client: httpx.AsyncClient,
    *,
    etag: str | None = None,
) -> tuple[list[dict[str, Any]], str | None]:
    """Fetch and parse an RSS/Atom feed.

    Sends ``If-None-Match`` when ``etag`` is provided.  Returns
    ``(entries, new_etag)``.  If the server responds 304 Not Modified,
    returns ``([], None)`` — caller should keep the existing etag.
    """
    req_headers: dict[str, str] = {}
    if etag:
        req_headers["If-None-Match"] = etag

    resp = await get_with_retry(client, url, headers=req_headers)

    if resp.status_code == 304:
        return [], None

    new_etag: str | None = resp.headers.get("ETag") or resp.headers.get("etag") or None
    entries = await asyncio.to_thread(_parse_feed_text, resp.text)
    return entries, new_etag


def _parse_feed_text(xml_or_text: str) -> list[dict[str, Any]]:
    parsed = feedparser.parse(xml_or_text)
    if getattr(parsed, "bozo", False) and not parsed.entries:
        exc = getattr(parsed, "bozo_exception", None)
        raise ValueError(f"invalid or empty feed: {exc}")
    out: list[dict[str, Any]] = []
    for e in parsed.entries:
        link = e.get("link")
        if not link and e.get("links"):
            link = e["links"][0].get("href")
        tags: list[str] = []
        if e.get("tags"):
            tags = [str(t.get("term", "")) for t in e.tags if t.get("term")]
        # Capture full content if present (e.g. Substack, VentureBeat inline HTML)
        rss_content: str | None = None
        content_list = e.get("content")
        if content_list and isinstance(content_list, list):
            rss_content = (content_list[0].get("value") or "").strip() or None
        if not rss_content:
            summary_val = (e.get("summary") or "").strip()
            rss_content = summary_val if len(summary_val) > 400 else None
        out.append(
            {
                "title": e.get("title") or "",
                "link": (link or "").strip(),
                "published": e.get("published"),
                "published_parsed": e.get("published_parsed"),
                "author": e.get("author"),
                "summary": (e.get("summary") or "")[:4000],
                "rss_content": rss_content,
                "tags": tags,
                "feed_title": parsed.feed.get("title"),
                "_parser": "feedparser",
            }
        )
    return out
