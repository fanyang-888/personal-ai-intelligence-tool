"""Single-page HTML fetch and extraction helpers (not a crawler)."""

from __future__ import annotations

import json
from typing import Any
from urllib.parse import urljoin

import httpx
from bs4 import BeautifulSoup

from app.adapters.http_fetch import get_with_retry


async def fetch_html(client: httpx.AsyncClient, url: str) -> tuple[str, str]:
    """GET ``url``; return ``(html_text, final_url_after_redirects)``."""
    resp = await get_with_retry(client, url)
    return resp.text, str(resp.url)


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
        except json.JSONDecodeError:
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
    for div in soup.find_all("div", class_=True):
        classes = " ".join(div.get("class", [])).lower()
        if any(k in classes for k in class_keywords):
            t = _visible_block_text(div)
            if len(t) > 200:
                return t
    return None


def extract_openai_article(html: str, final_url: str) -> dict[str, Any]:
    """OpenAI news / blog HTML → text + metadata."""
    soup = BeautifulSoup(html, "html.parser")
    body, headline, author = _parse_json_ld_article(soup)
    meta = meta_canonical_and_open_graph(soup, final_url)
    method = "json_ld" if body else None
    if not body:
        body = fallback_main_text(soup, site_hint="openai")
        method = "dom_fallback"
    excerpt = meta.get("og_description")
    if excerpt and body and excerpt in body[:500]:
        excerpt = excerpt[:280]
    return {
        "raw_text": body,
        "canonical_url": meta.get("canonical_url"),
        "title_guess": headline or meta.get("og_title"),
        "author_guess": author,
        "excerpt": excerpt if isinstance(excerpt, str) else None,
        "extraction_method": method,
        "http_final_url": final_url,
    }


def extract_anthropic_article(html: str, final_url: str) -> dict[str, Any]:
    soup = BeautifulSoup(html, "html.parser")
    body, headline, author = _parse_json_ld_article(soup)
    meta = meta_canonical_and_open_graph(soup, final_url)
    method = "json_ld" if body else None
    if not body:
        body = fallback_main_text(soup, site_hint="anthropic")
        method = "dom_fallback"
    excerpt = meta.get("og_description")
    return {
        "raw_text": body,
        "canonical_url": meta.get("canonical_url"),
        "title_guess": headline or meta.get("og_title"),
        "author_guess": author,
        "excerpt": excerpt if isinstance(excerpt, str) else None,
        "extraction_method": method,
        "http_final_url": final_url,
    }


def extract_techcrunch_article(html: str, final_url: str) -> dict[str, Any]:
    soup = BeautifulSoup(html, "html.parser")
    body, headline, author = _parse_json_ld_article(soup)
    meta = meta_canonical_and_open_graph(soup, final_url)
    method = "json_ld" if body else None
    if not body:
        # TechCrunch often uses .article-content
        node = soup.select_one(".article-content") or soup.select_one("article")
        body = _visible_block_text(node) if node else None
        if body and len(body) > 120:
            method = "techcrunch_selectors"
        else:
            body = fallback_main_text(soup, site_hint="techcrunch")
            method = "dom_fallback"
    excerpt = meta.get("og_description")
    return {
        "raw_text": body,
        "canonical_url": meta.get("canonical_url"),
        "title_guess": headline or meta.get("og_title"),
        "author_guess": author,
        "excerpt": excerpt if isinstance(excerpt, str) else None,
        "extraction_method": method,
        "http_final_url": final_url,
    }
