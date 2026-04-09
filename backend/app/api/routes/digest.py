"""GET /api/digest/today — today's ranked cluster digest."""

from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.mappers import cluster_to_response
from app.api.schemas import DigestResponse, format_dt
from app.crud.cluster import get_top_clusters
from app.db import get_db
from app.models.draft import Draft
from sqlalchemy import select

router = APIRouter(prefix="/api/digest", tags=["digest"])


@router.get("/today", response_model=DigestResponse)
def get_today_digest(db: Session = Depends(get_db)) -> DigestResponse:
    """Return featured cluster + top clusters + today's draft id."""
    clusters = get_top_clusters(db, limit=10)

    # Find the most recent draft
    latest_draft = db.execute(
        select(Draft).order_by(Draft.generated_at.desc().nullslast()).limit(1)
    ).scalar_one_or_none()
    draft_id = str(latest_draft.id) if latest_draft else None

    # Build cluster draft map
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
    )
