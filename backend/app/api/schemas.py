"""Pydantic response schemas that match the frontend TypeScript types.

The frontend expects LocalizedString = { en: string; zh?: string }.
Cluster and draft fields are translated to Chinese by the pipeline
(translate_clusters.py, translate_drafts.py) and returned as bilingual
LocalizedStr objects. The frontend falls back to `en` when `zh` is absent.
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from pydantic import BaseModel


# ---------------------------------------------------------------------------
# Shared primitives
# ---------------------------------------------------------------------------

class LocalizedStr(BaseModel):
    en: str
    zh: str | None = None


class AudienceBlocks(BaseModel):
    pm: LocalizedStr
    developer: LocalizedStr
    studentJobSeeker: LocalizedStr


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def localized(text: str | None, fallback: str = "") -> LocalizedStr:
    return LocalizedStr(en=(text or fallback) or fallback)


def localized_bilingual(en: str | None, zh: str | None, fallback: str = "") -> LocalizedStr:
    """Build a LocalizedStr with both en and zh populated when available."""
    return LocalizedStr(en=(en or fallback) or fallback, zh=zh or None)


def freshness_label(dt: datetime | None) -> str:
    if dt is None:
        return "Recently"
    now = datetime.now(timezone.utc)
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    diff = now - dt
    total_minutes = diff.total_seconds() / 60
    if total_minutes < 2:
        return "Just now"
    if total_minutes < 60:
        return f"Updated {int(total_minutes)}m ago"
    hours = total_minutes / 60
    if hours < 24:
        return f"Updated {int(hours)}h ago"
    days = hours / 24
    return f"Updated {int(days)}d ago"


def format_dt(dt: datetime | None) -> str | None:
    if dt is None:
        return None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.isoformat()


# ---------------------------------------------------------------------------
# Cluster schemas
# ---------------------------------------------------------------------------

class ArticleInCluster(BaseModel):
    id: str
    title: str
    url: str
    sourceName: str | None
    publishedAt: str | None
    excerpt: str | None


class ClusterResponse(BaseModel):
    id: str
    clusterType: str
    title: LocalizedStr
    theme: str
    themes: list[str]
    tags: list[str]
    storyStatus: str
    clusterScore: float | None
    freshnessLabel: str
    firstSeenAt: str | None
    lastSeenAt: str | None
    summary: LocalizedStr
    takeaways: list[LocalizedStr]
    whyItMatters: LocalizedStr
    audience: AudienceBlocks
    articleIds: list[str]
    relatedClusterIds: list[str]
    draftId: str | None
    articleCount: int
    sourceCount: int


class DigestResponse(BaseModel):
    date: str
    featured: ClusterResponse | None
    topClusters: list[ClusterResponse]
    draftId: str | None


# ---------------------------------------------------------------------------
# Draft schemas
# ---------------------------------------------------------------------------

class DraftResponse(BaseModel):
    id: str
    clusterId: str | None
    draftType: str = "linkedin"
    title: LocalizedStr
    generatedAt: str | None
    hook: LocalizedStr
    summaryBlock: LocalizedStr
    takeaways: list[LocalizedStr]
    careerInterpretationBlock: LocalizedStr
    audienceWhyItMattersBlock: LocalizedStr
    closingBlock: LocalizedStr | None
    fullText: str
    role: str | None = None  # "pm" | "developer" | "student" | None (generic)


# ---------------------------------------------------------------------------
# Search / archive schemas
# ---------------------------------------------------------------------------

class ArchiveClusterRow(BaseModel):
    id: str
    type: str = "cluster"
    title: str
    title_zh: str | None = None
    summary: str | None
    tags: list[str]
    theme: str
    storyStatus: str
    clusterScore: float | None
    lastSeenAt: str | None
    sourceCount: int


class ArchiveArticleRow(BaseModel):
    id: str
    type: str = "article"
    title: str
    excerpt: str | None
    sourceName: str | None
    publishedAt: str | None
    url: str


class SearchResponse(BaseModel):
    query: str
    resultType: str   # "cluster" | "article" | "mixed"
    clusters: list[ArchiveClusterRow]
    articles: list[ArchiveArticleRow]
    total: int
