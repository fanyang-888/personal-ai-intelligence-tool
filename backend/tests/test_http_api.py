"""HTTP-level checks through the real FastAPI app (needs TEST_DATABASE_URL).

The app's startup hook (migrations + source seeding) only runs when the
TestClient is used as a context manager, so it is deliberately not.
"""

import pytest
from fastapi.testclient import TestClient

from app.db import get_db
from app.main import app


@pytest.fixture
def client(db):
    app.dependency_overrides[get_db] = lambda: db
    try:
        yield TestClient(app)
    finally:
        app.dependency_overrides.clear()


def test_health(client):
    assert client.get("/health").status_code == 200


def test_search_parses_topic_tags_query_param(client, make_cluster):
    make_cluster(title="funding story", topic_tag="Funding")
    make_cluster(title="safety story", topic_tag="Safety")
    make_cluster(title="model story", topic_tag="Model Release")

    body = client.get("/api/search", params={"topic_tags": "Regulation,Safety,Funding"}).json()
    assert body["total"] == 2
    assert {c["topicTag"] for c in body["clusters"]} == {"Funding", "Safety"}


def test_search_rejects_oversized_page(client):
    assert client.get("/api/search", params={"limit": 500}).status_code == 422


def test_digest_featured_is_top_ranked(client, make_cluster, monkeypatch):
    monkeypatch.setattr("app.api.routes.digest.cache_get", lambda key: None)
    monkeypatch.setattr("app.api.routes.digest.cache_set", lambda key, value: None)
    top = make_cluster(title="top", score=95)
    make_cluster(title="second", score=60)
    make_cluster(title="third", score=40)

    body = client.get("/api/digest/today").json()
    assert body["featured"]["id"] == str(top.id)
    assert [c["title"]["en"] for c in body["topClusters"]] == ["second", "third"]
