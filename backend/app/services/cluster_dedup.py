"""Cross-day cluster deduplication service.

When the same story generates a new cluster on day 2, this service merges
the new cluster's articles into the existing "open" cluster instead of
keeping two separate clusters for the same story.

Algorithm:
  1. Find "today's new clusters": status="new", created_at within last 2 hours.
  2. Find "open existing clusters": created before today, status != "fading",
     last_seen_at within last OPEN_CLUSTER_MAX_AGE_DAYS days.
  3. TF-IDF on representative_title of both sets.
  4. For each new cluster, find the best-matching existing cluster above
     MIN_SIMILARITY threshold.
  5. Merge: reassign articles, update existing cluster fields, delete new cluster.
"""

from __future__ import annotations

import logging
import uuid
from datetime import datetime, timedelta, timezone
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.crud.cluster import delete_cluster
from app.models.article import Article
from app.models.cluster import Cluster

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

MIN_SIMILARITY = 0.35          # TF-IDF cosine similarity threshold for merging
NEW_CLUSTER_WINDOW_HOURS = 2   # Clusters created within this window are "today's new"
OPEN_CLUSTER_MAX_AGE_DAYS = 7  # Existing clusters older than this are skipped


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _now_utc() -> datetime:
    return datetime.now(timezone.utc)


def find_new_clusters(db: Session) -> list[Cluster]:
    """Return clusters created in the last NEW_CLUSTER_WINDOW_HOURS hours with status='new'."""
    cutoff = _now_utc() - timedelta(hours=NEW_CLUSTER_WINDOW_HOURS)
    return list(
        db.execute(
            select(Cluster).where(
                Cluster.status == "new",
                Cluster.created_at >= cutoff,
            )
        ).scalars().all()
    )


def find_open_clusters(db: Session, exclude_ids: set[uuid.UUID]) -> list[Cluster]:
    """Return existing open clusters (not fading, recent) excluding given ids."""
    cutoff_old = _now_utc() - timedelta(days=OPEN_CLUSTER_MAX_AGE_DAYS)
    cutoff_new = _now_utc() - timedelta(hours=NEW_CLUSTER_WINDOW_HOURS)
    return list(
        db.execute(
            select(Cluster).where(
                Cluster.status != "fading",
                Cluster.last_seen_at >= cutoff_old,
                Cluster.created_at < cutoff_new,  # exclude today's new clusters
                Cluster.id.not_in(exclude_ids) if exclude_ids else True,
            )
        ).scalars().all()
    )


def _recompute_cluster_fields(db: Session, cluster: Cluster) -> None:
    """Refresh article_count, source_count, last_seen_at, first_seen_at after merge."""
    articles = list(
        db.execute(
            select(Article).where(Article.cluster_id == cluster.id)
        ).scalars().all()
    )
    if not articles:
        return

    cluster.article_count = len(articles)
    cluster.source_count = len({a.source_id for a in articles if a.source_id})

    dates = [a.published_at for a in articles if a.published_at]
    if dates:
        tz_dates = [d.replace(tzinfo=timezone.utc) if d.tzinfo is None else d for d in dates]
        cluster.first_seen_at = min(tz_dates)
        cluster.last_seen_at = max(tz_dates)

    # Recompute score: 60% max signal_score + 15% source diversity + 15% placeholder + 10% recency
    scores = [a.signal_score for a in articles if a.signal_score is not None]
    max_score = max(scores) if scores else 50.0
    source_diversity = min(cluster.source_count, 5) / 5.0 * 100.0
    age_days = (_now_utc() - cluster.last_seen_at).total_seconds() / 86400 if cluster.last_seen_at else 7
    recency = 100.0 if age_days <= 1 else (80.0 if age_days <= 3 else (60.0 if age_days <= 7 else 40.0))
    cluster.cluster_score = round(min(100.0, 0.60 * max_score + 0.15 * source_diversity + 0.15 * 50.0 + 0.10 * recency), 2)


def merge_into(db: Session, source: Cluster, target: Cluster) -> None:
    """Reassign source's articles to target, update target fields, delete source."""
    # Reassign articles
    articles = list(
        db.execute(
            select(Article).where(Article.cluster_id == source.id)
        ).scalars().all()
    )
    for article in articles:
        article.cluster_id = target.id

    db.flush()  # ensure article.cluster_id updates are visible before recompute

    _recompute_cluster_fields(db, target)
    delete_cluster(db, source.id)

    logger.info(
        "dedup merged source=%s into target=%s articles=%d new_count=%d title=%.60s",
        source.id,
        target.id,
        len(articles),
        target.article_count,
        target.representative_title,
    )


# ---------------------------------------------------------------------------
# Main dedup logic
# ---------------------------------------------------------------------------

def run_dedup(db: Session, min_similarity: float = MIN_SIMILARITY) -> dict[str, int]:
    """Find duplicate new clusters and merge them into existing open clusters.

    Returns {"new_clusters": N, "open_clusters": M, "merged": K}.
    """
    new_clusters = find_new_clusters(db)
    if not new_clusters:
        logger.info("dedup: no new clusters this run")
        return {"new_clusters": 0, "open_clusters": 0, "merged": 0}

    new_ids = {c.id for c in new_clusters}
    open_clusters = find_open_clusters(db, exclude_ids=new_ids)

    logger.info(
        "dedup: new_clusters=%d open_clusters=%d",
        len(new_clusters),
        len(open_clusters),
    )

    if not open_clusters:
        return {"new_clusters": len(new_clusters), "open_clusters": 0, "merged": 0}

    # TF-IDF on titles
    try:
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.metrics.pairwise import cosine_similarity
    except ImportError:
        logger.warning("dedup: sklearn not available, skipping")
        return {"new_clusters": len(new_clusters), "open_clusters": len(open_clusters), "merged": 0}

    new_titles = [c.representative_title or "" for c in new_clusters]
    open_titles = [c.representative_title or "" for c in open_clusters]

    all_titles = new_titles + open_titles
    vectorizer = TfidfVectorizer(ngram_range=(1, 2), stop_words="english")
    try:
        tfidf = vectorizer.fit_transform(all_titles)
    except ValueError:
        logger.warning("dedup: TF-IDF failed (empty corpus?)")
        return {"new_clusters": len(new_clusters), "open_clusters": len(open_clusters), "merged": 0}

    n_new = len(new_clusters)
    new_vecs = tfidf[:n_new]
    open_vecs = tfidf[n_new:]

    # similarity matrix: (n_new, n_open)
    sims = cosine_similarity(new_vecs, open_vecs)

    merged = 0
    merged_new_ids: set[uuid.UUID] = set()

    for i, new_cluster in enumerate(new_clusters):
        if new_cluster.id in merged_new_ids:
            continue
        best_j = int(sims[i].argmax())
        best_sim = float(sims[i, best_j])
        if best_sim < min_similarity:
            continue
        target = open_clusters[best_j]
        merge_into(db, source=new_cluster, target=target)
        merged_new_ids.add(new_cluster.id)
        merged += 1

    if merged:
        db.commit()

    logger.info("dedup done: merged=%d / %d new clusters", merged, len(new_clusters))
    return {"new_clusters": len(new_clusters), "open_clusters": len(open_clusters), "merged": merged}
