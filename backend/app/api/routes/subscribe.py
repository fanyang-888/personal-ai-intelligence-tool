"""POST /api/subscribe — collect email subscribers."""

import re
import logging

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, field_validator
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import get_db
from app.models.subscriber import Subscriber

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["subscribe"])

_EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


class SubscribeRequest(BaseModel):
    email: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        v = v.strip().lower()
        if not _EMAIL_RE.match(v):
            raise ValueError("Invalid email address")
        if len(v) > 254:
            raise ValueError("Email too long")
        return v


class SubscribeResponse(BaseModel):
    status: str  # "subscribed" | "already_subscribed"


@router.post("/subscribe", response_model=SubscribeResponse, status_code=status.HTTP_200_OK)
def subscribe(req: SubscribeRequest, db: Session = Depends(get_db)) -> SubscribeResponse:
    existing = db.execute(
        select(Subscriber).where(Subscriber.email == req.email)
    ).scalar_one_or_none()

    if existing:
        return SubscribeResponse(status="already_subscribed")

    db.add(Subscriber(email=req.email))
    db.commit()
    logger.info("new subscriber: %s", req.email)
    return SubscribeResponse(status="subscribed")
