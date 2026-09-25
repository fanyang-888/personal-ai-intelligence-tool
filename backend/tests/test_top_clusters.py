"""Homepage ranking: get_top_clusters (needs TEST_DATABASE_URL).

Ranking is cluster_score × exp(-0.15 × age_days) over the last 14 days,
translated clusters only.
"""

from app.crud.cluster import get_top_clusters


def test_recency_decay_can_outrank_a_higher_raw_score(db, make_cluster, days_ago):
    fresh_80 = make_cluster(title="fresh 80", score=80, last_seen_at=days_ago(0))
    fresh_70 = make_cluster(title="fresh 70", score=70, last_seen_at=days_ago(0))
    stale_90 = make_cluster(title="stale 90", score=90, last_seen_at=days_ago(3))  # 90 × e^-0.45 ≈ 57

    ranked = [c.id for c in get_top_clusters(db, limit=10)]
    assert ranked == [fresh_80.id, fresh_70.id, stale_90.id]


def test_excludes_untranslated_and_out_of_window(db, make_cluster, days_ago):
    keep = make_cluster(title="keep", score=50, last_seen_at=days_ago(1))
    make_cluster(title="untranslated", score=99, title_zh=None)
    make_cluster(title="too old", score=99, last_seen_at=days_ago(20))

    assert [c.id for c in get_top_clusters(db, limit=10)] == [keep.id]


def test_respects_limit(db, make_cluster):
    for i in range(5):
        make_cluster(title=f"c{i}", score=50 + i)
    assert len(get_top_clusters(db, limit=3)) == 3
