"""Single-page HTML fetch and extraction helpers (not a crawler)."""

from __future__ import annotations

import json
import logging
import re
from typing import Any
from urllib.parse import urljoin

import httpx
from bs4 import BeautifulSoup

from app.adapters.http_fetch import get_with_retry

logger = logging.getLogger(__name__)

# Bump when boilerplate / ratio / JSON-LD heuristics change (enables future re-ingest decisions).
ARTICLE_HTML_PARSER_VERSION = "article_html/v3"

_BOILERPLATE_CLASS_KEYS = (
    "related-posts",
    "related_posts",
    "social-share",
    "social_share",
    "share-buttons",
    "newsletter",
    "sidebar",
    "comments-area",
    "comment-list",
    "popular-posts",
    "recommended",
)


def strip_boilerplate_tags(soup: BeautifulSoup) -> None:
    """Remove nav/header/footer/aside and noisy class blocks before main-text extraction (mutates soup)."""
    for tag in soup.find_all(["nav", "header", "footer", "aside"]):
        tag.decompose()
    for div in soup.find_all("div"):
        attrs = getattr(div, "attrs", None) or {}
        cls_attr = attrs.get("class")
        if not cls_attr:
            continue
        classes = " ".join(cls_attr if isinstance(cls_attr, list) else [str(cls_attr)]).lower()
        if any(k in classes for k in _BOILERPLATE_CLASS_KEYS):
            div.decompose()


def paragraph_text_ratio(soup: BeautifulSoup) -> float | None:
    """Share of visible characters in ``<p>`` and ``<li>`` vs document (list-heavy posts included)."""
    blocks = soup.find_all(["p", "li"])
    if not blocks:
        return None
    block_len = sum(len(el.get_text(strip=True)) for el in blocks)
    total = len(soup.get_text(strip=True))
    if total <= 0:
        return None
    return block_len / total


async def fetch_html(client: httpx.AsyncClient, url: str) -> tuple[str, str]:
    """GET ``url``; return ``(html_text, final_url_after_redirects)``.

    Use ``Content-Type`` charset when present (``charset_encoding``), then optional ``<meta charset>``
    sniff if the header omitted it.
    """
    resp = await get_with_retry(client, url)
    ce = resp.charset_encoding
    if ce:
        resp.encoding = ce
    else:
        resp.encoding = "utf-8"
    text = resp.text
    if not ce:
        m = re.search(
            rb'<meta[^>]+charset=["\']?([^"\'\\s>]+)',
            resp.content[:65536],
            re.I,
        )
        if m:
            try:
                decl = m.group(1).decode("ascii", errors="ignore").strip().lower()
                if decl and decl not in ("utf-8", "utf8"):
                    text = resp.content.decode(decl, errors="replace")
            except (LookupError, UnicodeDecodeError):
                pass
    return text, str(resp.url)


def _parse_json_ld_article(soup: BeautifulSoup) -> tuple[str | None, str | None, str | None]:
    """Return ``(article_body, headline, author_name)`` from JSON-LD if present."""
    for script in soup.find_all("script", type=True):
        st = (script.get("type") or "").lower()
        if "ld+json" not in st:
            continue
        raw = script.string or script.get_text() or ""
        if not raw.strip():
            continue
        try:
            data = json.loads(raw)
        except json.JSONDecodeError as e:
            logger.info(
                "article_html json_ld parse skipped reason=invalid_json err=%s",
                e.__class__.__name__,
            )
            continue
        if isinstance(data, dict) and "@graph" in data and isinstance(data["@graph"], list):
            data = data["@graph"]
        blobs = data if isinstance(data, list) else [data]
        for obj in blobs:
            if not isinstance(obj, dict):
                continue
            types = obj.get("@type")
            if isinstance(types, list):
                tset = {str(x).lower() for x in types}
            elif types:
                tset = {str(types).lower()}
            else:
                tset = set()
            if not tset & {"article", "newsarticle", "blogposting", "webpage"}:
                continue
            body = obj.get("articleBody") or obj.get("text")
            if isinstance(body, str) and len(body.strip()) > 80:
                head = obj.get("headline") or obj.get("name")
                head_s = head.strip() if isinstance(head, str) else None
                author = obj.get("author")
                auth_name = None
                if isinstance(author, dict):
                    n = author.get("name")
                    auth_name = n.strip() if isinstance(n, str) else None
                elif isinstance(author, str):
                    auth_name = author.strip()
                return body.strip(), head_s, auth_name
    return None, None, None


