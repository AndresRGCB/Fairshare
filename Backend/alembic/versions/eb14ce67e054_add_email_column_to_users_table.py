"""Add email column to users table

Revision ID: eb14ce67e054
Revises: 2f02cbd1ca4a
Create Date: 2025-02-20 18:05:25.785981

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'eb14ce67e054'
down_revision: Union[str, None] = '2f02cbd1ca4a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('email', sa.String(), nullable=False))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('users', 'email')
    # ### end Alembic commands ###
