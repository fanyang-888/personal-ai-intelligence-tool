"""Story lifecycle status (app.services.status_tracking.classify_status)."""

from datetime import datetime, timedelta, timezone
from types import SimpleNamespace

import pytest

from app.services.status_tracking import classify_status


def cluster(age_hours: float | None, count: int = 1):
    first_seen = None if age_hours is None else datetime.now(timezone.utc) - timedelta(hours=age_hours)
    return SimpleNamespace(first_seen_at=first_seen, created_at=None, article_count=count)


@pytest.mark.parametrize(
    ("age_hours", "count", "expected"),
    [
        (2, 10, "new"),                # under 24h is always new
        (2 * 24, 5, "escalating"),     # ≤3 days with ≥5 articles
        (2 * 24, 2, "ongoing"),        # ≤4 days with ≥2 articles
        (5 * 24, 5, "peaking"),        # ≤6 days with ≥5 articles
        (5 * 24, 1, "fading"),         # older than 4 days, low count
        (10 * 24, 9, "fading"),        # too old even with many articles
        (3.5 * 24, 1, "new"),          # 1–4 days with a single article falls through to new
    ],
)
def test_classify_status(age_hours, count, expected):
    assert classify_status(cluster(age_hours, count)) == expected


def test_missing_timestamps_default_to_new():
    assert classify_status(cluster(None)) == "new"


def test_falls_back_to_created_at():
    c = SimpleNamespace(
        first_seen_at=None,
        created_at=datetime.now(timezone.utc) - timedelta(days=5),
        article_count=1,
    )
    assert classify_status(c) == "fading"
