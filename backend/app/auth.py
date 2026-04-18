"""JWT authentication helpers and FastAPI dependency.

Required env vars (set in Railway / .env):
    JWT_SECRET      — random secret string for signing tokens
    ADMIN_USERNAME  — login username (default: "admin")
    ADMIN_PASSWORD  — login password (plain text)

Usage in routes:
    from app.auth import get_current_user
    ...
    @router.post("/something")
    def protected(user: str = Depends(get_current_user)):
        ...
"""

from __future__ import annotations

from datetime import datetime, timedelta, timezone

from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt

from app.config import settings

_ALGORITHM = "HS256"
_TOKEN_EXPIRE_HOURS = 24

_bearer = HTTPBearer(auto_error=False)


def _secret() -> str:
    s = settings.jwt_secret
    if s is None:
        raise HTTPException(status_code=503, detail="JWT_SECRET not configured")
    return s.get_secret_value()


def create_access_token(username: str) -> str:
    """Create a signed JWT valid for TOKEN_EXPIRE_HOURS."""
    payload = {
        "sub": username,
        "exp": datetime.now(timezone.utc) + timedelta(hours=_TOKEN_EXPIRE_HOURS),
    }
    return jwt.encode(payload, _secret(), algorithm=_ALGORITHM)


def get_current_user(
    creds: HTTPAuthorizationCredentials | None = Depends(_bearer),
) -> str:
    """FastAPI dependency — returns username or raises 401."""
    if creds is None:
        raise HTTPException(status_code=401, detail="Missing Bearer token")
    try:
        payload = jwt.decode(creds.credentials, _secret(), algorithms=[_ALGORITHM])
        username: str | None = payload.get("sub")
        if not username:
            raise HTTPException(status_code=401, detail="Invalid token payload")
        return username
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