def meta_canonical_and_open_graph(soup: BeautifulSoup, final_url: str) -> dict[str, str | None]:
    """``canonical_url``, ``og:url``, ``og:title``, ``og:description``."""
    out: dict[str, str | None] = {
        "canonical_url": None,
        "og_url": None,
        "og_title": None,
        "og_description": None,
    }
    link = soup.find("link", rel=lambda x: x and "canonical" in str(x).lower().split())
    if link and link.get("href"):
        out["canonical_url"] = urljoin(final_url, str(link["href"]).strip())
    for prop, key in (
        ("og:url", "og_url"),
        ("og:title", "og_title"),
        ("og:description", "og_description"),
    ):
        m = soup.find("meta", property=prop)
        if m and m.get("content"):
            out[key] = str(m["content"]).strip()
    if not out["canonical_url"] and out["og_url"]:
        out["canonical_url"] = out["og_url"]
    return out


def _visible_block_text(node: Any) -> str:
    return node.get_text(separator="\n", strip=True) if node else ""


def fallback_main_text(soup: BeautifulSoup, *, site_hint: str) -> str | None:
    """Order: ``article``, ``main``, role=article, heuristic ``div`` classes."""
    for finder in (
        lambda: soup.find("article"),
        lambda: soup.find("main"),
        lambda: soup.find(attrs={"role": "article"}),
    ):
        el = finder()
        t = _visible_block_text(el)
        if len(t) > 120:
            return t
    class_keywords = ("article-content", "entry-content", "post-content", "prose", "article__")
    if site_hint == "techcrunch":
        class_keywords = ("article-content", "entry-content") + class_keywords
    for div in soup.find_all("div"):
        attrs = getattr(div, "attrs", None) or {}
        cls_attr = attrs.get("class")
        if not cls_attr:
            continue
        classes = " ".join(cls_attr if isinstance(cls_attr, list) else [str(cls_attr)]).lower()
        if any(k in classes for k in class_keywords):
            t = _visible_block_text(div)
            if len(t) > 200:
                return t
    return None


def _extract_with_logging(
    site: str,
    soup: BeautifulSoup,
    final_url: str,
    *,
    site_hint: str,
    techcrunch_selectors_first: bool = False,
) -> dict[str, Any]:
    """Shared pipeline: JSON-LD → optional TechCrunch div → DOM fallback; logs extraction path."""
    body, headline, author = _parse_json_ld_article(soup)
    meta = meta_canonical_and_open_graph(soup, final_url)
    method: str | None = None
    p_ratio: float | None = None

    if body:
        method = "json_ld"
        p_ratio = None
        logger.info("article_html extraction site=%s method=json_ld url=%s", site, final_url[:120])
    else:
        if techcrunch_selectors_first:
            node = soup.select_one(".article-content") or soup.select_one("article")
            body = _visible_block_text(node) if node else None
            if body and len(body) > 120:
                method = "techcrunch_selectors"
                p_ratio = paragraph_text_ratio(soup)
                logger.info(
                    "article_html extraction site=%s method=techcrunch_selectors paragraph_ratio=%s url=%s",
                    site,
                    f"{p_ratio:.3f}" if p_ratio is not None else "n/a",
                    final_url[:120],
                )
        if not body:
            body = fallback_main_text(soup, site_hint=site_hint)
            method = "dom_fallback"
            p_ratio = paragraph_text_ratio(soup)
            logger.info(
                "article_html extraction site=%s method=dom_fallback paragraph_ratio=%s url=%s",
                site,
                f"{p_ratio:.3f}" if p_ratio is not None else "n/a",
                final_url[:120],
            )

    excerpt = meta.get("og_description")
    if excerpt and body and isinstance(excerpt, str) and excerpt in body[:500]:
        excerpt = excerpt[:280]
    return {
        "raw_text": body,
        "canonical_url": meta.get("canonical_url"),
        "title_guess": headline or meta.get("og_title"),
        "author_guess": author,
        "excerpt": excerpt if isinstance(excerpt, str) else None,
        "extraction_method": method,
        "http_final_url": final_url,
        "paragraph_ratio": p_ratio,
        "parser_version": ARTICLE_HTML_PARSER_VERSION,
    }


def extract_openai_article(html: str, final_url: str) -> dict[str, Any]:
    soup = BeautifulSoup(html, "html.parser")
    strip_boilerplate_tags(soup)
    out = _extract_with_logging("openai.com", soup, final_url, site_hint="openai")
    return out


def extract_anthropic_article(html: str, final_url: str) -> dict[str, Any]:
    soup = BeautifulSoup(html, "html.parser")
    strip_boilerplate_tags(soup)
    return _extract_with_logging("anthropic.com", soup, final_url, site_hint="anthropic")


def extract_techcrunch_article(html: str, final_url: str) -> dict[str, Any]:
    soup = BeautifulSoup(html, "html.parser")
    strip_boilerplate_tags(soup)
    return _extract_with_logging(
        "techcrunch.com",
        soup,
        final_url,
        site_hint="techcrunch",
        techcrunch_selectors_first=True,
    )
