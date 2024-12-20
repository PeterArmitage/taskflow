"""updated schemas

Revision ID: 835ae3212e16
Revises: 564a6ff92d7f
Create Date: 2024-10-19 18:19:44.514448

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '835ae3212e16'
down_revision: Union[str, None] = '564a6ff92d7f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('board_members', sa.Column('permission_level', sa.Enum('VIEW', 'EDIT', 'ADMIN', name='permissionlevel'), nullable=True))
    op.execute("UPDATE board_members SET permission_level = 'VIEW' WHERE permission_level IS NULL")
    op.drop_index('ix_list_templates_id', table_name='list_templates')
    op.drop_table('list_templates')
    op.drop_index('ix_boards_id', table_name='boards')
    op.drop_index('ix_boards_title', table_name='boards')
    op.drop_table('boards')
    op.drop_index('ix_attachments_id', table_name='attachments')
    op.drop_table('attachments')
    op.drop_index('ix_board_members_id', table_name='board_members')
    op.drop_table('board_members')
    op.drop_index('ix_cards_id', table_name='cards')
    op.drop_index('ix_cards_title', table_name='cards')
    op.drop_table('cards')
    op.drop_index('ix_lists_id', table_name='lists')
    op.drop_index('ix_lists_title', table_name='lists')
    op.drop_table('lists')
    op.drop_index('ix_board_templates_id', table_name='board_templates')
    op.drop_index('ix_board_templates_name', table_name='board_templates')
    op.drop_table('board_templates')
    op.drop_index('ix_users_email', table_name='users')
    op.drop_index('ix_users_id', table_name='users')
    op.drop_index('ix_users_username', table_name='users')
    op.drop_table('users')
    op.drop_index('ix_labels_id', table_name='labels')
    op.drop_table('labels')
    op.drop_index('ix_comments_id', table_name='comments')
    op.drop_table('comments')
    op.drop_index('ix_activities_id', table_name='activities')
    op.drop_table('activities')
    op.alter_column('boards', 'title', existing_type=sa.String(), nullable=False)
    op.alter_column('boards', 'owner_id', existing_type=sa.Integer(), nullable=False)
    op.alter_column('board_members', 'permission_level', nullable=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('activities',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('board_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('activity_type', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('details', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('created_at', postgresql.TIMESTAMP(timezone=True), server_default=sa.text('now()'), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['board_id'], ['boards.id'], name='activities_board_id_fkey'),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name='activities_user_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='activities_pkey')
    )
    op.create_index('ix_activities_id', 'activities', ['id'], unique=False)
    op.create_table('comments',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('content', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('card_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('created_at', postgresql.TIMESTAMP(timezone=True), server_default=sa.text('now()'), autoincrement=False, nullable=True),
    sa.Column('updated_at', postgresql.TIMESTAMP(timezone=True), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['card_id'], ['cards.id'], name='comments_card_id_fkey'),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name='comments_user_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='comments_pkey')
    )
    op.create_index('ix_comments_id', 'comments', ['id'], unique=False)
    op.create_table('labels',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('name', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('color', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('card_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['card_id'], ['cards.id'], name='labels_card_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='labels_pkey')
    )
    op.create_index('ix_labels_id', 'labels', ['id'], unique=False)
    op.create_table('users',
    sa.Column('id', sa.INTEGER(), server_default=sa.text("nextval('users_id_seq'::regclass)"), autoincrement=True, nullable=False),
    sa.Column('username', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('email', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('hashed_password', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('created_at', postgresql.TIMESTAMP(timezone=True), server_default=sa.text('now()'), autoincrement=False, nullable=True),
    sa.Column('updated_at', postgresql.TIMESTAMP(timezone=True), autoincrement=False, nullable=True),
    sa.PrimaryKeyConstraint('id', name='users_pkey'),
    postgresql_ignore_search_path=False
    )
    op.create_index('ix_users_username', 'users', ['username'], unique=True)
    op.create_index('ix_users_id', 'users', ['id'], unique=False)
    op.create_index('ix_users_email', 'users', ['email'], unique=True)
    op.create_table('board_templates',
    sa.Column('id', sa.INTEGER(), server_default=sa.text("nextval('board_templates_id_seq'::regclass)"), autoincrement=True, nullable=False),
    sa.Column('name', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('description', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('created_by', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('created_at', postgresql.TIMESTAMP(timezone=True), server_default=sa.text('now()'), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['created_by'], ['users.id'], name='board_templates_created_by_fkey'),
    sa.PrimaryKeyConstraint('id', name='board_templates_pkey'),
    postgresql_ignore_search_path=False
    )
    op.create_index('ix_board_templates_name', 'board_templates', ['name'], unique=False)
    op.create_index('ix_board_templates_id', 'board_templates', ['id'], unique=False)
    op.create_table('lists',
    sa.Column('id', sa.INTEGER(), server_default=sa.text("nextval('lists_id_seq'::regclass)"), autoincrement=True, nullable=False),
    sa.Column('title', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('board_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('created_at', postgresql.TIMESTAMP(timezone=True), server_default=sa.text('now()'), autoincrement=False, nullable=True),
    sa.Column('updated_at', postgresql.TIMESTAMP(timezone=True), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['board_id'], ['boards.id'], name='lists_board_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='lists_pkey'),
    postgresql_ignore_search_path=False
    )
    op.create_index('ix_lists_title', 'lists', ['title'], unique=False)
    op.create_index('ix_lists_id', 'lists', ['id'], unique=False)
    op.create_table('cards',
    sa.Column('id', sa.INTEGER(), server_default=sa.text("nextval('cards_id_seq'::regclass)"), autoincrement=True, nullable=False),
    sa.Column('title', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('description', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('list_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('due_date', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.Column('created_at', postgresql.TIMESTAMP(timezone=True), server_default=sa.text('now()'), autoincrement=False, nullable=True),
    sa.Column('updated_at', postgresql.TIMESTAMP(timezone=True), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['list_id'], ['lists.id'], name='cards_list_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='cards_pkey'),
    postgresql_ignore_search_path=False
    )
    op.create_index('ix_cards_title', 'cards', ['title'], unique=False)
    op.create_index('ix_cards_id', 'cards', ['id'], unique=False)
    op.create_table('board_members',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('board_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('permission_level', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['board_id'], ['boards.id'], name='board_members_board_id_fkey'),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name='board_members_user_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='board_members_pkey')
    )
    op.create_index('ix_board_members_id', 'board_members', ['id'], unique=False)
    op.create_table('attachments',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('filename', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('file_path', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('card_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('uploaded_at', postgresql.TIMESTAMP(timezone=True), server_default=sa.text('now()'), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['card_id'], ['cards.id'], name='attachments_card_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='attachments_pkey')
    )
    op.create_index('ix_attachments_id', 'attachments', ['id'], unique=False)
    op.create_table('boards',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('title', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('created_at', postgresql.TIMESTAMP(timezone=True), server_default=sa.text('now()'), autoincrement=False, nullable=True),
    sa.Column('updated_at', postgresql.TIMESTAMP(timezone=True), autoincrement=False, nullable=True),
    sa.Column('owner_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['owner_id'], ['users.id'], name='boards_owner_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='boards_pkey')
    )
    op.create_index('ix_boards_title', 'boards', ['title'], unique=False)
    op.create_index('ix_boards_id', 'boards', ['id'], unique=False)
    op.create_table('list_templates',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('name', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('board_template_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['board_template_id'], ['board_templates.id'], name='list_templates_board_template_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='list_templates_pkey')
    )
    op.create_index('ix_list_templates_id', 'list_templates', ['id'], unique=False)
    op.alter_column('boards', 'owner_id', existing_type=sa.Integer(), nullable=True)
    op.alter_column('boards', 'title', existing_type=sa.String(), nullable=True)
    op.drop_column('board_members', 'permission_level')
    # ### end Alembic commands ###
