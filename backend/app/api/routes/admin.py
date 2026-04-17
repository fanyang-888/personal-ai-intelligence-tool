"""Admin routes: protected pipeline trigger.

POST /api/admin/trigger-pipeline
  - Requires: Authorization: Bearer <ADMIN_API_KEY>
  - Launches the full pipeline in a background thread
  - Returns immediately; poll GET /api/pipeline-runs for progress
"""

from __future__ import annotations

import asyncio
import logging

from fastapi import APIRouter, BackgroundTasks, HTTPException, Request
from pydantic import BaseModel

from app.config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/admin", tags=["admin"])


def _check_auth(request: Request) -> None:
    """Raise 401/403 if the Bearer token doesn't match ADMIN_API_KEY."""
    configured_key = settings.admin_api_key
    if configured_key is None:
        raise HTTPException(status_code=503, detail="ADMIN_API_KEY not configured")

    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing Bearer token")

    token = auth_header.removeprefix("Bearer ").strip()
    if token != configured_key.get_secret_value():
        raise HTTPException(status_code=403, detail="Invalid token")


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
    request: Request,
    background_tasks: BackgroundTasks,
) -> TriggerResponse:
    """Trigger the full daily pipeline immediately.

    Requires ``Authorization: Bearer <ADMIN_API_KEY>`` header.
    Returns 202-style accepted response; check ``GET /api/pipeline-runs`` for progress.
    """
    _check_auth(request)
    background_tasks.add_task(_run_pipeline_bg, triggered_by="api")
    return TriggerResponse(
        status="accepted",
        message="Pipeline started in background. Poll GET /api/pipeline-runs for progress.",
    )
