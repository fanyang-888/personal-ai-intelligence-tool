"""GET /api/digest/today — today's ranked cluster digest."""

from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, Depends, Query
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.api.mappers import cluster_to_response
from app.api.schemas import DigestResponse, format_dt
from app.cache import cache_get, cache_set
from app.crud.cluster import get_top_clusters
from app.db import get_db
from app.models.draft import Draft
from app.services.personalization import personalize_digest

router = APIRouter(prefix="/api/digest", tags=["digest"])

_CACHE_KEY = "ai_tool:digest:today"


def _build_digest(db: Session) -> dict[str, Any]:
    clusters = get_top_clusters(db, limit=10)

    latest_draft = db.execute(
        select(Draft).order_by(Draft.generated_at.desc().nullslast()).limit(1)
    ).scalar_one_or_none()
    draft_id = str(latest_draft.id) if latest_draft else None

    cluster_draft_ids: dict[str, str] = {}
    if latest_draft and latest_draft.cluster_id:
        cluster_draft_ids[str(latest_draft.cluster_id)] = str(latest_draft.id)

    cluster_responses = [
        cluster_to_response(c, draft_id=cluster_draft_ids.get(str(c.id)))
        for c in clusters
    ]

    featured = cluster_responses[0] if cluster_responses else None
    top = cluster_responses[1:] if len(cluster_responses) > 1 else cluster_responses

    return DigestResponse(
        date=format_dt(datetime.now(timezone.utc)) or "",
        featured=featured,
        topClusters=top,
        draftId=draft_id,
    ).model_dump(mode="json")


@router.get("/today")
def get_today_digest(
    device_id: str | None = Query(
        default=None, max_length=64, description="Anonymous device id; re-ranks by reading history"
    ),
    role: str | None = Query(
        default=None, max_length=32, description="pm | developer | studentJobSeeker; cold-start prior"
    ),
    db: Session = Depends(get_db),
):
    """Return featured cluster + top clusters + today's draft id.

    The global digest is cached; per-reader ordering is applied on top of it
    per request, so personalization never fragments the cache.
    """
    digest = cache_get(_CACHE_KEY)
    if digest is None:
        digest = _build_digest(db)
        cache_set(_CACHE_KEY, digest)

    if device_id or role:
        digest = personalize_digest(db, digest, device_id=device_id, role=role)

    return JSONResponse(content=digest)
