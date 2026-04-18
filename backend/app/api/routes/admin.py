"""Admin routes: protected pipeline trigger.

POST /api/admin/trigger-pipeline
  - Requires valid JWT: Authorization: Bearer <token>
  - Get a token via POST /api/auth/login
  - Launches the full pipeline in a background thread
  - Returns immediately; poll GET /api/pipeline-runs for progress
"""

from __future__ import annotations

import asyncio
import logging

from fastapi import APIRouter, BackgroundTasks, Depends
from pydantic import BaseModel

from app.auth import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/admin", tags=["admin"])


class TriggerResponse(BaseModel):
    status: str
    message: str


async def _run_pipeline_bg(triggered_by: str) -> None:
    """Run the sync pipeline in a thread so the event loop isn't blocked."""
    from scripts import run_pipeline

    logger.info("admin trigger: pipeline starting triggered_by=%s", triggered_by)
    exit_code = await asyncio.to_thread(run_pipeline.main, triggered_by=triggered_by)
    logger.info("admin trigger: pipeline finished exit_code=%s", exit_code)


@router.post("/trigger-pipeline", response_model=TriggerResponse)
async def trigger_pipeline(
    background_tasks: BackgroundTasks,
    _user: str = Depends(get_current_user),
) -> TriggerResponse:
    """Trigger the full daily pipeline immediately.

    Requires a valid JWT Bearer token (obtain via POST /api/auth/login).
    Returns 202-style accepted response; check GET /api/pipeline-runs for progress.
    """
    background_tasks.add_task(_run_pipeline_bg, triggered_by="api")
    return TriggerResponse(
        status="accepted",
        message="Pipeline started in background. Poll GET /api/pipeline-runs for progress.",
    )
