"""Create drafts table.

Revision ID: w2d10_drafts
Revises: w2d9_summary_fields
Create Date: 2026-04-08

Each row is a human-reviewable LinkedIn-style draft generated from a cluster.
One draft per cluster per day (re-generation creates a new row).

Fields:
  id              UUID PK
  cluster_id      FK → clusters.id (SET NULL on delete)
  hook            Opening line / hook sentence
  summary_text    Concise summary paragraph
  takeaways       JSONB list of 3 takeaway strings
  career_take     Career-oriented interpretation paragraph
  closing         Optional closing line or question
  full_text       Complete formatted draft (hook + summary + takeaways + closing)
  status          "draft" | "approved" | "published"
  generated_at    Timestamp of generation
  created_at / updated_at
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects.postgresql import JSONB, UUID

revision: str = "w2d10_drafts"
down_revision: Union[str, Sequence[str], None] = "w2d9_summary_fields"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "drafts",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "cluster_id",
            UUID(as_uuid=True),
            sa.ForeignKey("clusters.id", ondelete="SET NULL"),
            nullable=True,
            index=True,
        ),
        sa.Column("hook", sa.Text(), nullable=True),
        sa.Column("summary_text", sa.Text(), nullable=True),
        sa.Column("takeaways", JSONB, nullable=True),
        sa.Column("career_take", sa.Text(), nullable=True),
        sa.Column("closing", sa.Text(), nullable=True),
        sa.Column("full_text", sa.Text(), nullable=False),
        sa.Column("status", sa.String(32), nullable=False, server_default="draft"),
        sa.Column("generated_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
    )
    op.create_index("ix_drafts_status", "drafts", ["status"])
    op.create_index("ix_drafts_generated_at", "drafts", ["generated_at"])


def downgrade() -> None:
    op.drop_index("ix_drafts_generated_at", table_name="drafts")
    op.drop_index("ix_drafts_status", table_name="drafts")
    op.drop_table("drafts")
