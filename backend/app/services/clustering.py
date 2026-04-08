"""Clustering service — groups related articles into story clusters.

Algorithm (v1 hybrid rule-based):
  1. Fetch all eligible articles: is_filtered_out != True, cluster_id IS NULL,
     published within the last WINDOW_DAYS days.
  2. Build a text corpus: title + " " + (excerpt or cleaned_text[:400]).
  3. TF-IDF vectorize the corpus.
  4. Compute pairwise cosine similarity.
  5. Union-Find: merge pairs whose similarity >= SIMILARITY_THRESHOLD and whose
     publication dates are within DATE_PROXIMITY_DAYS of each other.
  6. For each group (including singletons):
       - type = "event" if date span <= EVENT_MAX_DAYS else "theme"
       - representative_title = title of highest-scored article
       - cluster_score = computed from article scores + source diversity + recency
       - Insert Cluster row; set article.cluster_id for all members.

Cluster score formula:
  cluster_score = 0.60 × max_article_score
                + 0.15 × source_diversity_score   (0–100, based on unique source count)
                + 0.15 × 50                        (theme consistency placeholder)
                + 0.10 × recency_score             (0–100, based on most recent article)
"""

from __future__ import annotations

import logging
import uuid
from datetime import datetime, timedelta, timezone
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.crud.cluster import create_cluster, assign_articles_to_cluster
from app.models.article import Article
from app.models.cluster import Cluster

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
WINDOW_DAYS = 7               # only cluster articles published in last N days
SIMILARITY_THRESHOLD = 0.28   # TF-IDF cosine similarity to link two articles
DATE_PROXIMITY_DAYS = 5       # articles > N days apart → cannot share an event cluster
EVENT_MAX_DAYS = 3            # cluster date span <= N days → "event", else "theme"


# ---------------------------------------------------------------------------
# Union-Find (path compression + rank)
# ---------------------------------------------------------------------------

class _UnionFind:
    def __init__(self, n: int) -> None:
        self._parent = list(range(n))
        self._rank = [0] * n

    def find(self, x: int) -> int:
        while self._parent[x] != x:
            self._parent[x] = self._parent[self._parent[x]]  # path compression
            x = self._parent[x]
        return x

    def union(self, x: int, y: int) -> None:
        rx, ry = self.find(x), self.find(y)
        if rx == ry:
            return
        if self._rank[rx] < self._rank[ry]:
            rx, ry = ry, rx
        self._parent[ry] = rx
        if self._rank[rx] == self._rank[ry]:
            self._rank[rx] += 1

    def groups(self) -> dict[int, list[int]]:
        from collections import defaultdict
        g: dict[int, list[int]] = defaultdict(list)
        for i in range(len(self._parent)):
            g[self.find(i)].append(i)
        return dict(g)


# ---------------------------------------------------------------------------
# Cluster score
# ---------------------------------------------------------------------------

def _recency_score_100(dt: datetime | None) -> float:
    if dt is None:
        return 40.0
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    age_days = (datetime.now(timezone.utc) - dt).total_seconds() / 86400
    if age_days <= 1:
        return 100.0
    if age_days <= 3:
        return 80.0
    if age_days <= 7:
        return 60.0
    if age_days <= 14:
        return 40.0
    return 20.0


def _compute_cluster_score(articles: list[Article]) -> float:
    scores = [a.signal_score for a in articles if a.signal_score is not None]
    max_score = max(scores) if scores else 50.0

    unique_sources = len({a.source_id for a in articles})
    source_diversity = min(unique_sources, 5) / 5.0 * 100.0

    latest = max(
        (a.published_at for a in articles if a.published_at),
        default=None,
    )
    recency = _recency_score_100(latest)

    raw = (
        0.60 * max_score
        + 0.15 * source_diversity
        + 0.15 * 50.0          # theme consistency placeholder
        + 0.10 * recency
    )
    return round(min(100.0, max(0.0, raw)), 2)


# ---------------------------------------------------------------------------
# Main clustering logic
# ---------------------------------------------------------------------------

def _fetch_eligible_articles(db: Session) -> list[Article]:
    cutoff = datetime.now(timezone.utc) - timedelta(days=WINDOW_DAYS)
    return list(
        db.execute(
            select(Article).where(
                Article.cluster_id.is_(None),
                Article.is_filtered_out.is_not(True),
                Article.published_at >= cutoff,
            )
        ).scalars().all()
    )


