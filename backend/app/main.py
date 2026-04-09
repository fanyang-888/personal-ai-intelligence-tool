from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import health
from app.api.routes import digest, clusters, search, drafts
from app.logging_config import configure_logging

configure_logging()

app = FastAPI(title="Personal AI Intelligence Tool API", version="0.1.0")

# ---------------------------------------------------------------------------
# CORS — allow the Next.js frontend (local dev + Vercel deploy)
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://*.vercel.app",
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
