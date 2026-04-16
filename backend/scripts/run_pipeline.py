"""
Daily pipeline orchestrator.

Runs all six pipeline stages in sequence.  Designed to be invoked by a
Railway Cron service (see railway.cron.toml) but also works locally:

    cd backend/
    python -m scripts.run_pipeline

Exit code 0 = all stages succeeded.
Exit code 1 = one or more stages failed (details in logs).
"""

from __future__ import annotations

import asyncio
import logging
import sys
import time
from typing import Callable

from app.logging_config import configure_logging

configure_logging()
logger = logging.getLogger(__name__)


def _run_stage(name: str, fn: Callable[[], int]) -> bool:
    """Run fn(), log timing and result.  Returns True on success (code == 0)."""
    logger.info("pipeline  stage=%-22s  status=STARTING", name)
    t0 = time.monotonic()
    try:
        code = fn()
    except SystemExit as exc:
        code = int(exc.code) if exc.code is not None else 0
    except Exception:
        logger.exception("pipeline  stage=%s  status=EXCEPTION", name)
        elapsed = time.monotonic() - t0
        logger.error(
            "pipeline  stage=%-22s  status=FAILED    elapsed=%.1fs", name, elapsed
        )
        return False
    elapsed = time.monotonic() - t0
    if code == 0:
        logger.info(
            "pipeline  stage=%-22s  status=OK        elapsed=%.1fs", name, elapsed
        )
        return True
    logger.error(
        "pipeline  stage=%-22s  status=FAILED    elapsed=%.1fs  exit_code=%s",
        name,
        elapsed,
        code,
    )
    return False


def main() -> int:
    logger.info("========== daily pipeline starting ==========")
    t_total = time.monotonic()

    # ------------------------------------------------------------------
    # Stage 1: ingest  (async; call _run() directly to avoid sys.argv)
    # ------------------------------------------------------------------
    from scripts import ingest_full_articles

    ingest_ok = _run_stage(
        "ingest_full_articles",
        lambda: asyncio.run(
            ingest_full_articles._run(
                slug=None,
                per_source_limit=3,
                dry_run=False,
                force_retry_failures=False,
            )
        ),
    )

    if not ingest_ok:
        logger.error("pipeline ABORTED after ingest failure — total=%.1fs", time.monotonic() - t_total)
        return 1

    # ------------------------------------------------------------------
    # Stages 2–6: synchronous
    # ------------------------------------------------------------------
    from scripts import (
        filter_articles,
        score_articles,
        cluster_articles,
        summarize,
        translate_clusters,
        translate_drafts,
        generate_draft,
    )

    stages: list[tuple[str, Callable[[], int]]] = [
        ("filter_articles",    lambda: filter_articles.main([])),
        ("score_articles",     lambda: score_articles.main([])),
        ("cluster_articles",   lambda: cluster_articles.main([])),
        ("summarize",          lambda: summarize.main([])),
        ("translate_clusters", lambda: translate_clusters.main([])),
        ("generate_draft",     lambda: generate_draft.main([])),
        ("translate_drafts",   lambda: translate_drafts.main([])),
    ]

    failures: list[str] = []
    for name, fn in stages:
        ok = _run_stage(name, fn)
        if not ok:
            failures.append(name)
            # Continue — later stages can still run on already-processed rows.

    elapsed_total = time.monotonic() - t_total
    if failures:
        logger.error(
            "========== daily pipeline DONE  failures=%s  total=%.1fs ==========",
            failures,
            elapsed_total,
        )
        return 1

    logger.info(
        "========== daily pipeline DONE  all OK  total=%.1fs ==========",
        elapsed_total,
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
