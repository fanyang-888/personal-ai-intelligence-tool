"""Search / archive route: GET /api/search."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.api.mappers import article_to_archive_row, cluster_to_archive_row
from app.api.schemas import SearchResponse
from app.db import get_db
from app.models.article import Article
from app.models.cluster import Cluster

router = APIRouter(prefix="/api/search", tags=["search"])


@router.get("", response_model=SearchResponse)
def search(
    q: str = Query(default="", description="Search keyword"),
    source: str = Query(default="", description="Filter by source name"),
    theme: str = Query(default="", description="Filter by theme/tag"),
    result_type: str = Query(default="cluster", alias="type", description="cluster | article | mixed"),
    limit: int = Query(default=20, le=100),
    db: Session = Depends(get_db),
) -> SearchResponse:
    """Keyword search across clusters and/or articles."""

    cluster_rows = []
    article_rows = []

    if result_type in ("cluster", "mixed"):
        # Only surface translated clusters (same rule as the main listing)
        cluster_q = select(Cluster).where(Cluster.representative_title_zh.isnot(None))

        if q:
            kw = f"%{q}%"
            cluster_q = cluster_q.where(
                or_(
                    Cluster.representative_title.ilike(kw),
                    Cluster.summary.ilike(kw),
                )
            )
        if theme:
            # tags is a JSONB array; use cast to text for simple substring match
            cluster_q = cluster_q.where(
                Cluster.tags.cast(type_=None).astext.ilike(f"%{theme}%")
            )

        cluster_q = cluster_q.order_by(
            Cluster.cluster_score.desc().nullslast()
        ).limit(limit)

        clusters = db.execute(cluster_q).scalars().all()
        cluster_rows = [cluster_to_archive_row(c) for c in clusters]

    if result_type in ("article", "mixed"):
        article_q = select(Article).where(Article.is_filtered_out.is_not(True))

        if q:
            kw = f"%{q}%"
            article_q = article_q.where(
                or_(
                    Article.title.ilike(kw),
                    Article.short_summary.ilike(kw),
                    Article.excerpt.ilike(kw),
                )
            )
        if source:
            article_q = article_q.where(
                Article.organization_name.ilike(f"%{source}%")
            )

        article_q = article_q.order_by(
            Article.signal_score.desc().nullslast(),
            Article.published_at.desc().nullslast(),
        ).limit(limit)

        articles = db.execute(article_q).scalars().all()
        article_rows = [article_to_archive_row(a) for a in articles]

    total = len(cluster_rows) + len(article_rows)

    return SearchResponse(
        query=q,
        resultType=result_type,
        clusters=cluster_rows,
        articles=article_rows,
        total=total,
    )
