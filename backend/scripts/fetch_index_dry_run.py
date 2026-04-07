"""Run ``fetch_index`` for all trusted sources (or one ``--slug``) without persisting to DB.

Requires the same env as the API (``DATABASE_URL``, etc.) because ``app.config`` loads on import.

    cd backend && python -m scripts.fetch_index_dry_run
    python -m scripts.fetch_index_dry_run --slug anthropic-newsroom
"""

from __future__ import annotations

import argparse
import asyncio
import json
import logging
import sys

from app.adapters import get_adapter
from app.adapters.registry import AdapterNotRegisteredError
from app.source_catalog.loader import load_trusted_sources
from app.logging_config import configure_logging

logger = logging.getLogger(__name__)


async def _run(slug: str | None, json_out: bool) -> int:
    configs = load_trusted_sources()
    if slug:
        configs = [c for c in configs if c.slug == slug]
        if not configs:
            logger.error("no active source with slug=%r", slug)
            return 1

    summary: list[dict] = []
    exit_code = 0
    for cfg in configs:
        try:
            adapter = get_adapter(cfg)
            items = await adapter.fetch_index()
            summary.append({"slug": cfg.slug, "name": cfg.name, "count": len(items), "error": None})
            if json_out:
                print(json.dumps({"slug": cfg.slug, "items": items}, indent=2, default=str))
            else:
                print(f"{cfg.slug}\t{len(items)} candidates")
        except (AdapterNotRegisteredError, Exception) as e:
            exit_code = 1
            summary.append(
                {
                    "slug": cfg.slug,
                    "name": cfg.name,
                    "count": 0,
                    "error": f"{type(e).__name__}: {e}",
                }
            )
            logger.error("source failed slug=%s err=%s", cfg.slug, e)

    logger.info("fetch_index_dry_run finished sources=%s", len(summary))
    if json_out and not slug:
        print(json.dumps(summary, indent=2))
    return exit_code


def main() -> None:
    configure_logging()
    parser = argparse.ArgumentParser(description="Trusted source fetch_index dry run")
    parser.add_argument("--slug", help="Only run the source with this slug")
    parser.add_argument(
        "--json",
        action="store_true",
        help="Emit full candidate list per source (or summary if no --slug)",
    )
    args = parser.parse_args()
    code = asyncio.run(_run(args.slug, args.json))
    sys.exit(code)


if __name__ == "__main__":
    main()
