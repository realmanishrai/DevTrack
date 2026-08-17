from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Room, User, RoomMember, ActivityLog
from app.schema import CreateRoom
from random import randint
from app.auth import get_current_user

router = APIRouter()

##Random 6 character Code Generator, A-Z, 0-9

def Code_Generator(db):
  character_pool = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  while True:
    code=""
    for i in range(6):
     index=randint(0,len(character_pool)-1)
     code+=character_pool[index]
    check = db.query(Room).filter(Room.room_code == code).first()
    if check is None:
      return code

@router.post("/createroom")
def Create_Room(
    room: CreateRoom,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
  newCode = Code_Generator(db)
  db.add(Room(room_name=room.room_name, description=room.description, room_code=newCode, created_by=current_user.id))
  db.commit()
  db.add(RoomMember(room_id=db.query(Room).filter(Room.room_code == newCode).first().id, user_id=current_user.id, role="admin"))
  db.commit()
  return {"Success":"Room Created Successfully"}

@router.delete("/room/{room_code}/delete")
def delete_room(room_code: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):

  room = db.query(Room).filter(Room.room_code == room_code).first()
  if not room:
    raise HTTPException(status_code=404, detail="Room not found")
  current_member = db.query(RoomMember).filter(
        RoomMember.room_id == room.id,
        RoomMember.user_id == current_user.id).first()

  if current_member is None or current_member.role != "admin":
        raise HTTPException(status_code=403, detail="Unauthorised Access")
  db.query(Room).filter(Room.room_code == room_code).delete()
  db.commit()
  return {"Success":"Room Deleted Successfully"}

@router.get("/roomlist")
def get_user_rooms(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    rooms = db.query(Room).join(RoomMember).filter(RoomMember.user_id == current_user.id).all()
    return rooms

@router.delete("/leaveroom/{room_code}")
def leave_room(
    room_code: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    room = db.query(Room).filter(Room.room_code == room_code).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    room_member = db.query(RoomMember).filter(RoomMember.room_id == room.id, RoomMember.user_id == current_user.id).first()
    if not room_member:
        raise HTTPException(status_code=403, detail="You are not a member of this room")
    
    # Prevent the last admin from leaving the room
    if room_member.role == "admin":
      admin_count = db.query(RoomMember).filter(RoomMember.room_id == room.id, RoomMember.role == "admin").count()
      if admin_count <= 1:
        raise HTTPException(status_code=403, detail="Cannot leave room as the sole admin; assign another admin first")

    activity_log = ActivityLog(
        user_id=current_user.id,
        action_type="Left Room",
        room_id=room.id,
        description=f"User {current_user.username} left the room {room.room_name}"

    )

    db.delete(room_member)
    db.commit()
    return {"Success": "Left the room successfully"}