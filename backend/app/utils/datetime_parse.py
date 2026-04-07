"""Parse feed / index timestamps to timezone-aware UTC (for DB TIMESTAMPTZ)."""

from __future__ import annotations

import time
from datetime import date, datetime, timezone
from email.utils import parsedate_to_datetime
from typing import Any


def published_raw_to_utc_datetime(raw: dict[str, Any]) -> datetime | None:
    """Convert feedparser-style ``published`` / ``published_parsed`` to aware UTC."""
    pub = raw.get("published")
    if isinstance(pub, str) and pub.strip():
        try:
            dt = parsedate_to_datetime(pub.strip())
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            return dt.astimezone(timezone.utc)
        except (TypeError, ValueError):
            pass
    tup = raw.get("published_parsed")
    if tup is None:
        return None
    try:
        if isinstance(tup, time.struct_time):
            return datetime(
                tup.tm_year,
                tup.tm_mon,
                tup.tm_mday,
                tup.tm_hour,
                tup.tm_min,
                tup.tm_sec,
                tzinfo=timezone.utc,
            )
        if hasattr(tup, "tm_year"):
            return datetime(
                tup.tm_year,
                tup.tm_mon,
                tup.tm_mday,
                tup.tm_hour,
                tup.tm_min,
                tup.tm_sec,
                tzinfo=timezone.utc,
            )
    except (TypeError, ValueError, AttributeError):
        pass
    return None


def utc_datetime_to_iso(dt: datetime | None) -> str | None:
    if dt is None:
        return None
    return dt.astimezone(timezone.utc).isoformat()


def iso_to_utc_datetime(iso: str | None) -> datetime | None:
    """Parse ISO string from normalize() back to aware UTC (Pydantic / DB handoff)."""
    if not iso or not str(iso).strip():
        return None
    s = str(iso).strip().replace("Z", "+00:00")
    try:
        dt = datetime.fromisoformat(s)
    except ValueError:
        return None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


def utc_datetime_to_date(dt: datetime | None) -> date | None:
    if dt is None:
        return None
    return dt.astimezone(timezone.utc).date()
