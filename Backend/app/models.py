from app.database import get_db, engine, Base
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True)
    room_id = Column(String(6), ForeignKey("rooms.id"))
    title = Column(String(50))
    description = Column(String(200))
    status = Column(String(50))
    progress = Column(Integer)
    priority = Column(String(20))
    created_by = Column(Integer, ForeignKey("users.id"))
    due_date = Column(String(10))
    completed_at = Column(String(10))
    created_at = Column(String(10))
    updated_at = Column(String(10))

    assignees = relationship(
        "TaskAssignee",
        back_populates="task",
        cascade="all, delete-orphan",
    )
    updates = relationship(
        "TaskUpdate",
        back_populates="task",
        cascade="all, delete-orphan",
    )
    activity_logs = relationship(
        "ActivityLog",
        back_populates="task"
    )


class TaskAssignee(Base):
    __tablename__ = "task_assignees"

    id = Column(Integer, primary_key=True)
    task_id = Column(Integer, ForeignKey("tasks.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    assigned_by = Column(Integer, ForeignKey("users.id"))
    assigned_at = Column(String(10))

    task = relationship("Task", back_populates="assignees")


class TaskUpdate(Base):
    __tablename__ = "task_updates"

    id = Column(Integer, primary_key=True)
    task_id = Column(Integer, ForeignKey("tasks.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    old_status = Column(String(50))
    new_status = Column(String(50))
    comment = Column(String(200))
    updated_at = Column(String(10))

    task = relationship("Task", back_populates="updates")


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True)
    room_id = Column(String(6), ForeignKey("rooms.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=True)
    action_type = Column(String(50))
    description = Column(String(200))
    created_at = Column(String(10))

    task = relationship("Task", back_populates="activity_logs")