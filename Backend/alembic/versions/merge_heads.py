"""merge heads

Revision ID: merge_heads_revision
Revises: 9a0b43a01914, add_labels_columns
Create Date: 2025-03-21 23:40:21.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'merge_heads_revision'
down_revision = ('9a0b43a01914', 'add_labels_columns')
branch_labels = None
depends_on = None

def upgrade():
    pass

def downgrade():
    pass
