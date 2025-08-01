"""Added color column to labels

Revision ID: cef796cecc96
Revises: d6c7a3188120
Create Date: 2025-03-05 22:10:44.556522

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'cef796cecc96'
down_revision: Union[str, None] = 'd6c7a3188120'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('labels', sa.Column('color', sa.String(), nullable=False))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('labels', 'color')
    # ### end Alembic commands ###
