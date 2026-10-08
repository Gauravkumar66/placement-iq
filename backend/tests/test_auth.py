import pytest
from app.core.database import SessionLocal, Base, engine
from app.services.auth_service import AuthService
from app.schemas.auth import UserLogin, UserRegister
from app.models.enums import UserRole
from app.models.entities import User

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield


def test_student_authentication():
    db = SessionLocal()
    try:
        user, access_token, refresh_token = AuthService.authenticate_user(
            db, UserLogin(email="student@example.com", password="Password123!")
        )
        assert user.email == "student@example.com"
        assert user.role == UserRole.STUDENT.value
        assert len(access_token) > 20
        assert len(refresh_token) > 20
    finally:
        db.close()


def test_tpo_authentication():
    db = SessionLocal()
    try:
        user, access_token, _ = AuthService.authenticate_user(
            db, UserLogin(email="tpo@example.com", password="Password123!")
        )
        assert user.email == "tpo@example.com"
        assert user.role == UserRole.TPO.value
    finally:
        db.close()


def test_invalid_credentials():
    db = SessionLocal()
    try:
        with pytest.raises(ValueError, match="Invalid email or password"):
            AuthService.authenticate_user(
                db, UserLogin(email="student@example.com", password="WrongPassword999!")
            )
    finally:
        db.close()
