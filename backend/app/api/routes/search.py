"""Search / archive route: GET /api/search."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, or_, select
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
    offset: int = Query(default=0, ge=0),
    sort_by: str = Query(default="score", description="score | date"),
    db: Session = Depends(get_db),
) -> SearchResponse:
    """Keyword search across clusters and/or articles."""

    cluster_rows = []
    article_rows = []
    total = 0

    if result_type in ("cluster", "mixed"):
        # Only surface translated clusters (same rule as the main listing)
        base_cluster_q = select(Cluster).where(Cluster.representative_title_zh.isnot(None))

        if q:
            kw = f"%{q}%"
            base_cluster_q = base_cluster_q.where(
                or_(
                    Cluster.representative_title.ilike(kw),
                    Cluster.summary.ilike(kw),
                )
            )
        if theme:
            base_cluster_q = base_cluster_q.where(
                Cluster.tags.cast(type_=None).astext.ilike(f"%{theme}%")
            )

        # Count total matching rows (before pagination)
        count_q = select(func.count()).select_from(base_cluster_q.subquery())
        total += db.execute(count_q).scalar_one()

        # Sort
        if sort_by == "date":
            base_cluster_q = base_cluster_q.order_by(Cluster.last_seen_at.desc().nullslast())
        else:
            base_cluster_q = base_cluster_q.order_by(Cluster.cluster_score.desc().nullslast())

        clusters = db.execute(base_cluster_q.offset(offset).limit(limit)).scalars().all()
        cluster_rows = [cluster_to_archive_row(c) for c in clusters]

    if result_type in ("article", "mixed"):
        base_article_q = select(Article).where(Article.is_filtered_out.is_not(True))

        if q:
            kw = f"%{q}%"
            base_article_q = base_article_q.where(
                or_(
                    Article.title.ilike(kw),
                    Article.short_summary.ilike(kw),
                    Article.excerpt.ilike(kw),
                )
            )
        if source:
            base_article_q = base_article_q.where(
                Article.organization_name.ilike(f"%{source}%")
            )

        count_q = select(func.count()).select_from(base_article_q.subquery())
        total += db.execute(count_q).scalar_one()

        if sort_by == "date":
            base_article_q = base_article_q.order_by(Article.published_at.desc().nullslast())
        else:
            base_article_q = base_article_q.order_by(
                Article.signal_score.desc().nullslast(),
                Article.published_at.desc().nullslast(),
            )

        articles = db.execute(base_article_q.offset(offset).limit(limit)).scalars().all()
        article_rows = [article_to_archive_row(a) for a in articles]

    return SearchResponse(
        query=q,
        resultType=result_type,
        clusters=cluster_rows,
        articles=article_rows,
        total=total,
    )
