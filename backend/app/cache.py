"""Redis cache helpers — gracefully no-ops when REDIS_URL is unset or unreachable.

Usage:
    from app.cache import cache_get, cache_set, cache_delete_pattern

    cached = cache_get("my:key")
    if cached is not None:
        return JSONResponse(content=cached)

    result = compute_something()
    cache_set("my:key", result, ttl=300)
    return result
"""

from __future__ import annotations

import json
import logging
from functools import lru_cache
from typing import Any

from app.config import settings

logger = logging.getLogger(__name__)

# Default TTL: 5 minutes — data only changes after a pipeline run
DEFAULT_TTL = 300


@lru_cache(maxsize=1)
def _get_client():  # type: ignore[return]
    """Return a Redis client, or None if REDIS_URL is not configured."""
    url = settings.redis_url
    if url is None:
        return None
    try:
        import redis as redis_lib

        client = redis_lib.Redis.from_url(
            url.get_secret_value(),
            decode_responses=True,
            socket_connect_timeout=2,
            socket_timeout=2,
        )
        # Ping to confirm connectivity at startup
        client.ping()
        logger.info("cache: Redis connected")
        return client
    except Exception as exc:
        logger.warning("cache: Redis unavailable — caching disabled (%s)", exc)
        return None


def cache_get(key: str) -> Any | None:
    """Return the cached value (parsed JSON), or None on miss / error."""
    client = _get_client()
    if client is None:
        return None
    try:
        raw = client.get(key)
        return json.loads(raw) if raw is not None else None
    except Exception as exc:
        logger.debug("cache_get error key=%s %s", key, exc)
        return None


def cache_set(key: str, value: Any, ttl: int = DEFAULT_TTL) -> None:
    """Serialize value to JSON and store with TTL. Silently ignores errors."""
    client = _get_client()
    if client is None:
        return
    try:
        client.setex(key, ttl, json.dumps(value, default=str))
    except Exception as exc:
        logger.debug("cache_set error key=%s %s", key, exc)


def cache_delete_pattern(pattern: str) -> int:
    """Delete all keys matching pattern. Returns count deleted."""
    client = _get_client()
    if client is None:
        return 0
    try:
        keys = client.keys(pattern)
        if keys:
            return client.delete(*keys)
        return 0
    except Exception as exc:
        logger.debug("cache_delete_pattern error pattern=%s %s", pattern, exc)
        return 0
