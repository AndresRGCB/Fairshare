"""add_labels_to_recurring_and_installment_expenses

Revision ID: 89912bf6085b
Revises: d40f0480abff
Create Date: 2025-03-21 23:34:43.045244

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '89912bf6085b'
down_revision: Union[str, None] = 'd40f0480abff'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
