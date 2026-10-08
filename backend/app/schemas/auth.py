from typing import Optional
from pydantic import BaseModel, EmailStr
from app.models.enums import UserRole


class UserRegister(BaseModel):
    email: EmailStr
    password: str
    role: UserRole = UserRole.STUDENT
    full_name: Optional[str] = None
    department: Optional[str] = "Computer Science & Engineering"
    graduation_year: Optional[int] = 2026


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: "UserOut"


class TokenRefreshRequest(BaseModel):
    refresh_token: str


class TokenRefreshResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    id: int
    email: str
    role: str
    is_active: bool
    student_id: Optional[int] = None
    full_name: Optional[str] = None

    class Config:
        from_attributes = True


TokenResponse.model_rebuild()
