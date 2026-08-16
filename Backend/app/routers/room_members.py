from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Room, RoomMember, User
from app.auth import get_current_user

router= APIRouter()

@router.get("/room/{room_code}/members")
def get_room_members(
    room_code: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)

):
    room = db.query(Room).filter(Room.room_code== room_code).first()

    if room is None:
        raise HTTPException(status_code= 404, detail= "Room not found") 

    current_member= db.query(RoomMember).filter(
        RoomMember.room_id == room.id, 
        RoomMember.user_id == current_user.id
        ).first()
    if current_member is None:
        raise HTTPException(status_code=403, detail="You are not a member of this room")

    members= db.query(RoomMember).filter(
        RoomMember.room_id == room.id
    ).all()
    return members
    
@router.put("/room/{room_code}/members/{user_id}")
def update_member_role(
    room_code:str, 
    user_id: int, 
    role: str, 
    db: Session= Depends(get_db), 
    current_user: User = Depends(get_current_user)
): 
    room = db.query(Room).filter(Room.room_code == room_code).first()

    if room is None: 
    
        raise HTTPException(status_code=404, detail="Room not found")

    
    current_member = db.query(RoomMember).filter(
        RoomMember.room_id == room.id,
        RoomMember.user_id == current_user.id
    ).first()

    if current_member is None or current_member.role != "admin":
        raise HTTPException(status_code=403, detail="Only admin can change member roles")

    
    if role not in ["admin", "member"]:
        raise HTTPException(
            status_code=400,
            detail="Role must be either admin or member"
        )

    member = db.query(RoomMember).filter(
        RoomMember.room_id == room.id,
        RoomMember.user_id == user_id
    ).first()

    if member is None:
        raise HTTPException(status_code=404, detail="Member not found in this room")

    member.role = role
    db.commit()
    db.refresh(member)

    return {
        "success": True,
        "message": f"User role updated to {role}"
    }



@router.delete("/room/{room_code}/members/{user_id}")
def delete_member(
    room_code: str,
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    room = db.query(Room).filter(Room.room_code == room_code).first()

    if room is None:
        raise HTTPException(status_code=404, detail="Room not found")

    
    current_member = db.query(RoomMember).filter(
        RoomMember.room_id == room.id,
        RoomMember.user_id == current_user.id
    ).first()

    if current_member is None or current_member.role != "admin":
        raise HTTPException(status_code=403, detail="Only admin can remove members")

    member = db.query(RoomMember).filter(
        RoomMember.room_id == room.id,
        RoomMember.user_id == user_id
    ).first()

    if member is None:
        raise HTTPException(status_code=404, detail="Member not found in this room")

    db.delete(member)
    db.commit()

    return {
        "success": True,
        "message": "Member removed successfully"
    }
