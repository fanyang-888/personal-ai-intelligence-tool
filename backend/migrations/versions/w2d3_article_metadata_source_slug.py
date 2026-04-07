"""Article author/org/raw_meta and sources.slug for YAML join.

Revision ID: w2d3_article_meta_slug
Revises: w2d2_source_freshness
Create Date: 2026-04-07

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "w2d3_article_meta_slug"
down_revision: Union[str, Sequence[str], None] = "w2d2_source_freshness"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("sources", sa.Column("slug", sa.String(length=128), nullable=True))
    op.create_index("ix_sources_slug", "sources", ["slug"], unique=True)
    op.add_column("articles", sa.Column("author_name", sa.Text(), nullable=True))
    op.add_column("articles", sa.Column("organization_name", sa.Text(), nullable=True))
    op.add_column(
        "articles",
        sa.Column(
            "raw_meta",
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=False,
            server_default=sa.text("'{}'::jsonb"),
        ),
    )


def downgrade() -> None:
    op.drop_column("articles", "raw_meta")
    op.drop_column("articles", "organization_name")
    op.drop_column("articles", "author_name")
    op.drop_index("ix_sources_slug", table_name="sources")
    op.drop_column("sources", "slug")
