"""Per-URL fetch backoff (e.g. repeated HTTP 403) to avoid hammering blocked endpoints."""

from __future__ import annotations

from datetime import datetime

from sqlalchemy import DateTime, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base


class IngestUrlState(Base):
    """Keyed by normalized article fetch URL (same key as ``articles.url`` normalization)."""

    __tablename__ = "ingest_url_states"

    url_key: Mapped[str] = mapped_column(Text, primary_key=True)
    http_403_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0, server_default="0")
    ingestion_status: Mapped[str] = mapped_column(
        String(32),
        nullable=False,
        default="pending",
        server_default="pending",
    )
    retry_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
