from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import DateTime, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base


class Event(Base):
    """A single client-side interaction event, attributed to an anonymous device.

    Unlike the Redis counters (which are entity-level aggregates), each row here
    preserves the (device_id, type, entity_id, role, time) tuple so we can compute
    per-user behaviour, retention, and the North Star Metric (Weekly Engaged Readers).
    """

    __tablename__ = "events"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    # Anonymous, stable per-browser id (localStorage). Nullable for legacy/no-JS clients.
    device_id: Mapped[str | None] = mapped_column(String(64), nullable=True, index=True)
    type: Mapped[str] = mapped_column(String(48), nullable=False, index=True)
    entity_id: Mapped[str] = mapped_column(String(128), nullable=False)
    # Self-declared role at event time (pm | developer | studentJobSeeker), if set.
    role: Mapped[str | None] = mapped_column(String(32), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False, index=True
    )
