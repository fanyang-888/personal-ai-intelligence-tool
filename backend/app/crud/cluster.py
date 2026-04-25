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


def get_top_clusters(
    db: Session,
    limit: int = 10,
    window_days: int = 14,
    decay_rate: float = 0.15,
) -> list[Cluster]:
    """Return translated top clusters ranked by recency-weighted score.

    Ranking formula: cluster_score × exp(-decay_rate × age_in_days)

    decay_rate = 0.15 means:
      - today (0 d):  100 % of score
      - 3 days ago:    64 %
      - 7 days ago:    35 %
      - 14 days ago:   12 %

    This ensures fresh clusters surface above stale high-scoring ones while
    still respecting quality signal. Tune decay_rate to taste (higher = more
    aggressive recency preference).

    Only clusters with a Chinese title are returned so untranslated content
    never surfaces on the frontend.
    """
    from datetime import timezone, timedelta
    from sqlalchemy import select, func

    cutoff = datetime.now(timezone.utc) - timedelta(days=window_days)

    # Age in days: NOW() - last_seen_at, clamped to ≥ 0
    age_days = func.greatest(
        func.extract("epoch", func.now() - Cluster.last_seen_at) / 86400.0,
        0.0,
    )
    recency_score = Cluster.cluster_score * func.exp(-decay_rate * age_days)

    return list(
        db.execute(
            select(Cluster)
            .where(
                Cluster.representative_title_zh.isnot(None),
                Cluster.last_seen_at >= cutoff,
            )
            .order_by(recency_score.desc().nullslast(), Cluster.last_seen_at.desc().nullslast())
            .limit(limit)
        ).scalars().all()
    )
