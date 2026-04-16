from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.db import get_db

router = APIRouter(tags=["health"])


@router.get("/health")
def health() -> dict[str, str]:
    """Lightweight liveness check — no DB dependency so Railway healthcheck passes fast."""
    return {"status": "ok"}


@router.get("/health/db")
def health_db(db: Session = Depends(get_db)) -> dict[str, str]:
    """Full readiness check including database connectivity."""
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail=f"Database connection failed: {type(e).__name__}: {e}",
        ) from None
    return {"status": "healthy"}
