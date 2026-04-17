"""Pipeline observability route: GET /api/pipeline-runs."""

from __future__ import annotations

from datetime import datetime
from typing import Any
import uuid

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import get_db
from app.models.pipeline_run import PipelineRun

router = APIRouter(prefix="/api/pipeline-runs", tags=["pipeline"])


class PipelineRunResponse(BaseModel):
    id: uuid.UUID
    started_at: datetime
    finished_at: datetime | None
    status: str
    stage_results: dict[str, Any] | None
    total_elapsed_sec: float | None
    triggered_by: str | None

    model_config = {"from_attributes": True}


@router.get("", response_model=list[PipelineRunResponse])
def list_pipeline_runs(
    limit: int = 30,
    db: Session = Depends(get_db),
) -> list[PipelineRunResponse]:
    """Return the most recent pipeline runs, newest first."""
    rows = db.execute(
        select(PipelineRun)
        .order_by(PipelineRun.started_at.desc())
        .limit(min(limit, 100))
    ).scalars().all()
    return [PipelineRunResponse.model_validate(r) for r in rows]
