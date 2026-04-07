"""Shared HTTP client settings for trusted fetches."""

from __future__ import annotations

from contextlib import asynccontextmanager

import httpx

from app.config import settings
from app.schemas.trusted_source_config import TrustedSourceConfig


@asynccontextmanager
async def ingestion_http_client(source_config: TrustedSourceConfig | None = None):
    ua = settings.source_fetch_user_agent
    if source_config is not None:
        ua = source_config.effective_user_agent(ua)
    headers = {
        "User-Agent": ua,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
    }
    async with httpx.AsyncClient(
        timeout=httpx.Timeout(30.0, connect=10.0),
        headers=headers,
        follow_redirects=True,
    ) as client:
        yield client
