"""Create clusters table and add cluster_id FK to articles.

Revision ID: w2d8_clusters
Revises: w2d7_article_filter
Create Date: 2026-04-08

clusters:
  id                  UUID PK
  type                "event" | "theme"
  status              "new" | "ongoing" | "escalating" | "peaking" | "fading"
  representative_title  Text — title of highest-scored article in cluster
  cluster_score       Float 0–100
  article_count       Integer
  source_count        Integer (distinct sources)
  first_seen_at       DateTime (earliest published_at in cluster)
  last_seen_at        DateTime (latest published_at in cluster)
  tags                JSONB array of tag strings
  meta                JSONB — reserved for future use
  created_at, updated_at

articles.cluster_id:
  Nullable FK → clusters.id; SET NULL on cluster delete.
  Each article belongs to at most one cluster.
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects.postgresql import JSONB, UUID

revision: str = "w2d8_clusters"
down_revision: Union[str, Sequence[str], None] = "w2d7_article_filter"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "clusters",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("type", sa.String(32), nullable=False, server_default="event"),
        sa.Column("status", sa.String(32), nullable=False, server_default="new"),
        sa.Column("representative_title", sa.Text(), nullable=False),
        sa.Column("cluster_score", sa.Float(), nullable=True),
        sa.Column("article_count", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("source_count", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("first_seen_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("last_seen_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("tags", JSONB, nullable=False, server_default="'[]'::jsonb"),
        sa.Column("meta", JSONB, nullable=False, server_default="'{}'::jsonb"),
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
    op.create_index("ix_clusters_status", "clusters", ["status"])
    op.create_index("ix_clusters_cluster_score", "clusters", ["cluster_score"])
    op.create_index("ix_clusters_last_seen_at", "clusters", ["last_seen_at"])

    op.add_column(
        "articles",
        sa.Column(
            "cluster_id",
            UUID(as_uuid=True),
            sa.ForeignKey("clusters.id", ondelete="SET NULL"),
            nullable=True,
        ),
    )
    op.create_index("ix_articles_cluster_id", "articles", ["cluster_id"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_articles_cluster_id", table_name="articles")
    op.drop_column("articles", "cluster_id")
    op.drop_index("ix_clusters_last_seen_at", table_name="clusters")
    op.drop_index("ix_clusters_cluster_score", table_name="clusters")
    op.drop_index("ix_clusters_status", table_name="clusters")
    op.drop_table("clusters")
