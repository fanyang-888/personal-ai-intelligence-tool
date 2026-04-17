"""Add pipeline_runs table for observability.

Revision ID: tier3_pipeline_runs
Revises: tier2_draft_zh_translations
Create Date: 2026-04-16
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects.postgresql import JSONB, UUID

revision: str = "tier3_pipeline_runs"
down_revision: Union[str, Sequence[str], None] = "tier2_draft_zh_translations"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "pipeline_runs",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "started_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
        sa.Column("finished_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("status", sa.String(32), nullable=False, default="running"),
        sa.Column("stage_results", JSONB, nullable=True),
        sa.Column("total_elapsed_sec", sa.Float, nullable=True),
        sa.Column("triggered_by", sa.String(64), nullable=True),
    )
    op.create_index("ix_pipeline_runs_started_at", "pipeline_runs", ["started_at"])


def downgrade() -> None:
    op.drop_index("ix_pipeline_runs_started_at", table_name="pipeline_runs")
    op.drop_table("pipeline_runs")
