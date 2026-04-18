"""Draft routes: GET /api/drafts/today, GET /api/drafts/{id}, POST generate."""

import uuid
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.api.mappers import draft_to_response
from app.api.schemas import DraftResponse
from app.db import get_db
from app.models.draft import Draft
from app.models.cluster import Cluster

router = APIRouter(prefix="/api/drafts", tags=["drafts"])


def _load_draft(db: Session, draft_id: uuid.UUID) -> Draft:
    draft = db.execute(
        select(Draft)
        .options(selectinload(Draft.cluster))
        .where(Draft.id == draft_id)
    ).scalar_one_or_none()
    if draft is None:
        raise HTTPException(status_code=404, detail="Draft not found")
    return draft


_VALID_ROLES = {"pm", "developer", "student"}


def _parse_role(role: str | None) -> str | None:
    if role is None:
        return None
    r = role.lower().strip()
    return r if r in _VALID_ROLES else None


@router.get("/today", response_model=DraftResponse | None)
def get_today_draft(
    role: str | None = Query(default=None, description="Personalize for: pm | developer | student"),
    db: Session = Depends(get_db),
) -> DraftResponse | None:
    """Return the most recently generated draft, optionally personalized by role."""
    draft = db.execute(
        select(Draft)
        .options(selectinload(Draft.cluster))
        .order_by(Draft.generated_at.desc().nullslast())
        .limit(1)
    ).scalar_one_or_none()

    return draft_to_response(draft, role=_parse_role(role)) if draft else None


@router.get("/{draft_id}", response_model=DraftResponse)
def get_draft(
    draft_id: str,
    role: str | None = Query(default=None, description="Personalize for: pm | developer | student"),
    db: Session = Depends(get_db),
) -> DraftResponse:
    """Return a specific draft, optionally personalized by role."""
    try:
        did = uuid.UUID(draft_id)
    except ValueError:
        raise HTTPException(status_code=422, detail="Invalid draft id")
    draft = _load_draft(db, did)
    return draft_to_response(draft, role=_parse_role(role))


@router.post("/generate", response_model=DraftResponse)
def generate_draft(db: Session = Depends(get_db)) -> DraftResponse:
    """Generate a new draft from the top eligible cluster."""
    from app.services.draft_generation import generate_daily_draft
    draft = generate_daily_draft(db)
    if draft is None:
        raise HTTPException(
            status_code=422,
            detail="No eligible summarized cluster found for draft generation",
        )
    draft = _load_draft(db, draft.id)
    return draft_to_response(draft)


@router.post("/{draft_id}/regenerate", response_model=DraftResponse)
def regenerate_draft(draft_id: str, db: Session = Depends(get_db)) -> DraftResponse:
    """Re-generate a specific draft from its source cluster."""
    try:
        did = uuid.UUID(draft_id)
    except ValueError:
        raise HTTPException(status_code=422, detail="Invalid draft id")

    existing = _load_draft(db, did)
    if not existing.cluster_id:
        raise HTTPException(status_code=422, detail="Draft has no associated cluster")

    cluster = db.get(Cluster, existing.cluster_id)
    if cluster is None:
        raise HTTPException(status_code=404, detail="Source cluster not found")

    from app.services.draft_generation import generate_draft_for_cluster
    new_draft = generate_draft_for_cluster(db, cluster)
    new_draft = _load_draft(db, new_draft.id)
    return draft_to_response(new_draft)
