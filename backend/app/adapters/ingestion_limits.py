"""Cap RSS backlogs and optional ``since_date`` filters (trusted ingestion)."""

from __future__ import annotations

from datetime import date, datetime, timezone
from typing import Any

from app.schemas.trusted_source_config import TrustedSourceConfig
from app.utils.datetime_parse import published_raw_to_utc_datetime, utc_datetime_to_date


def apply_entry_limits(
    entries: list[dict[str, Any]],
    config: TrustedSourceConfig,
) -> list[dict[str, Any]]:
    """Newest-first trim: ``since_date`` (UTC calendar day), then ``import_limit``."""
    if not entries:
        return entries

    def sort_key(e: dict[str, Any]) -> datetime:
        dt = published_raw_to_utc_datetime(e)
        if dt is None:
            return datetime.min.replace(tzinfo=timezone.utc)
        return dt

    sorted_entries = sorted(entries, key=sort_key, reverse=True)

    if config.since_date is not None:
        cutoff: date = config.since_date
        filtered: list[dict[str, Any]] = []
        for e in sorted_entries:
            dt = published_raw_to_utc_datetime(e)
            if dt is None:
                filtered.append(e)
                continue
            if utc_datetime_to_date(dt) >= cutoff:
                filtered.append(e)
        sorted_entries = filtered

    if config.import_limit is not None:
        sorted_entries = sorted_entries[: config.import_limit]

    return sorted_entries
