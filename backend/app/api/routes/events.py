"""POST /api/events — lightweight client-side event tracking via Redis counters.

Tracked event types:
  draft_copied            — user copied a draft to clipboard
  draft_shared_linkedin   — user clicked LinkedIn share
  draft_shared_x          — user clicked X (Twitter) share
  cluster_viewed          — user opened a cluster page
  draft_viewed            — user opened a draft page

Counters stored in Redis (gracefully no-ops if Redis unavailable):
  events:{type}            HASH  entity_id → count  (permanent)
  events:daily:{date}:{type}  STRING counter        (90-day TTL)
"""

from __future__ import annotations

import logging
from datetime import date

from fastapi import APIRouter
from pydantic import BaseModel

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["events"])

_ALLOWED_TYPES = frozenset({
    "draft_copied",
    "draft_shared_linkedin",
    "draft_shared_x",
    "cluster_viewed",
    "draft_viewed",
})

_DAILY_TTL = 90 * 86_400  # 90 days in seconds


class EventPayload(BaseModel):
    type: str
    entity_id: str


@router.post("/events", status_code=204)
async def record_event(payload: EventPayload) -> None:
    """Record a single client-side event. Always returns 204; errors are silent."""
    if payload.type not in _ALLOWED_TYPES:
        return  # silently drop unknown types

    # Import lazily to avoid import-time Redis connection errors
    try:
        from app.cache import _get_client
        client = _get_client()
        if client is None:
            return

        today = date.today().isoformat()
        # Per-entity lifetime counter
        client.hincrby(f"events:{payload.type}", payload.entity_id[:128], 1)
        # Daily aggregate counter
        daily_key = f"events:daily:{today}:{payload.type}"
        client.incr(daily_key)
        client.expire(daily_key, _DAILY_TTL)
    except Exception as exc:
        logger.debug("events: redis error %s", exc)
