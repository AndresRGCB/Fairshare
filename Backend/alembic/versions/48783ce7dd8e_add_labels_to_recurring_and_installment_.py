"""add_labels_to_recurring_and_installment_expenses

Revision ID: 48783ce7dd8e
Revises: 89912bf6085b
Create Date: 2025-03-21 23:35:00.734748

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '48783ce7dd8e'
down_revision: Union[str, None] = '89912bf6085b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
