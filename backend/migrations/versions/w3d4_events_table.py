"""Add events table for per-device behaviour tracking.

Durable event log (vs. Redis aggregate counters) — preserves
(device_id, type, entity_id, role, created_at) so we can compute per-user
behaviour, retention, and the North Star Metric (Weekly Engaged Readers).

Revision ID: w3d4_events_table
Revises: w3d3_backfill_topic_tags
Create Date: 2026-05-08
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "w3d4_events_table"
down_revision = "w3d3_backfill_topic_tags"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "events",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("device_id", sa.String(64), nullable=True),
        sa.Column("type", sa.String(48), nullable=False),
        sa.Column("entity_id", sa.String(128), nullable=False),
        sa.Column("role", sa.String(32), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id", name="pk_events"),
    )
    op.create_index("ix_events_device_id", "events", ["device_id"])
    op.create_index("ix_events_type", "events", ["type"])
    op.create_index("ix_events_created_at", "events", ["created_at"])


def downgrade() -> None:
    op.drop_index("ix_events_created_at", table_name="events")
    op.drop_index("ix_events_type", table_name="events")
    op.drop_index("ix_events_device_id", table_name="events")
    op.drop_table("events")
