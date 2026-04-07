"""Shared HTTP client settings for trusted fetches."""

from __future__ import annotations

from contextlib import asynccontextmanager

import httpx

from app.config import settings


@asynccontextmanager
async def ingestion_http_client():
    async with httpx.AsyncClient(
        timeout=httpx.Timeout(30.0, connect=10.0),
        headers={"User-Agent": settings.source_fetch_user_agent},
        follow_redirects=True,
    ) as client:
        yield client
