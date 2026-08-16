from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import ActivityLog, Room
from app.auth import get_current_user, ensure_room_member

router = APIRouter()

@router.get("/{room_code}/activitylogs")
def get_tasks(room_code: str, db: Session = Depends(get_db), current_user= Depends(get_current_user)):
  room = db.query(Room).filter(Room.room_code == room_code).first()
  if room is None:
      raise HTTPException(status_code=404, detail="Room not found")
  ensure_room_member(room.id, db, current_user.id)

  ActivityLogs = db.query(ActivityLog).filter(ActivityLog.room_id == room.id).all()

  return ActivityLogs