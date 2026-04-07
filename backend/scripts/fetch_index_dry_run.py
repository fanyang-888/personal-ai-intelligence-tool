"""Run ``fetch_index`` for all trusted sources (or one ``--slug``) without persisting to DB.

Requires the same env as the API (``DATABASE_URL``, etc.) because ``app.config`` loads on import.

    cd backend && python -m scripts.fetch_index_dry_run
    python -m scripts.fetch_index_dry_run --slug anthropic-newsroom
    python -m scripts.fetch_index_dry_run --json --slug openai-news
"""

from __future__ import annotations

import argparse
import asyncio
import json
import logging
import sys

from app.adapters import get_adapter
from app.adapters.registry import AdapterNotRegisteredError
from app.logging_config import configure_logging
from app.source_catalog.loader import load_trusted_sources

logger = logging.getLogger(__name__)


async def _run(slug: str | None, json_out: bool) -> int:
    configs = load_trusted_sources()
    if slug:
        configs = [c for c in configs if c.slug == slug]
        if not configs:
            logger.error("no active source with slug=%r", slug)
            return 1

    results: list[dict] = []
    exit_code = 0
    for cfg in configs:
        try:
            adapter = get_adapter(cfg)
            items = await adapter.fetch_index()
            results.append(
                {
                    "slug": cfg.slug,
                    "name": cfg.name,
                    "count": len(items),
                    "error": None,
                    "items": items,
                }
            )
            if not json_out:
                print(f"{cfg.slug}\t{len(items)} candidates")
        except (AdapterNotRegisteredError, Exception) as e:
            exit_code = 1
            results.append(
                {
                    "slug": cfg.slug,
                    "name": cfg.name,
                    "count": 0,
                    "error": f"{type(e).__name__}: {e}",
                    "items": [],
                }
            )
            logger.error("source failed slug=%s err=%s", cfg.slug, e)

    logger.info("fetch_index_dry_run finished sources=%s", len(results))
    if json_out:
        if len(results) == 1:
            print(json.dumps(results[0], indent=2, default=str))
        else:
            # Omit full item lists when dumping all sources (OpenAI RSS can be 100s of entries).
            slim = [
                {"slug": r["slug"], "name": r["name"], "count": r["count"], "error": r["error"]}
                for r in results
            ]
            print(json.dumps(slim, indent=2, default=str))
    return exit_code


def main() -> None:
    configure_logging()
    parser = argparse.ArgumentParser(description="Trusted source fetch_index dry run")
    parser.add_argument("--slug", help="Only run the source with this slug")
    parser.add_argument(
        "--json",
        action="store_true",
        help="JSON to stdout (full items only when exactly one source is selected)",
    )
    args = parser.parse_args()
    code = asyncio.run(_run(args.slug, args.json))
    sys.exit(code)


if __name__ == "__main__":
    main()
