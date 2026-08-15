from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Room, JoinRequest, RoomMember
from app.auth import get_current_user, ensure_room_member, ensure_room_admin

router = APIRouter()

@router.post("/join/{room_code}")
def join_room(room_code: str, current_user: User = Depends(get_current_user) ,
    db: Session = Depends(get_db)):
  room = db.query(Room).filter(Room.room_code == room_code).first()
  if room is None:
    raise HTTPException(status_code=404, detail="Room not found")
  old_join_req = db.query(JoinRequest).filter(JoinRequest.user_id == current_user.id, JoinRequest.room_id == room.id).first()
  if old_join_req:
    raise HTTPException(status_code=409, detail="Request Already Sent")
  existing_membership = db.query(RoomMember).filter(RoomMember.user_id == current_user.id, RoomMember.room_id == room.id).first()
  if existing_membership:
    raise HTTPException(status_code=409, detail="User is already a member")
  new_request = JoinRequest(room_id=room.id, user_id=current_user.id)
  db.add(new_request)
  db.commit()
  return {"message": "Join request sent"}

@router.get("/PendingRequests/{room_code}")
def get_pending_requests(room_code: str, db: Session = Depends(get_db), current_user= Depends(get_current_user)):
  room = db.query(Room).filter(Room.room_code == room_code).first()
  if room is None:
    raise HTTPException(status_code=404, detail="Room not found")
  ensure_room_admin(room.id, db, current_user.id)
  pending = db.query(JoinRequest, User).join(User, User.id == JoinRequest.user_id).filter(JoinRequest.room_id == room.id).all()
  return [
    {
      "request_id": request.id,
      "user_id": user.id,
      "username": user.username,
      "firstname": user.firstname,
      "lastname": user.lastname,
      "email": user.email,
    }
    for request, user in pending
  ]

@router.put("/PendingRequests/{room_code}/{id}")
def accept_request(
    room_code: str,
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    room = db.query(Room).filter(
        Room.room_code == room_code
    ).first()

    if room is None:
        raise HTTPException(
            status_code=404,
            detail="Room not found"
        )
    ensure_room_admin(room.id, db, current_user.id)
    join_request = db.query(JoinRequest).filter(
        JoinRequest.id == id
    ).first()

    if join_request is None:
        raise HTTPException(
            status_code=404,
            detail="Join request not found"
        )

    if int(join_request.room_id) != room.id:
        raise HTTPException(
            status_code=400,
            detail="Join request does not belong to this room"
        )

    current_user_room = db.query(RoomMember).filter(
        RoomMember.user_id == current_user.id,
        RoomMember.room_id == room.id
    ).first()

    if current_user_room is None or current_user_room.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Unauthorized Access"
        )

    new_member = RoomMember(
        room_id=room.id,
        user_id=join_request.user_id,
        role="member"
    )

    db.add(new_member)
    db.delete(join_request)
    db.commit()

    return {"message": "Join request accepted"}


@router.delete("/PendingRequests/{room_code}/{id}")
def accept_request(
    room_code: str,
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
  room = db.query(Room).filter(Room.room_code == room_code).first()
  if room is None:
    raise HTTPException(status_code=404, detail="Room not found")
  ensure_room_admin(room.id, db, current_user.id)
  join_request = db.query(JoinRequest).filter(JoinRequest.id == id).first()
  if join_request is None:
    raise HTTPException(status_code=404, detail="Join request not found")
  if int(join_request.room_id) != room.id:
    raise HTTPException(status_code=400, detail="Join request does not belong to this room")
  current_user_room = db.query(RoomMember).filter(RoomMember.user_id == current_user.id, RoomMember.room_id == room.id).first()
  if current_user_room is None or current_user_room.room_id != room.id or current_user_room.role != "admin":
    raise HTTPException(status_code=403, detail="Unauthorized Access")
  db.delete(join_request)
  db.commit()
  return {"message": "Join request rejected"}