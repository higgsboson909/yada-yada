"""Initial multi-user notes and checklists schema.

Revision ID: 0001
Revises:
"""
from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa

revision: str = "0001"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table("user", sa.Column("id", sa.Uuid(), nullable=False), sa.Column("name", sa.String(), nullable=False), sa.Column("email", sa.String(), nullable=False), sa.Column("password_hash", sa.String(), nullable=False), sa.PrimaryKeyConstraint("id"), sa.UniqueConstraint("email"))
    op.create_index("ix_user_email", "user", ["email"])
    op.create_table("notes", sa.Column("id", sa.Uuid(), nullable=False), sa.Column("title", sa.String(), nullable=False), sa.Column("content", sa.String(), nullable=False), sa.Column("user_id", sa.Uuid(), nullable=False), sa.ForeignKeyConstraint(["user_id"], ["user.id"], ondelete="CASCADE"), sa.PrimaryKeyConstraint("id"))
    op.create_index("ix_notes_user_id", "notes", ["user_id"])
    op.create_table("checklists", sa.Column("id", sa.Uuid(), nullable=False), sa.Column("title", sa.String(), nullable=False), sa.Column("user_id", sa.Uuid(), nullable=False), sa.ForeignKeyConstraint(["user_id"], ["user.id"], ondelete="CASCADE"), sa.PrimaryKeyConstraint("id"))
    op.create_index("ix_checklists_user_id", "checklists", ["user_id"])
    op.create_table("checklist_items", sa.Column("id", sa.Uuid(), nullable=False), sa.Column("title", sa.String(), nullable=False), sa.Column("is_done", sa.Boolean(), nullable=False), sa.Column("checklist_id", sa.Uuid(), nullable=False), sa.ForeignKeyConstraint(["checklist_id"], ["checklists.id"], ondelete="CASCADE"), sa.PrimaryKeyConstraint("id"))
    op.create_index("ix_checklist_items_checklist_id", "checklist_items", ["checklist_id"])


def downgrade() -> None:
    op.drop_table("checklist_items")
    op.drop_table("checklists")
    op.drop_table("notes")
    op.drop_table("user")
