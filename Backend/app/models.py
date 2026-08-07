from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime, timezone


#USER MODEL
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
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


