"""Cluster status tracking service.

Classifies each cluster's lifecycle status based on age and article volume.
Runs daily after clustering to keep status fields current.

Status values:
  new        — created within the last 24 hours
  escalating — 1–3 days old with high article volume (≥ 5 articles)
  ongoing    — 1–4 days old with moderate activity (≥ 2 articles)
  peaking    — 3–6 days old with high volume (≥ 5 articles)
  fading     — older than 4 days with low activity

Rules are evaluated in order; first match wins.
Thresholds are module-level constants — easy to tune without touching logic.
"""

from __future__ import annotations

import logging
from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.cluster import Cluster

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Thresholds
# ---------------------------------------------------------------------------

AGE_NEW_HOURS = 24        # Under this age → always "new"
AGE_FADING_DAYS = 4       # Over this age with low count → "fading"
COUNT_ESCALATING = 5      # Article count threshold for "escalating"
COUNT_ONGOING = 2         # Article count threshold for "ongoing"
COUNT_PEAKING = 5         # Article count threshold for "peaking"


# ---------------------------------------------------------------------------
# Classification
# ---------------------------------------------------------------------------

def classify_status(cluster: Cluster) -> str:
    """Return the appropriate status string for a single cluster."""
    ref = cluster.first_seen_at or cluster.created_at
    if ref is None:
        return "new"
    if ref.tzinfo is None:
        ref = ref.replace(tzinfo=timezone.utc)

    age_hours = (datetime.now(timezone.utc) - ref).total_seconds() / 3600
    count = cluster.article_count or 1

    if age_hours < AGE_NEW_HOURS:
        return "new"

    age_days = age_hours / 24

    if age_days <= 3 and count >= COUNT_ESCALATING:
        return "escalating"
    if age_days <= 4 and count >= COUNT_ONGOING:
        return "ongoing"
    if age_days <= 6 and count >= COUNT_PEAKING:
        return "peaking"
    if age_days > AGE_FADING_DAYS:
        return "fading"

    return "new"


# ---------------------------------------------------------------------------
# Bulk update
# ---------------------------------------------------------------------------

def update_all_cluster_statuses(db: Session) -> dict[str, int]:
    """Reclassify every cluster and commit any changes.

    Returns a dict of status → count for logging.
    """
    clusters = list(db.execute(select(Cluster)).scalars().all())
    status_counts: dict[str, int] = {}
    changed = 0

    for cluster in clusters:
        new_status = classify_status(cluster)
        if cluster.status != new_status:
            cluster.status = new_status
            changed += 1
        status_counts[new_status] = status_counts.get(new_status, 0) + 1

    if changed:
        db.commit()

    logger.info(
        "update_cluster_status: total=%d changed=%d distribution=%s",
        len(clusters),
        changed,
        status_counts,
    )
    return status_counts
