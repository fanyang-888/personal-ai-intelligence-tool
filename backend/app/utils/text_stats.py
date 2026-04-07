"""Lightweight text metrics for ingested articles (Day 3; Day 4 may replace)."""

from __future__ import annotations

import hashlib
import re

import bleach


def sanitize_plaintext_for_storage(text: str) -> str:
    """Strip any residual markup/attributes before persistence (defense in depth for XSS).

    ``cleaned_text`` / ``raw_text`` are intended as **plain text** for UI (use text nodes or escape).
    BeautifulSoup ``get_text`` usually removes tags; this pass removes stray tags and event attributes.
    """
    if not text or not str(text).strip():
        return (text or "").strip()
    return bleach.clean(str(text), tags=[], attributes={}, strip=True).strip()


def minimal_clean_text(text: str) -> str:
    """Strip ends and collapse internal whitespace (no linguistic cleaning)."""
    t = (text or "").strip()
    if not t:
        return ""
    return re.sub(r"\s+", " ", t)


def word_count(text: str) -> int:
    """Split on whitespace; empty string → 0."""
    t = (text or "").strip()
    if not t:
        return 0
    return len(t.split())


def content_sha256_hex(text: str) -> str:
    """SHA-256 hex digest of UTF-8 bytes (``content_hash``).

    Identical body text under different URLs yields the same digest (possible signal for
    cross-posts); we do **not** merge rows on hash today—dedupe remains URL/canonical merge only.
    """
    body = (text or "").encode("utf-8")
    return hashlib.sha256(body).hexdigest()
