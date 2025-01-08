# New migration file
"""add_board_id_to_cards

Revision ID: <will be auto-generated>
Create Date: <will be auto-generated>
"""

from alembic import op
import sqlalchemy as sa

def upgrade():
    # Add board_id column to cards
    op.add_column('cards', sa.Column('board_id', sa.Integer(), nullable=True))
    
    # Create foreign key constraint
    op.create_foreign_key(
        'fk_cards_board_id',
        'cards',
        'boards',
        ['board_id'],
        ['id']
    )
    
    # Update existing cards with board_id from their lists
    op.execute("""
        UPDATE cards
        SET board_id = lists.board_id
        FROM lists
        WHERE cards.list_id = lists.id
    """)
    
    # Make board_id non-nullable after updating existing records
    op.alter_column('cards', 'board_id', nullable=False)

def downgrade():
    op.drop_constraint('fk_cards_board_id', 'cards', type_='foreignkey')
    op.drop_column('cards', 'board_id')