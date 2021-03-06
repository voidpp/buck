"""empty message

Revision ID: e7efe6fcbb66
Revises:
Create Date: 2020-12-03 17:47:52.363833

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e7efe6fcbb66'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('group',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('predefined_timer',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('length', sa.String(), nullable=False),
    sa.Column('group_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['group_id'], ['group.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('timer',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('length', sa.String(), nullable=False),
    sa.Column('name', sa.String(), nullable=True),
    sa.Column('predefined_timer_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['predefined_timer_id'], ['predefined_timer.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('timer_event',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('timer_id', sa.Integer(), nullable=True),
    sa.Column('type', sa.String(), nullable=False),
    sa.Column('time', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['timer_id'], ['timer.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('timer_event')
    op.drop_table('timer')
    op.drop_table('predefined_timer')
    op.drop_table('group')
    # ### end Alembic commands ###
