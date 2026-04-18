"""Auth routes: login + me.

POST /api/auth/login   — exchange credentials for JWT
GET  /api/auth/me      — verify token, return current user
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.auth import create_access_token, get_current_user
from app.config import settings

router = APIRouter(prefix="/api/auth", tags=["auth"])


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class MeResponse(BaseModel):
    username: str


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest) -> TokenResponse:
    """Validate credentials and return a JWT access token."""
    configured_password = settings.admin_password
    if configured_password is None:
        raise HTTPException(status_code=503, detail="ADMIN_PASSWORD not configured")

    username_ok = body.username == settings.admin_username
    password_ok = body.password == configured_password.get_secret_value()

    if not (username_ok and password_ok):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(body.username)
    return TokenResponse(access_token=token)


@router.get("/me", response_model=MeResponse)
def me(username: str = Depends(get_current_user)) -> MeResponse:
    """Return the authenticated user's info."""
    return MeResponse(username=username)
