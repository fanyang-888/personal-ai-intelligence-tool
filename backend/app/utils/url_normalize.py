"""Normalize article URLs for stable dedupe (Day 3 persistence / ON CONFLICT)."""

from __future__ import annotations

from urllib.parse import parse_qsl, urljoin, urlparse, urlunparse

# Strip common tracking params; extend as needed.
_STRIP_QUERY_PREFIXES = ("utm_",)
_STRIP_QUERY_KEYS = frozenset({"fbclid", "gclid", "mc_cid", "mc_eid"})


def normalize_article_url(url: str, *, base: str | None = None) -> str:
    """Resolve relative URLs, drop tracking query params, trim trailing slash (non-root paths)."""
    u = (url or "").strip()
    if not u:
        return u
    if base and u.startswith("/"):
        u = urljoin(base.rstrip("/") + "/", u.lstrip("/"))
    parsed = urlparse(u)
    if not parsed.scheme or not parsed.netloc:
        return u
    pairs = [
        (k, v)
        for k, v in parse_qsl(parsed.query, keep_blank_values=True)
        if k.lower() not in _STRIP_QUERY_KEYS and not k.lower().startswith(_STRIP_QUERY_PREFIXES)
    ]
    from urllib.parse import urlencode

    new_query = urlencode(pairs)
    path = parsed.path or "/"
    if path != "/" and path.endswith("/"):
        path = path.rstrip("/")
    return urlunparse((parsed.scheme, parsed.netloc.lower(), path, "", new_query, ""))
