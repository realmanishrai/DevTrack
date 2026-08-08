from fastapi import APIRouter, Depends, HTTPException
from app.schema import GetTasks
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Task, Room

router = APIRouter()

@router.get("/{room_code}/tasks", response_model=list[GetTasks])
def get_tasks(room_code: str, db: Session = Depends(get_db)):
  room = db.query(Room).filter(Room.room_code == room_code).first()
  if room is None:
    raise HTTPException(status_code=404, detail="Room not found")
  return db.query(Task).filter(Task.room_id == room.id).all()



@router.delete("/{room_code}/tasks/{id}")
def delete_task(room_code: str, id: int, db: Session = Depends(get_db)):
  room = db.query(Room).filter(Room.room_code == room_code).first()
  if room is None:
      raise HTTPException(status_code=404, detail="Room not found")
  db.query(Task).filter(Task.id == id).delete()
  return "Item deleted successfully"