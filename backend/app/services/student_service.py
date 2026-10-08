from typing import Any, Dict, List, Optional
from sqlalchemy.orm import Session
from app.models.entities import Student, StudentSkill, Project, LearningPlan, Recommendation
from app.schemas.student import StudentProfileUpdate, ReadinessBreakdownOut


class StudentService:
    @staticmethod
    def get_profile_by_user_id(db: Session, user_id: int) -> Optional[Student]:
        return db.query(Student).filter(Student.user_id == user_id).first()

    @staticmethod
    def get_profile_by_id(db: Session, student_id: int) -> Optional[Student]:
        return db.query(Student).filter(Student.id == student_id).first()

    @staticmethod
    def calculate_profile_completion(student: Student) -> int:
        score = 40  # base with registration and department
        if student.github_url:
            score += 15
        if student.linkedin_url:
            score += 15
        if student.resume_url:
            score += 15
        if student.projects and len(student.projects) > 0:
            score += 15
        return min(score, 100)

    @staticmethod
    def update_profile(db: Session, student: Student, update_data: StudentProfileUpdate) -> Student:
        for field, value in update_data.model_dump(exclude_unset=True).items():
            setattr(student, field, value)
        
        student.profile_completion = StudentService.calculate_profile_completion(student)
        db.commit()
        db.refresh(student)
        return student

    @staticmethod
    def get_readiness_breakdown(student: Student) -> ReadinessBreakdownOut:
        overall = student.readiness_score or 68.0
        
        # 85-100: Highly Ready, 70-84: Placement Ready, 50-69: Needs Preparation, 0-49: Early Preparation
        if overall >= 85:
            label = "Highly Ready"
        elif overall >= 70:
            label = "Placement Ready"
        elif overall >= 50:
            label = "Needs Preparation"
        else:
            label = "Early Preparation"

        biggest_opportunity = {
            "skill": "Data Structures & Algorithms",
            "current_score": student.dsa_score or 61.0,
            "target_score": 75.0,
            "potential_overall_increase": round((student.readiness_score or 68.0) + 7.0, 1),
            "target_role": "Backend Developer",
            "note": "Estimated simulation based on typical weightings. Not a guaranteed outcome."
        }

        target_roles = [
            {"role": "Backend Developer", "fit_score": 72.0, "status": "Placement Ready"},
            {"role": "Full Stack Developer", "fit_score": 68.0, "status": "Needs Preparation"},
            {"role": "Software Engineer", "fit_score": 74.0, "status": "Placement Ready"},
            {"role": "AI / ML Engineer", "fit_score": 58.0, "status": "Needs Preparation"},
        ]

        return ReadinessBreakdownOut(
            overall_readiness=overall,
            status_label=label,
            technical=student.technical_score or 72.0,
            projects=student.projects_score or 70.0,
            communication=student.communication_score or 75.0,
            dsa=student.dsa_score or 61.0,
            resume=student.resume_score or 80.0,
            biggest_opportunity=biggest_opportunity,
            target_role_readiness=target_roles
        )