def _build_corpus(articles: list[Article]) -> list[str]:
    docs = []
    for a in articles:
        body = (a.excerpt or (a.cleaned_text or "")[:400]).strip()
        docs.append(f"{a.title} {body}")
    return docs


def _dates_compatible(a: Article, b: Article) -> bool:
    """True if the two articles are within DATE_PROXIMITY_DAYS of each other."""
    da, db_ = a.published_at, b.published_at
    if da is None or db_ is None:
        return True  # unknown dates → allow grouping
    if da.tzinfo is None:
        da = da.replace(tzinfo=timezone.utc)
    if db_.tzinfo is None:
        db_ = db_.replace(tzinfo=timezone.utc)
    return abs((da - db_).total_seconds()) <= DATE_PROXIMITY_DAYS * 86400


def run_clustering(db: Session) -> dict[str, int]:
    """Cluster all eligible unclustered articles.

    Returns ``{"articles_processed": N, "clusters_created": M}``.
    """
    articles = _fetch_eligible_articles(db)
    if not articles:
        logger.info("clustering: no eligible articles found")
        return {"articles_processed": 0, "clusters_created": 0}

    logger.info("clustering: %d eligible articles", len(articles))

    # Import here to avoid top-level sklearn cost at app startup
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
    import numpy as np

    corpus = _build_corpus(articles)
    vectorizer = TfidfVectorizer(
        max_features=8000,
        ngram_range=(1, 2),
        stop_words="english",
        min_df=1,
    )
    try:
        tfidf_matrix = vectorizer.fit_transform(corpus)
    except ValueError:
        logger.warning("clustering: TF-IDF failed (empty corpus?)")
        return {"articles_processed": 0, "clusters_created": 0}

    n = len(articles)
    uf = _UnionFind(n)

    # Compute similarity in chunks to avoid huge memory for large n
    chunk = 64
    for start in range(0, n, chunk):
        end = min(start + chunk, n)
        sims = cosine_similarity(tfidf_matrix[start:end], tfidf_matrix)  # (chunk, n)
        for i_local, i_global in enumerate(range(start, end)):
            for j in range(i_global + 1, n):
                sim = float(sims[i_local, j])
                if sim >= SIMILARITY_THRESHOLD and _dates_compatible(articles[i_global], articles[j]):
                    uf.union(i_global, j)

    groups = uf.groups()
    clusters_created = 0

    for root, indices in groups.items():
        group_articles = [articles[i] for i in indices]

        # Determine cluster type
        dates = [a.published_at for a in group_articles if a.published_at]
        if dates:
            if any(d.tzinfo is None for d in dates):
                dates = [d.replace(tzinfo=timezone.utc) if d.tzinfo is None else d for d in dates]
            span_days = (max(dates) - min(dates)).total_seconds() / 86400
            cluster_type = "event" if span_days <= EVENT_MAX_DAYS else "theme"
            first_seen = min(dates)
            last_seen = max(dates)
        else:
            cluster_type = "event"
            first_seen = last_seen = None

        # Representative title: highest-scored article, fallback to first
        scored = [(a.signal_score or 0.0, a) for a in group_articles]
        best = max(scored, key=lambda x: x[0])[1]
        representative_title = best.title

        cluster_score = _compute_cluster_score(group_articles)
        unique_sources = len({a.source_id for a in group_articles})

        cluster = create_cluster(
            db,
            cluster_type=cluster_type,
            status="new",
            representative_title=representative_title,
            cluster_score=cluster_score,
            article_count=len(group_articles),
            source_count=unique_sources,
            first_seen_at=first_seen,
            last_seen_at=last_seen,
        )

        assign_articles_to_cluster(db, cluster_id=cluster.id, articles=group_articles)
        clusters_created += 1
        logger.info(
            "cluster created id=%s type=%s articles=%d score=%.1f title=%.60s",
            cluster.id, cluster_type, len(group_articles), cluster_score, representative_title,
        )

    db.commit()
    logger.info(
        "clustering done: articles=%d clusters=%d",
        len(articles), clusters_created,
    )
    return {"articles_processed": len(articles), "clusters_created": clusters_created}
