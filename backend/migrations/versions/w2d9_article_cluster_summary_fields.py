"""Add LLM summary fields to articles and clusters.

Revision ID: w2d9_summary_fields
Revises: w2d8_clusters
Create Date: 2026-04-08

Article fields added:
  short_summary      — 2–3 sentence LLM summary
  takeaways          — JSONB list of 3 takeaway strings
  tags               — JSONB list of topic tag strings
  entities           — JSONB list of named entities (companies, models, people)
  themes             — JSONB list of broader theme strings
  why_it_matters     — 1-paragraph "why this matters" for the target audience
  summarized_at      — timestamp of last summarization

Cluster fields added:
  summary            — cluster-level narrative summary
  takeaways          — JSONB list of 3 cluster takeaways
  why_it_matters     — general why it matters
  why_it_matters_pm  — PM-specific interpretation
  why_it_matters_dev — developer-specific interpretation
  why_it_matters_students — student/job-seeker interpretation
  summarized_at      — timestamp of last summarization
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects.postgresql import JSONB

revision: str = "w2d9_summary_fields"
down_revision: Union[str, Sequence[str], None] = "w2d8_clusters"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

_JSONB_ARRAY = sa.text("'[]'::jsonb")


def upgrade() -> None:
    # --- articles ---
    op.add_column("articles", sa.Column("short_summary", sa.Text(), nullable=True))
    op.add_column("articles", sa.Column("takeaways", JSONB, nullable=True))
    op.add_column("articles", sa.Column("tags", JSONB, nullable=True))
    op.add_column("articles", sa.Column("entities", JSONB, nullable=True))
    op.add_column("articles", sa.Column("themes", JSONB, nullable=True))
    op.add_column("articles", sa.Column("why_it_matters", sa.Text(), nullable=True))
    op.add_column(
        "articles",
        sa.Column("summarized_at", sa.DateTime(timezone=True), nullable=True),
    )

    # --- clusters ---
    op.add_column("clusters", sa.Column("summary", sa.Text(), nullable=True))
    op.add_column("clusters", sa.Column("takeaways", JSONB, nullable=True))
    op.add_column("clusters", sa.Column("why_it_matters", sa.Text(), nullable=True))
    op.add_column("clusters", sa.Column("why_it_matters_pm", sa.Text(), nullable=True))
    op.add_column("clusters", sa.Column("why_it_matters_dev", sa.Text(), nullable=True))
    op.add_column("clusters", sa.Column("why_it_matters_students", sa.Text(), nullable=True))
    op.add_column(
        "clusters",
        sa.Column("summarized_at", sa.DateTime(timezone=True), nullable=True),
    )


def downgrade() -> None:
    for col in ("summarized_at", "why_it_matters_students", "why_it_matters_dev",
                "why_it_matters_pm", "why_it_matters", "takeaways", "summary"):
        op.drop_column("clusters", col)

    for col in ("summarized_at", "why_it_matters", "themes", "entities",
                "tags", "takeaways", "short_summary"):
        op.drop_column("articles", col)
