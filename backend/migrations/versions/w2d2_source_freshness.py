"""Add last_polled_at and etag to sources for adapter freshness.

Revision ID: w2d2_source_freshness
Revises: w2d1_initial
Create Date: 2026-04-07

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "w2d2_source_freshness"
down_revision: Union[str, Sequence[str], None] = "w2d1_initial"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "sources",
        sa.Column("last_polled_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.add_column(
        "sources",
        sa.Column("etag", sa.String(length=512), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("sources", "etag")
    op.drop_column("sources", "last_polled_at")
