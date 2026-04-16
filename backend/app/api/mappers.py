"""Map ORM models → API response schemas."""

from __future__ import annotations

from app.api.schemas import (
    AudienceBlocks,
    ArchiveArticleRow,
    ArchiveClusterRow,
    ClusterResponse,
    DraftResponse,
    LocalizedStr,
    format_dt,
    freshness_label,
    localized,
    localized_bilingual,
)
from app.models.article import Article
from app.models.cluster import Cluster
from app.models.draft import Draft


def cluster_to_response(
    cluster: Cluster,
    draft_id: str | None = None,
) -> ClusterResponse:
    tags: list[str] = cluster.tags or []
    themes: list[str] = []

    # Collect themes from cluster tags (first 3)
    if tags:
        themes = tags[:3]

    takeaways_raw: list[str] = cluster.takeaways or []

    # Audience blocks
    audience = AudienceBlocks(
        pm=localized_bilingual(cluster.why_it_matters_pm, getattr(cluster, "why_it_matters_pm_zh", None), "See cluster summary for context."),
        developer=localized_bilingual(cluster.why_it_matters_dev, getattr(cluster, "why_it_matters_dev_zh", None), "See cluster summary for context."),
        studentJobSeeker=localized_bilingual(cluster.why_it_matters_students, getattr(cluster, "why_it_matters_students_zh", None), "See cluster summary for context."),
    )

    takeaways_zh: list[str] = getattr(cluster, "takeaways_zh", None) or []
    bilingual_takeaways = []
    for i, t in enumerate(takeaways_raw):
        zh_t = takeaways_zh[i] if i < len(takeaways_zh) else None
        bilingual_takeaways.append(localized_bilingual(t, zh_t))
    while len(bilingual_takeaways) < 3:
        bilingual_takeaways.append(localized(""))

    article_ids = [
        str(a.id) for a in (cluster.articles or [])
    ]

    return ClusterResponse(
        id=str(cluster.id),
        clusterType=cluster.type or "event",
        title=localized_bilingual(cluster.representative_title, getattr(cluster, "representative_title_zh", None), "Untitled Story"),
        theme=cluster.type or "event",
        themes=themes,
        tags=tags,
        storyStatus=cluster.status or "new",
        clusterScore=cluster.cluster_score,
        freshnessLabel=freshness_label(cluster.last_seen_at),
        firstSeenAt=format_dt(cluster.first_seen_at),
        lastSeenAt=format_dt(cluster.last_seen_at),
        summary=localized_bilingual(cluster.summary, getattr(cluster, "summary_zh", None), cluster.representative_title),
        takeaways=bilingual_takeaways,
        whyItMatters=localized_bilingual(cluster.why_it_matters, getattr(cluster, "why_it_matters_zh", None), ""),
        audience=audience,
        articleIds=article_ids,
        relatedClusterIds=[],
        draftId=draft_id,
        articleCount=cluster.article_count or 0,
        sourceCount=cluster.source_count or 0,
    )


def draft_to_response(draft: Draft) -> DraftResponse:
    takeaways_raw: list[str] = draft.takeaways or []
    takeaways = [localized(t) for t in takeaways_raw]
    while len(takeaways) < 3:
        takeaways.append(localized(""))

    cluster_title = ""
    if draft.cluster:
        cluster_title = draft.cluster.representative_title or ""

    return DraftResponse(
        id=str(draft.id),
        clusterId=str(draft.cluster_id) if draft.cluster_id else None,
        draftType="linkedin",
        title=localized(cluster_title or "Draft"),
        generatedAt=format_dt(draft.generated_at),
        hook=localized(draft.hook, ""),
        summaryBlock=localized(draft.summary_text, ""),
        takeaways=takeaways,
        careerInterpretationBlock=localized(draft.career_take, ""),
        audienceWhyItMattersBlock=localized(
            draft.cluster.why_it_matters if draft.cluster else None, ""
        ),
        closingBlock=localized(draft.closing) if draft.closing else None,
        fullText=draft.full_text or "",
    )


def cluster_to_archive_row(cluster: Cluster) -> ArchiveClusterRow:
    return ArchiveClusterRow(
        id=str(cluster.id),
        type="cluster",
        title=cluster.representative_title or "",
        summary=cluster.summary,
        tags=cluster.tags or [],
        theme=cluster.type or "event",
        storyStatus=cluster.status or "new",
        clusterScore=cluster.cluster_score,
        lastSeenAt=format_dt(cluster.last_seen_at),
        sourceCount=cluster.source_count or 0,
    )


def article_to_archive_row(article: Article) -> ArchiveArticleRow:
    return ArchiveArticleRow(
        id=str(article.id),
        type="article",
        title=article.title or "",
        excerpt=article.excerpt or article.short_summary,
        sourceName=article.organization_name,
        publishedAt=format_dt(article.published_at),
        url=article.url or "",
    )
