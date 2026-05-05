"""Add subscribers table.

Revision ID: w3d1_subscribers
Revises: w2d9_summary_fields
Create Date: 2026-05-05
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "w3d1_subscribers"
down_revision = "w2d9_summary_fields"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "subscribers",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("email", sa.String(254), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
    )
    op.create_index("ix_subscribers_email", "subscribers", ["email"], unique=True)


def downgrade() -> None:
    op.drop_index("ix_subscribers_email", table_name="subscribers")
    op.drop_table("subscribers")
