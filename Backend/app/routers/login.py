from fastapi import APIRouter
from fastapi import  Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.auth import hash_password, verify_password, create_access_token, get_current_user, create_refresh_token, decode_token
from app.schema import CreateUser, RefreshRequest


router = APIRouter()


# ============================================================
# REGISTER
# ============================================================

@router.post("/register")
def register(
    new_user: CreateUser,
    db: Session = Depends(get_db)
):
    # Check if username already exists
    existing_user = db.query(User).filter(
        User.username == new_user.username
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Username already exists"
        )

    existing_user = db.query(User).filter(
            User.email == new_user.email
        ).first()
    
    if existing_user:
        raise HTTPException(
                status_code=400,
                detail="Email already exists"
            )

    # Hash password
    hashed_password = hash_password(new_user.password)

    # Create user
    newDBuser = User(
        firstname=new_user.firstname,
        lastname=new_user.lastname,
        username=new_user.username,
        email=new_user.email,
        password_hash=hashed_password
    )

    db.add(newDBuser)
    db.commit()
    db.refresh(newDBuser)

    return {
        "message": "User created successfully",
        "user_id": newDBuser.id
    }


# ============================================================
# LOGIN
# ============================================================

@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    # Find user
    user = db.query(User).filter(
        User.username == form_data.username
    ).first()

    # Don't reveal whether username or password was wrong
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={
                "WWW-Authenticate": "Bearer"
            }
        )

    # Verify password
    if not verify_password(
        form_data.password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={
                "WWW-Authenticate": "Bearer"
            }
        )

    # Create JWT
    access_token = create_access_token(
        user.id
    )

    refresh_token = create_refresh_token(
        user.id
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

# ============================================================
# REFRESH
# ============================================================

@router.post("/refresh")
def refresh(
    data: RefreshRequest,
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid refresh token"
    )

    payload = decode_token(data.refresh_token)

    if payload is None:
        raise credentials_exception

    # Make sure this is actually a refresh token
    if payload.get("type") != "refresh":
        raise credentials_exception

    user_id = payload.get("sub")

    if user_id is None:
        raise credentials_exception

    try:
        user_id = int(user_id)
    except ValueError:
        raise credentials_exception

    # Make sure the user still exists
    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if user is None:
        raise credentials_exception

    # Create a NEW access token
    new_access_token = create_access_token(
        user.id
    )

    return {
        "access_token": new_access_token,
        "token_type": "bearer"
    }