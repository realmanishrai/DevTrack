import os

from fastapi import APIRouter
from fastapi import  Cookie, Depends, HTTPException, Response, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.auth import hash_password, verify_password, create_access_token, get_current_user, create_refresh_token, decode_token
from app.schema import CreateUser


router = APIRouter()

ACCESS_TOKEN_COOKIE = "devtrack_access_token"
REFRESH_TOKEN_COOKIE = "devtrack_refresh_token"
COOKIE_SECURE = os.getenv("AUTH_COOKIE_SECURE", "false").lower() == "true"
COOKIE_SAMESITE = os.getenv("AUTH_COOKIE_SAMESITE", "lax")
ACCESS_TOKEN_MAX_AGE_SECONDS = 30 * 60
REFRESH_TOKEN_MAX_AGE_SECONDS = 30 * 24 * 60 * 60


def set_auth_cookies(
    response: Response,
    access_token: str,
    refresh_token: str | None = None
):
    response.set_cookie(
        key=ACCESS_TOKEN_COOKIE,
        value=access_token,
        max_age=ACCESS_TOKEN_MAX_AGE_SECONDS,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE,
        path="/",
    )

    if refresh_token is not None:
        response.set_cookie(
            key=REFRESH_TOKEN_COOKIE,
            value=refresh_token,
            max_age=REFRESH_TOKEN_MAX_AGE_SECONDS,
            httponly=True,
            secure=COOKIE_SECURE,
            samesite=COOKIE_SAMESITE,
            path="/",
        )


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
    response: Response,
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

    set_auth_cookies(
        response,
        access_token,
        refresh_token
    )

    return {
        "message": "Login successful",
        "token_type": "cookie"
    }

# ============================================================
# REFRESH
# ============================================================

@router.post("/refresh")
def refresh(
    response: Response,
    refresh_token: str | None = Cookie(default=None, alias=REFRESH_TOKEN_COOKIE),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid refresh token"
    )

    if refresh_token is None:
        raise credentials_exception

    payload = decode_token(refresh_token)

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

    set_auth_cookies(
        response,
        new_access_token
    )

    return {
        "message": "Session refreshed",
        "token_type": "cookie"
    }


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(
        key=ACCESS_TOKEN_COOKIE,
        path="/",
    )
    response.delete_cookie(
        key=REFRESH_TOKEN_COOKIE,
        path="/",
    )

    return {
        "message": "Logout successful"
    }
