"""CRUD helpers for clusters."""

from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any

from sqlalchemy.orm import Session

from app.models.article import Article
from app.models.cluster import Cluster


def create_cluster(
    db: Session,
    *,
    cluster_type: str,
    status: str,
    representative_title: str,
    cluster_score: float | None,
    article_count: int,
    source_count: int,
    first_seen_at: datetime | None,
    last_seen_at: datetime | None,
    tags: list[Any] | None = None,
    meta: dict[str, Any] | None = None,
) -> Cluster:
    """Insert a new Cluster row and return it. Does not commit."""
    cluster = Cluster(
        id=uuid.uuid4(),
        type=cluster_type,
        status=status,
        representative_title=representative_title,
        cluster_score=cluster_score,
        article_count=article_count,
        source_count=source_count,
        first_seen_at=first_seen_at,
        last_seen_at=last_seen_at,
        tags=tags or [],
        meta=meta or {},
    )
    db.add(cluster)
    db.flush()  # populate cluster.id without full commit
    return cluster


def assign_articles_to_cluster(
    db: Session,
    cluster_id: uuid.UUID,
    articles: list[Article],
) -> None:
    """Set cluster_id on each article. Does not commit."""
    for article in articles:
        article.cluster_id = cluster_id


def get_cluster_by_id(db: Session, cluster_id: uuid.UUID) -> Cluster | None:
    return db.get(Cluster, cluster_id)


def delete_cluster(db: Session, cluster_id: uuid.UUID) -> None:
    """Delete a cluster row by id. Does not commit."""
    cluster = db.get(Cluster, cluster_id)
    if cluster:
        db.delete(cluster)


def get_top_clusters(db: Session, limit: int = 10) -> list[Cluster]:
    """Return top clusters ordered by cluster_score desc, most recent first."""
    from sqlalchemy import select
    return list(
        db.execute(
            select(Cluster)
            .order_by(Cluster.cluster_score.desc().nullslast(), Cluster.last_seen_at.desc().nullslast())
            .limit(limit)
        ).scalars().all()
    )
