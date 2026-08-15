from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Date
from sqlalchemy.orm import relationship
from app.database import Base, engine
from datetime import datetime, timezone

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True)
    room_id = Column(Integer, ForeignKey("rooms.id"))
    title = Column(String(50))
    description = Column(String(200))
    status = Column(String(50))
    progress = Column(Integer)
    priority = Column(String(20))
    created_by = Column(Integer, ForeignKey("users.id"))
    due_date = Column(Date)
    created_at = Column(DateTime, 
                        default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, 
                        default=lambda: datetime.now(timezone.utc), 
                        onupdate=lambda: datetime.now(timezone.utc))

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
    assigned_at = Column(DateTime, 
                        default=lambda: datetime.now(timezone.utc))

    task = relationship("Task", back_populates="assignees")


class TaskUpdate(Base):
    __tablename__ = "task_updates"

    id = Column(Integer, primary_key=True)
    task_id = Column(Integer, ForeignKey("tasks.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    old_status = Column(String(50))
    new_status = Column(String(50))
    comment = Column(String(200))
    updated_at = Column(DateTime, 
                        default=lambda: datetime.now(timezone.utc), 
                        onupdate=lambda: datetime.now(timezone.utc))

    task = relationship("Task", back_populates="updates")


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True)
    room_id = Column(Integer, ForeignKey("rooms.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=True)
    action_type = Column(String(50))
    description = Column(String(200))
    created_at = Column(DateTime, 
                        default=lambda: datetime.now(timezone.utc))

    task = relationship("Task", back_populates="activity_logs")

#USER MODEL
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    firstname = Column(String(50), nullable=False)
    lasttname = Column(String(50), nullable=False)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, 
                        default=lambda: datetime.now(timezone.utc), 
                        onupdate=lambda: datetime.now(timezone.utc) )
    last_online= Column(DateTime, nullable=True)
    rooms_created= relationship("Room", back_populates="creator")
    room_memberships= relationship("RoomMember", back_populates="user")
    


#ROOM MODEL
class Room(Base):
    __tablename__= "rooms"
    id = Column(Integer, primary_key=True, index=True)
    room_name= Column(String(100), nullable= False)
    description= Column(String(500))
    room_code=Column(String, unique=True, nullable= False)
    created_by=Column(Integer, ForeignKey("users.id"))
    created_at=Column(DateTime, default=lambda: datetime.now(timezone.utc))
    creator= relationship("User", back_populates="rooms_created")
    members= relationship("RoomMember", back_populates="room")


#ROOM MEMBER MODEL
class RoomMember(Base):
    __tablename__="room_members"
    id = Column(Integer, primary_key=True, index=True)
    room_id= Column(Integer, ForeignKey("rooms.id"))
    user_id= Column(Integer,ForeignKey("users.id"))
    role= Column(String(20), nullable= False)
    joined_at= Column(DateTime, default=lambda: datetime.now(timezone.utc))
    user= relationship("User", back_populates="room_memberships")
    room= relationship("Room", back_populates="members")

class JoinRequest(Base):
    __tablename__="join_room"
    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable = False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

Base.metadata.create_all(bind=engine)