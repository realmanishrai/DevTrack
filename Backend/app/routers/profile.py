from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schema import ReturnUser, UpdateUser
from app.auth import get_current_user

router = APIRouter()

@router.get("/me", response_model=ReturnUser)
def get_user_data(current_user: User = Depends(get_current_user)):
  return current_user

@router.put("/me")
def update_user_data(
    newdata: UpdateUser,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if newdata.username:
      existing_user = db.query(User).filter(
            User.username == newdata.username
        ).first()
    
      if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    for field, value in newdata.model_dump(exclude_unset=True).items():
        setattr(current_user, field, value)

    db.commit()
    db.refresh(current_user)

    return {"message": "User data updated successfully"}

@router.delete("/me")
def delete_user(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db.delete(current_user)
    db.commit()

    return {"message": "User deleted successfully"}