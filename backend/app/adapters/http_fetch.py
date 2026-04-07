"""HTTP GET with simple exponential backoff for transient failures."""

from __future__ import annotations

import asyncio
import logging

import httpx

logger = logging.getLogger(__name__)

_RETRY_STATUS = frozenset({429, 502, 503, 504})


async def get_with_retry(
    client: httpx.AsyncClient,
    url: str,
    *,
    max_attempts: int = 4,
    base_delay_sec: float = 0.5,
) -> httpx.Response:
    for attempt in range(max_attempts):
        try:
            resp = await client.get(url)
            if resp.status_code in _RETRY_STATUS and attempt < max_attempts - 1:
                delay = base_delay_sec * (2**attempt)
                logger.warning(
                    "http retry url=%s status=%s attempt=%s sleep=%.2fs",
                    url[:120],
                    resp.status_code,
                    attempt + 1,
                    delay,
                )
                await asyncio.sleep(delay)
                continue
            resp.raise_for_status()
            return resp
        except (httpx.TimeoutException, httpx.ConnectError, httpx.NetworkError) as e:
            if attempt == max_attempts - 1:
                raise
            delay = base_delay_sec * (2**attempt)
            logger.warning(
                "http retry url=%s err=%s attempt=%s sleep=%.2fs",
                url[:120],
                type(e).__name__,
                attempt + 1,
                delay,
            )
            await asyncio.sleep(delay)
    raise RuntimeError("get_with_retry: loop exited without response")
