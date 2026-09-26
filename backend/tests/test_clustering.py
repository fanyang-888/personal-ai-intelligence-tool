"""Clustering helpers (app.services.clustering)."""

from datetime import datetime, timedelta, timezone
from types import SimpleNamespace

import pytest

from app.services.clustering import (
    DATE_PROXIMITY_DAYS,
    _compute_cluster_score,
    _dates_compatible,
    _recency_score_100,
    _UnionFind,
)


def days_ago(d: float) -> datetime:
    return datetime.now(timezone.utc) - timedelta(days=d)


def test_union_find_merges_transitively():
    uf = _UnionFind(5)
    uf.union(0, 1)
    uf.union(2, 3)
    uf.union(1, 3)
    groups = sorted(sorted(g) for g in uf.groups().values())
    assert groups == [[0, 1, 2, 3], [4]]


def test_union_find_is_idempotent():
    uf = _UnionFind(3)
    uf.union(0, 1)
    uf.union(1, 0)
    uf.union(0, 1)
    assert sorted(len(g) for g in uf.groups().values()) == [1, 2]


def test_dates_compatible_within_window():
    a = SimpleNamespace(published_at=days_ago(0))
    b = SimpleNamespace(published_at=days_ago(DATE_PROXIMITY_DAYS - 1))
    assert _dates_compatible(a, b)


def test_dates_incompatible_outside_window():
    a = SimpleNamespace(published_at=days_ago(0))
    b = SimpleNamespace(published_at=days_ago(DATE_PROXIMITY_DAYS + 1))
    assert not _dates_compatible(a, b)


def test_unknown_dates_are_allowed_to_group():
    assert _dates_compatible(SimpleNamespace(published_at=None), SimpleNamespace(published_at=days_ago(30)))


def test_naive_and_aware_datetimes_compare():
    naive = days_ago(1).replace(tzinfo=None)
    assert _dates_compatible(SimpleNamespace(published_at=naive), SimpleNamespace(published_at=days_ago(0)))


@pytest.mark.parametrize(
    ("age_days", "expected"),
    [(0.5, 100.0), (2, 80.0), (5, 60.0), (10, 40.0), (30, 20.0)],
)
def test_cluster_recency_buckets(age_days, expected):
    assert _recency_score_100(days_ago(age_days)) == expected


def art(score, source_id, published_at):
    return SimpleNamespace(signal_score=score, source_id=source_id, published_at=published_at)


def test_cluster_score_formula():
    articles = [art(60.0, "a", days_ago(2)), art(80.0, "b", days_ago(0.1))]
    # .6·max(80) + .15·diversity(2/5·100) + .15·50 + .1·recency(100) = 48 + 6 + 7.5 + 10
    assert _compute_cluster_score(articles) == pytest.approx(71.5)


def test_cluster_score_defaults_without_scores_or_dates():
    # .6·50 + .15·(1/5·100) + .15·50 + .1·40 = 30 + 3 + 7.5 + 4
    assert _compute_cluster_score([art(None, "a", None)]) == pytest.approx(44.5)


def test_source_diversity_caps_at_five_sources():
    seven_sources = [art(50.0, f"s{i}", days_ago(0.1)) for i in range(7)]
    five_sources = seven_sources[:5]
    assert _compute_cluster_score(seven_sources) == _compute_cluster_score(five_sources)
