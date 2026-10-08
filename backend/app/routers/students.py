from typing import Any, Dict, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.routers.deps import get_current_student, require_roles
from app.models.entities import Student, LearningPlan, Recommendation
from app.models.enums import UserRole
from app.schemas.student import StudentProfileOut, StudentProfileUpdate, ReadinessBreakdownOut
from app.schemas.result_analysis import ResultAnalysisRequest, ResultAnalysisResponse
from app.schemas.common import APIResponse
from app.services.student_service import StudentService
from app.services.result_analyzer_service import ResultAnalyzerService

router = APIRouter(prefix="/students", tags=["Students"])


@router.get("/profile", response_model=APIResponse[StudentProfileOut])
def get_student_profile(
    student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    return APIResponse(
        success=True,
        data=student,
        message="Profile retrieved successfully"
    )


@router.put("/profile", response_model=APIResponse[StudentProfileOut])
def update_student_profile(
    update_data: StudentProfileUpdate,
    student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    updated = StudentService.update_profile(db, student, update_data)
    return APIResponse(
        success=True,
        data=updated,
        message="Profile updated successfully"
    )


@router.get("/readiness", response_model=APIResponse[ReadinessBreakdownOut])
def get_readiness_breakdown(
    student: Student = Depends(get_current_student)
):
    breakdown = StudentService.get_readiness_breakdown(student)
    return APIResponse(
        success=True,
        data=breakdown,
        message="Readiness breakdown calculated"
    )


@router.get("/plan", response_model=APIResponse[Dict[str, Any]])
def get_student_plan(
    student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    plan = db.query(LearningPlan).filter(LearningPlan.student_id == student.id).first()
    if not plan:
        # Generate default 14-day roadmap
        default_modules = [
            {"day": "Day 1-3", "topic": "Spring Boot Fundamentals", "focus": "Dependency injection, Beans, Annotations, project setup", "gap": "Spring Boot", "status": "PENDING"},
            {"day": "Day 4-6", "topic": "REST API Development", "focus": "Controllers, Request mapping, DTO validation, JPA repository", "gap": "REST API", "status": "PENDING"},
            {"day": "Day 7-9", "topic": "SQL & Relational DB Design", "focus": "Joins, Indexing, Transactions, Query optimization", "gap": "SQL", "status": "IN_PROGRESS"},
            {"day": "Day 10-12", "topic": "DSA for Backend Engineers", "focus": "Trees, Graphs, HashMaps, Dynamic Programming time complexity", "gap": "DSA", "status": "PENDING"},
            {"day": "Day 13", "topic": "Mock Assessment & Verification", "focus": "Comprehensive 30-min timed technical assessment", "gap": "Evidence Verification", "status": "PENDING"},
            {"day": "Day 14", "topic": "Mock System Interview", "focus": "Architecture, trade-offs, scenario defense", "gap": "Interview Readiness", "status": "PENDING"},
        ]
        return APIResponse(
            success=True,
            data={
                "target_role": "Backend Developer",
                "current_readiness": student.readiness_score or 68.0,
                "target_readiness": 85.0,
                "duration_days": 14,
                "modules": default_modules
            },
            message="14-day personalized action plan generated"
        )
    return APIResponse(
        success=True,
        data={
            "target_role": plan.target_role,
            "current_readiness": plan.current_readiness,
            "target_readiness": plan.target_readiness,
            "duration_days": plan.days_duration,
            "modules": plan.modules
        },
        message="Personalized preparation plan retrieved"
    )


@router.get("/recommendations", response_model=APIResponse[List[Dict[str, Any]]])
def get_student_recommendations(
    student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    recs = db.query(Recommendation).filter(Recommendation.student_id == student.id).all()
    if not recs:
        default_recs = [
            {
                "id": 1,
                "title": "Strengthen Data Structures & Algorithms",
                "description": "DSA score is currently at 61%. Raising it to 75% raises role compatibility for Backend Developer to 79%.",
                "priority": "HIGH",
                "category": "SKILL_GAP",
                "impact": "High Impact (+7% readiness)"
            },
            {
                "id": 2,
                "title": "Add Spring Boot Project Evidence",
                "description": "Your target role requires Spring Boot. Building a microservice project will verify this skill.",
                "priority": "HIGH",
                "category": "PROJECT",
                "impact": "Verifies core required framework"
            },
            {
                "id": 3,
                "title": "Take SQL Skill Assessment",
                "description": "You have SQL listed on your profile. Take a 15-minute verification assessment to elevate confidence to 85%+.",
                "priority": "MEDIUM",
                "category": "ASSESSMENT",
                "impact": "Upgrades unverified skill to verified"
            }
        ]
        return APIResponse(success=True, data=default_recs, message="Recommendations retrieved")
    
    return APIResponse(
        success=True,
        data=[
            {
                "id": r.id,
                "title": r.title,
                "description": r.description,
                "priority": r.priority,
                "category": r.category,
                "impact": r.impact_description
            } for r in recs
        ],
        message="Recommendations retrieved"
    )


@router.post("/analyze-result", response_model=APIResponse[ResultAnalysisResponse])
def analyze_placement_result(
    req: ResultAnalysisRequest,
    student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    analysis = ResultAnalyzerService.analyze_result(req)
    return APIResponse(
        success=True,
        data=analysis,
        message="Placement result analyzed and skill gaps diagnosed"
    )
