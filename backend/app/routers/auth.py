from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.routers.deps import get_current_user
from app.models.entities import User
from app.schemas.auth import (
    UserRegister,
    UserLogin,
    TokenResponse,
    TokenRefreshRequest,
    TokenRefreshResponse,
    UserOut,
)
from app.schemas.common import APIResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=APIResponse[TokenResponse])
def register(reg_data: UserRegister, db: Session = Depends(get_db)):
    try:
        user, access_token, refresh_token = AuthService.register_user(db, reg_data)
        user_out = AuthService.get_user_out(user, db)
        return APIResponse(
            success=True,
            data=TokenResponse(
                access_token=access_token,
                refresh_token=refresh_token,
                token_type="bearer",
                user=user_out,
            ),
            message="Registration successful. Welcome to Placement IQ!"
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/login", response_model=APIResponse[TokenResponse])
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    try:
        user, access_token, refresh_token = AuthService.authenticate_user(db, login_data)
        user_out = AuthService.get_user_out(user, db)
        return APIResponse(
            success=True,
            data=TokenResponse(
                access_token=access_token,
                refresh_token=refresh_token,
                token_type="bearer",
                user=user_out,
            ),
            message="Login successful"
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))


@router.post("/refresh", response_model=APIResponse[TokenRefreshResponse])
def refresh_token(payload: TokenRefreshRequest, db: Session = Depends(get_db)):
    try:
        new_access_token = AuthService.refresh_user_token(db, payload.refresh_token)
        return APIResponse(
            success=True,
            data=TokenRefreshResponse(access_token=new_access_token, token_type="bearer"),
            message="Token refreshed successfully"
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))


@router.get("/me", response_model=APIResponse[UserOut])
def get_current_user_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_out = AuthService.get_user_out(current_user, db)
    return APIResponse(
        success=True,
        data=user_out,
        message="Current user profile retrieved"
    )


@router.post("/logout", response_model=APIResponse[dict])
def logout(current_user: User = Depends(get_current_user)):
    return APIResponse(
        success=True,
        data={},
        message="Logged out successfully"
    )
