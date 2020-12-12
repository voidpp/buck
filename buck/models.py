import enum
from datetime import datetime

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()


class PredefinedTimer(Base):
    __tablename__ = 'predefined_timer'

    id = Column(Integer, primary_key = True)
    name = Column(String, nullable = False, unique = True)
    length = Column(String, nullable = False)
    group_id = Column(Integer, ForeignKey('group.id', ondelete = 'CASCADE'))

    group = relationship("Group")


class Timer(Base):
    __tablename__ = 'timer'

    id = Column(Integer, primary_key = True)
    length = Column(String, nullable = False)
    name = Column(String)
    predefined_timer_id = Column(Integer, ForeignKey('predefined_timer.id'))


class TimerEventType(enum.Enum):
    START = 'START'
    PAUSE = 'PAUSE'
    ALARM = 'ALARM'
    STOP = 'STOP'


class TimerEvent(Base):
    __tablename__ = 'timer_event'

    id = Column(Integer, primary_key = True)
    timer_id = Column(Integer, ForeignKey('timer.id', ondelete = 'CASCADE'))
    type = Column(Enum(TimerEventType), nullable = False)
    time = Column(DateTime, default = datetime.now)

    timer: Timer = relationship("Timer", backref = "events")


class Group(Base):
    __tablename__ = 'group'

    id = Column(Integer, primary_key = True)
    name = Column(String, nullable = False)
