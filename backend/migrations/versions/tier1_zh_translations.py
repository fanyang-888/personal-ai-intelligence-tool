"""Add Chinese translation columns to clusters.

Revision ID: tier1_zh_translations
Revises: w2d10_drafts
Create Date: 2026-04-16

Adds _zh counterparts for all human-visible cluster text fields.
The translation pipeline fills these after English summarization.
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects.postgresql import JSONB

revision: str = "tier1_zh_translations"
down_revision: Union[str, Sequence[str], None] = "w2d10_drafts"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("clusters", sa.Column("representative_title_zh", sa.Text(), nullable=True))
    op.add_column("clusters", sa.Column("summary_zh", sa.Text(), nullable=True))
    op.add_column("clusters", sa.Column("takeaways_zh", JSONB, nullable=True))
    op.add_column("clusters", sa.Column("why_it_matters_zh", sa.Text(), nullable=True))
    op.add_column("clusters", sa.Column("why_it_matters_pm_zh", sa.Text(), nullable=True))
    op.add_column("clusters", sa.Column("why_it_matters_dev_zh", sa.Text(), nullable=True))
    op.add_column("clusters", sa.Column("why_it_matters_students_zh", sa.Text(), nullable=True))
    op.add_column("clusters", sa.Column("translated_at", sa.DateTime(timezone=True), nullable=True))


def downgrade() -> None:
    op.drop_column("clusters", "translated_at")
    op.drop_column("clusters", "why_it_matters_students_zh")
    op.drop_column("clusters", "why_it_matters_dev_zh")
    op.drop_column("clusters", "why_it_matters_pm_zh")
    op.drop_column("clusters", "why_it_matters_zh")
    op.drop_column("clusters", "takeaways_zh")
    op.drop_column("clusters", "summary_zh")
    op.drop_column("clusters", "representative_title_zh")
