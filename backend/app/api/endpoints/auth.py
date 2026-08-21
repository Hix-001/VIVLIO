from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta

from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token, get_current_user_optional
from app.models.user import User
from app.schemas.user import UserRegister, UserLogin, TokenResponse, UserResponse

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=TokenResponse)
def register_user(user_in: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(
        (User.email == user_in.email) | (User.username == user_in.username)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username or email already registered")

    user = User(
        email=user_in.email,
        username=user_in.username,
        password_hash=get_password_hash(user_in.password),
        preferences={}
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(subject=user.id)
    return TokenResponse(access_token=token, token_type="bearer", user=UserResponse.model_validate(user))

@router.post("/login", response_model=TokenResponse)
def login_user(user_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        (User.email == user_in.username_or_email) | (User.username == user_in.username_or_email)
    ).first()
    if not user or not verify_password(user_in.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid username/email or password")

    token = create_access_token(subject=user.id)
    return TokenResponse(access_token=token, token_type="bearer", user=UserResponse.model_validate(user))

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(
    user_id: str = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        # Return default guest profile
        return UserResponse(
            id="default-user",
            email="reader@personal-library.local",
            username="Personal Reader",
            preferences={},
            created_at=datetime.utcnow()
        )
    return user
