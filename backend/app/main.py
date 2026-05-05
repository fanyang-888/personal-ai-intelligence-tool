import asyncio
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import health
from app.api.routes import digest, clusters, search, drafts, pipeline_runs, admin, auth, subscribe
from app.logging_config import configure_logging

configure_logging()
logger = logging.getLogger(__name__)


def _run_startup_migrations() -> None:
    """Run alembic migrations and seed sources synchronously (called in background thread)."""
    try:
        from alembic.config import Config
        from alembic import command as alembic_command
        import os

        alembic_cfg = Config(os.path.join(os.path.dirname(__file__), "..", "alembic.ini"))
        alembic_command.upgrade(alembic_cfg, "head")
        logger.info("startup: alembic upgrade head done")
    except Exception:
        logger.exception("startup: alembic upgrade failed")

    try:
        from scripts.seed_sources import seed_sources
        n = seed_sources()
        logger.info("startup: seed_sources done inserted=%d", n)
    except Exception:
        logger.exception("startup: seed_sources failed")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Run migrations in a background thread so uvicorn starts immediately.
    loop = asyncio.get_event_loop()
    loop.run_in_executor(None, _run_startup_migrations)
    yield


app = FastAPI(title="Personal AI Intelligence Tool API", version="0.1.0", lifespan=lifespan)

# ---------------------------------------------------------------------------
# CORS — allow the Next.js frontend (local dev + Vercel deploy)
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        # Custom domain
        "https://sipply.dev",
        "https://www.sipply.dev",
        # Production Vercel deployment (explicit match — regex alone can miss error responses)
        "https://personal-ai-intelligence-tool.vercel.app",
        # Vercel preview deployments
        "https://personal-ai-intelligence-tool-git-claude-sleepy-booth-fanyang-888s-projects.vercel.app",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
app.include_router(health.router)
app.include_router(digest.router)
app.include_router(clusters.router)
app.include_router(search.router)
app.include_router(drafts.router)
app.include_router(pipeline_runs.router)
app.include_router(admin.router)
app.include_router(auth.router)
app.include_router(subscribe.router)
