"""Add topic_tag column to clusters.

Revision ID: w3d2_cluster_topic_tag
Revises: w3d1_subscribers
Create Date: 2026-05-08
"""

from alembic import op
import sqlalchemy as sa

revision = "w3d2_cluster_topic_tag"
down_revision = "w3d1_subscribers"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("clusters", sa.Column("topic_tag", sa.String(64), nullable=True))


def downgrade() -> None:
    op.drop_column("clusters", "topic_tag")
