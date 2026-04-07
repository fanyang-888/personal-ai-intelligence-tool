"""Article word_count, canonical lookup index, ingest URL state for 403 backoff.

Revision ID: w2d4_ingest_quality
Revises: w2d3_article_meta_slug
Create Date: 2026-04-07

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "w2d4_ingest_quality"
down_revision: Union[str, Sequence[str], None] = "w2d3_article_meta_slug"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("articles", sa.Column("word_count", sa.Integer(), nullable=True))
    op.create_index("ix_articles_word_count", "articles", ["word_count"], unique=False)
    op.create_index(
        "ix_articles_canonical_url_present",
        "articles",
        ["canonical_url"],
        unique=False,
        postgresql_where=sa.text("canonical_url IS NOT NULL"),
    )
    op.create_table(
        "ingest_url_states",
        sa.Column("url_key", sa.Text(), nullable=False),
        sa.Column("http_403_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column(
            "ingestion_status",
            sa.String(length=32),
            nullable=False,
            server_default=sa.text("'pending'"),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("url_key", name="pk_ingest_url_states"),
    )


def downgrade() -> None:
    op.drop_table("ingest_url_states")
    op.drop_index("ix_articles_canonical_url_present", table_name="articles")
    op.drop_index("ix_articles_word_count", table_name="articles")
    op.drop_column("articles", "word_count")
