"""add_labels_to_recurring_and_installment_expenses

Revision ID: 9a0b43a01914
Revises: 48783ce7dd8e
Create Date: 2025-03-21 23:36:07.286242

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9a0b43a01914'
down_revision: Union[str, None] = '48783ce7dd8e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
