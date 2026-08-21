from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class UserRegister(BaseModel):
    email: str
    username: str
    password: str

class UserLogin(BaseModel):
    username_or_email: str
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    username: str
    avatar_url: Optional[str] = None
    preferences: Dict[str, Any] = {}
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
