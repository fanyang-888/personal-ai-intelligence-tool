"""Add is_filtered_out and filter_reason to articles.

Revision ID: w2d7_article_filter
Revises: w2d6_article_score
Create Date: 2026-04-08

is_filtered_out:
  NULL  = not yet assessed by the filter service
  False = keep (passes all filters)
  True  = excluded from scoring / clustering pipeline

filter_reason: short string tag explaining why an article was filtered out,
e.g. "short_body", "off_topic", "short_title", "duplicate_hash".
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "w2d7_article_filter"
down_revision: Union[str, Sequence[str], None] = "w2d6_article_score"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "articles",
        sa.Column("is_filtered_out", sa.Boolean(), nullable=True),
    )
    op.add_column(
        "articles",
        sa.Column("filter_reason", sa.String(length=64), nullable=True),
    )
    # Partial index: fast lookup of articles that passed the filter
    op.create_index(
        "ix_articles_filter_keep",
        "articles",
        ["is_filtered_out"],
        unique=False,
        postgresql_where=sa.text("is_filtered_out = false"),
    )


def downgrade() -> None:
    op.drop_index("ix_articles_filter_keep", table_name="articles")
    op.drop_column("articles", "filter_reason")
    op.drop_column("articles", "is_filtered_out")
