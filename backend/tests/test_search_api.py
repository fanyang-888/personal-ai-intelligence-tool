"""Archive search: GET /api/search (needs TEST_DATABASE_URL)."""

from __future__ import annotations

import pytest

from app.api.routes.search import search


def run(db, **kw):
    params = dict(q="", topic_tags="", limit=20, offset=0, sort_by="score")
    params.update(kw)
    return search(db=db, **params)


@pytest.fixture
def seeded(db, make_cluster, make_article, make_source):
    clusters = {
        "model": make_cluster(title="New frontier model released", topic_tag="Model Release", score=90),
        "research": make_cluster(title="Paper on sparse attention", topic_tag="Research", score=80),
        "bench": make_cluster(title="Leaderboard shake-up", topic_tag="Benchmark", score=70),
        "funding": make_cluster(title="Startup raises Series B", topic_tag="Funding", score=60),
        "untranslated": make_cluster(title="Not yet translated", topic_tag="Funding", title_zh=None),
    }
    techcrunch = make_source(name="TechCrunch")
    arxiv = make_source(name="arXiv")
    for org, src in [("TechCrunch", techcrunch), ("arXiv cs.AI", arxiv), ("TechCrunch", techcrunch), (None, arxiv)]:
        make_article(cluster_id=clusters["model"].id, organization_name=org, source=src)
    return clusters


def test_response_shape(db, seeded):
    body = run(db).model_dump()
    assert set(body) == {"query", "clusters", "total"}


def test_untranslated_clusters_are_hidden(db, seeded):
    titles = {c.title for c in run(db).clusters}
    assert "Not yet translated" not in titles
    assert run(db).total == 4


def test_single_topic_filter(db, seeded):
    res = run(db, topic_tags="Funding")
    assert res.total == 1
    assert [c.topicTag for c in res.clusters] == ["Funding"]


def test_group_filter_matches_any_listed_tag(db, seeded):
    # The "research" topic group expands to Research + Benchmark on the frontend
    res = run(db, topic_tags="Research,Benchmark")
    assert res.total == 2
    assert {c.topicTag for c in res.clusters} == {"Research", "Benchmark"}


def test_topic_filter_tolerates_whitespace_and_empty_segments(db, seeded):
    assert run(db, topic_tags=" Funding , ,").total == 1


def test_keyword_search_matches_title(db, seeded):
    res = run(db, q="sparse attention")
    assert [c.title for c in res.clusters] == ["Paper on sparse attention"]


def test_default_sort_is_score_descending(db, seeded):
    scores = [c.clusterScore for c in run(db).clusters]
    assert scores == sorted(scores, reverse=True)


def test_pagination_keeps_total(db, seeded):
    page = run(db, limit=2, offset=0)
    assert page.total == 4 and len(page.clusters) == 2
    rest = run(db, limit=2, offset=2)
    assert {c.id for c in page.clusters}.isdisjoint({c.id for c in rest.clusters})


def test_source_names_are_deduped_sorted_and_skip_missing(db, seeded):
    row = next(c for c in run(db).clusters if c.id == str(seeded["model"].id))
    assert row.sourceNames == ["TechCrunch", "arXiv cs.AI"]


def test_clusters_without_articles_have_no_source_names(db, seeded):
    row = next(c for c in run(db).clusters if c.id == str(seeded["funding"].id))
    assert row.sourceNames == []
