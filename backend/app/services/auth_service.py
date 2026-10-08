from typing import Optional, Tuple
from sqlalchemy.orm import Session
from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_refresh_token,
)
from app.models.entities import User, Student
from app.models.enums import UserRole
from app.schemas.auth import UserRegister, UserLogin, UserOut


class AuthService:
    @staticmethod
    def register_user(db: Session, reg_data: UserRegister) -> Tuple[User, str, str]:
        existing_user = db.query(User).filter(User.email == reg_data.email).first()
        if existing_user:
            raise ValueError("An account with this email already exists.")
        
        hashed_password = get_password_hash(reg_data.password)
        new_user = User(
            email=reg_data.email,
            hashed_password=hashed_password,
            role=reg_data.role.value if hasattr(reg_data.role, "value") else str(reg_data.role),
            is_active=True
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        # If user is student, create matching Student profile
        if new_user.role == UserRole.STUDENT.value:
            full_name = reg_data.full_name or reg_data.email.split("@")[0].capitalize()
            student = Student(
                user_id=new_user.id,
                full_name=full_name,
                email=new_user.email,
                department=reg_data.department or "Computer Science & Engineering",
                graduation_year=reg_data.graduation_year or 2026,
                cgpa=8.2,
                profile_completion=72,
                readiness_score=68.0,
                technical_score=72.0,
                projects_score=70.0,
                communication_score=75.0,
                dsa_score=61.0,
                resume_score=80.0,
                preferred_job_roles=["Backend Developer", "Software Engineer"]
            )
            db.add(student)
            db.commit()
            db.refresh(student)

        access_token = create_access_token(new_user.id, new_user.role)
        refresh_token = create_refresh_token(new_user.id, new_user.role)
        return new_user, access_token, refresh_token

    @staticmethod
    def authenticate_user(db: Session, login_data: UserLogin) -> Tuple[User, str, str]:
        user = db.query(User).filter(User.email == login_data.email).first()
        if not user:
            raise ValueError("Invalid email or password.")
        if not verify_password(login_data.password, user.hashed_password):
            raise ValueError("Invalid email or password.")
        if not user.is_active:
            raise ValueError("User account is inactive.")

        access_token = create_access_token(user.id, user.role)
        refresh_token = create_refresh_token(user.id, user.role)
        return user, access_token, refresh_token

    @staticmethod
    def refresh_user_token(db: Session, refresh_token: str) -> str:
        payload = decode_refresh_token(refresh_token)
        if not payload:
            raise ValueError("Invalid or expired refresh token.")
        user_id = payload.get("sub")
        role = payload.get("role")
        user = db.query(User).filter(User.id == int(user_id)).first()
        if not user or not user.is_active:
            raise ValueError("User not found or inactive.")
        
        new_access_token = create_access_token(user.id, role or user.role)
        return new_access_token

    @staticmethod
    def get_user_out(user: User, db: Session) -> UserOut:
        student_id = None
        full_name = None
        if user.role == UserRole.STUDENT.value:
            student = db.query(Student).filter(Student.user_id == user.id).first()
            if student:
                student_id = student.id
                full_name = student.full_name
        return UserOut(
            id=user.id,
            email=user.email,
            role=user.role,
            is_active=user.is_active,
            student_id=student_id,
            full_name=full_name
        )
