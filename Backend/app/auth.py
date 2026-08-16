from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import  Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from pwdlib import PasswordHash
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, RoomMember


SECRET_KEY = "ad3r4567890qwertyuiopasdfghjklzxcvbnm"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 30


# ============================================================
# PASSWORD HASHING
# ============================================================

password_hash = PasswordHash.recommended()


def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    return password_hash.verify(password, hashed_password)


# ============================================================
# JWT
# ============================================================

def create_token(
    data: dict,
    expires_delta: timedelta,
    token_type: str
):
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + expires_delta

    to_encode.update({
        "exp": expire,
        "type": token_type
    })

    return jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


def create_access_token(user_id: int):
    return create_token(
        data={
            "sub": str(user_id)
        },
        expires_delta=timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        ),
        token_type="access"
    )


def create_refresh_token(user_id: int):
    return create_token(
        data={
            "sub": str(user_id)
        },
        expires_delta=timedelta(
            days=REFRESH_TOKEN_EXPIRE_DAYS
        ),
        token_type="refresh"
    )


# ============================================================
# OAUTH2
# ============================================================

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="login",
    auto_error=False
)

# ============================================================
# DECODE TOKEN
# ============================================================

def decode_token(token: str):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        return payload

    except JWTError:
        return None
    
# ============================================================
# GET CURRENT USER
# ============================================================

def get_current_user(
    request: Request,
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={
            "WWW-Authenticate": "Bearer"
        }
    )

    token = token or request.cookies.get("devtrack_access_token")

    if token is None:
        raise credentials_exception

    payload = decode_token(token)

    if payload is None:
        raise credentials_exception

    # Make sure this is an ACCESS token
    if payload.get("type") != "access":
        raise credentials_exception

    user_id = payload.get("sub")

    if user_id is None:
        raise credentials_exception

    try:
        user_id = int(user_id)
    except ValueError:
        raise credentials_exception

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if user is None:
        raise credentials_exception

    user.last_online = datetime.now(timezone.utc)
    db.commit()
    db.refresh(user)

    return user

def ensure_room_member(room_id: int, db: Session, user_id: int):
    member = db.query(RoomMember).filter(
        RoomMember.room_id == room_id,
        RoomMember.user_id == user_id
    ).first()
    if member is None:
        raise HTTPException(status_code=403, detail="User is not a member of this room")

def ensure_room_admin(room_id: int, db: Session, user_id: int):
    member = db.query(RoomMember).filter(
        RoomMember.room_id == room_id,
        RoomMember.user_id == user_id
    ).first()
    if member is None:
        raise HTTPException(status_code=403, detail="User is not a member of this room")
    if (member.role or "").lower() not in ("admin", "owner"):
        raise HTTPException(status_code=403, detail="User is not an admin of this room")
    return member
