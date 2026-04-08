"""Add signal_score, score_components, scored_at to articles.

Revision ID: w2d6_article_score
Revises: w2d5_ingest_retry_at
Create Date: 2026-04-08

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects.postgresql import JSONB

revision: str = "w2d6_article_score"
down_revision: Union[str, Sequence[str], None] = "w2d5_ingest_retry_at"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "articles",
        sa.Column("signal_score", sa.Float(), nullable=True),
    )
    op.add_column(
        "articles",
        sa.Column(
            "score_components",
            JSONB,
            nullable=True,
            comment="Per-dimension scores and weights used to compute signal_score",
        ),
    )
    op.add_column(
        "articles",
        sa.Column("scored_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_articles_signal_score", "articles", ["signal_score"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_articles_signal_score", table_name="articles")
    op.drop_column("articles", "scored_at")
    op.drop_column("articles", "score_components")
    op.drop_column("articles", "signal_score")
