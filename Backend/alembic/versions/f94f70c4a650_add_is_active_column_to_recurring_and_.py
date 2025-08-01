"""Add is_active column to recurring and installment expenses

Revision ID: f94f70c4a650
Revises: merge_heads_revision
Create Date: 2025-03-23 19:34:10.427284

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f94f70c4a650'
down_revision: Union[str, None] = 'merge_heads_revision'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('installment_expenses', sa.Column('is_active', sa.Boolean(), nullable=True))
    op.add_column('recurring_expenses', sa.Column('is_active', sa.Boolean(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('recurring_expenses', 'is_active')
    op.drop_column('installment_expenses', 'is_active')
    # ### end Alembic commands ###
