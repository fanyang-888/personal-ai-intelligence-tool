from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class SourceRead(BaseModel):
    """Read shape for future source APIs."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    type: str
    base_url: str | None
    feed_url: str | None
    is_active: bool
    fetch_frequency_minutes: int
    created_at: datetime
    updated_at: datetime
