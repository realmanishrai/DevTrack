from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Room
from app.schema import CreateRoom
from random import randint

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
    db: Session = Depends(get_db)
):
  db.add(Room(room_name=room.room_name, description=room.description, room_code=Code_Generator(db)))
  db.commit()
  return {"Success":"Room Created Successfully"}