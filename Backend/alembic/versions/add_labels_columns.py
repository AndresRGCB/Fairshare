"""add labels to recurring and installment expenses

Revision ID: add_labels_columns
Revises: d40f0480abff
Create Date: 2025-03-21 23:40:21.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'add_labels_columns'
down_revision = 'd40f0480abff'
branch_labels = None
depends_on = None

def upgrade():
    # Add labels column to recurring_expenses
    op.add_column('recurring_expenses', sa.Column('labels', sa.JSON(), nullable=True))
    op.execute("UPDATE recurring_expenses SET labels = '[]' WHERE labels IS NULL")
    
    # Add labels column to installment_expenses
    op.add_column('installment_expenses', sa.Column('labels', sa.JSON(), nullable=True))
    op.execute("UPDATE installment_expenses SET labels = '[]' WHERE labels IS NULL")

def downgrade():
    # Remove labels column from recurring_expenses
    op.drop_column('recurring_expenses', 'labels')
    
    # Remove labels column from installment_expenses
    op.drop_column('installment_expenses', 'labels')
