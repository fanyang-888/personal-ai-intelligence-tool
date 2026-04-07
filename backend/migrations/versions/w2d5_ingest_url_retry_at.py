"""Add retry_at to ingest_url_states for automatic 403 cooldown unban.

Revision ID: w2d5_ingest_retry_at
Revises: w2d4_ingest_quality
Create Date: 2026-04-07

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "w2d5_ingest_retry_at"
down_revision: Union[str, Sequence[str], None] = "w2d4_ingest_quality"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "ingest_url_states",
        sa.Column("retry_at", sa.DateTime(timezone=True), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("ingest_url_states", "retry_at")
