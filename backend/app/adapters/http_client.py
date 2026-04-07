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
    async with httpx.AsyncClient(
        timeout=httpx.Timeout(30.0, connect=10.0),
        headers={"User-Agent": ua},
        follow_redirects=True,
    ) as client:
        yield client
