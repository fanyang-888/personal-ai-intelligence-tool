"""Add Chinese translation columns to drafts.

Revision ID: tier2_draft_zh_translations
Revises: tier1_zh_translations
Create Date: 2026-04-16

Adds _zh counterparts for all human-visible draft text fields.
The translation pipeline fills these after draft generation.
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects.postgresql import JSONB

revision: str = "tier2_draft_zh_translations"
down_revision: Union[str, Sequence[str], None] = "tier1_zh_translations"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("drafts", sa.Column("hook_zh", sa.Text(), nullable=True))
    op.add_column("drafts", sa.Column("summary_text_zh", sa.Text(), nullable=True))
    op.add_column("drafts", sa.Column("takeaways_zh", JSONB, nullable=True))
    op.add_column("drafts", sa.Column("career_take_zh", sa.Text(), nullable=True))
    op.add_column("drafts", sa.Column("closing_zh", sa.Text(), nullable=True))
    op.add_column("drafts", sa.Column("full_text_zh", sa.Text(), nullable=True))
    op.add_column("drafts", sa.Column("translated_at", sa.DateTime(timezone=True), nullable=True))


def downgrade() -> None:
    op.drop_column("drafts", "translated_at")
    op.drop_column("drafts", "full_text_zh")
    op.drop_column("drafts", "closing_zh")
    op.drop_column("drafts", "career_take_zh")
    op.drop_column("drafts", "takeaways_zh")
    op.drop_column("drafts", "summary_text_zh")
    op.drop_column("drafts", "hook_zh")
