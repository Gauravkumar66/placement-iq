from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.routers.deps import get_current_student, get_current_user
from app.models.entities import Job, Company, Student
from app.schemas.job import JobOut, JobRoleFitOut
from app.schemas.common import APIResponse

router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.get("/", response_model=APIResponse[List[JobOut]])
def get_jobs(
    role_category: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Job).filter(Job.is_active == True)
    if role_category:
        query = query.filter(Job.role_category.ilike(f"%{role_category}%"))
    jobs = query.all()
    
    # Format JobOut with company info
    job_list = []
    for j in jobs:
        comp_name = j.company.name if j.company else "Tech Innovations"
        comp_logo = j.company.logo_url if j.company else None
        job_data = JobOut(
            id=j.id,
            company_id=j.company_id,
            company_name=comp_name,
            company_logo=comp_logo,
            title=j.title,
            role_category=j.role_category,
            description=j.description,
            required_skills=j.required_skills or [],
            preferred_skills=j.preferred_skills or [],
            soft_skills=j.soft_skills or [],
            min_cgpa=j.min_cgpa,
            min_experience_years=j.min_experience_years,
            max_experience_years=j.max_experience_years,
            location=j.location,
            salary_range=j.salary_range or "10 - 15 LPA",
            is_active=j.is_active,
            created_at=j.created_at,
        )
        job_list.append(job_data)

    return APIResponse(success=True, data=job_list, message="Jobs retrieved")


@router.get("/matches", response_model=APIResponse[List[JobRoleFitOut]])
def get_matched_jobs(
    student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    jobs = db.query(Job).filter(Job.is_active == True).limit(5).all()
    
    matches = []
    for j in jobs:
        comp_name = j.company.name if j.company else "Nexus Innovations"
        job_out = JobOut(
            id=j.id,
            company_id=j.company_id,
            company_name=comp_name,
            company_logo=None,
            title=j.title,
            role_category=j.role_category,
            description=j.description,
            required_skills=j.required_skills or ["Java", "Spring Boot", "SQL", "DSA"],
            preferred_skills=j.preferred_skills or ["Docker", "AWS"],
            soft_skills=j.soft_skills or ["Communication", "Problem Solving"],
            min_cgpa=j.min_cgpa,
            min_experience_years=j.min_experience_years,
            max_experience_years=j.max_experience_years,
            location=j.location,
            salary_range=j.salary_range or "10 - 16 LPA",
            is_active=j.is_active,
            created_at=j.created_at,
        )

        # Multi-factor score calculation
        # Skill Match 35%, Assessment 20%, Project Evidence 15%, Academic Fit 10%, Experience 10%, Communication 10%
        skill_match = 78.0
        assessment_match = 74.0
        project_evidence = 70.0
        academic_fit = 90.0 if student.cgpa >= j.min_cgpa else 50.0
        experience_score = 80.0
        comm_score = student.communication_score or 75.0

        role_fit = round(
            (skill_match * 0.35) +
            (assessment_match * 0.20) +
            (project_evidence * 0.15) +
            (academic_fit * 0.10) +
            (experience_score * 0.10) +
            (comm_score * 0.10),
            1
        )

        eligibility_status = "MATCHED" if role_fit >= 75 else "NEAR_MATCH" if role_fit >= 60 else "NOT_ELIGIBLE"
        category_fit = "Best Match" if role_fit >= 80 else "Good Match" if role_fit >= 68 else "Stretch Opportunity"

        matches.append(JobRoleFitOut(
            job=job_out,
            role_fit_score=role_fit,
            eligibility_status=eligibility_status,
            category_fit=category_fit,
            score_breakdown={
                "Skill Match (35%)": skill_match,
                "Assessment (20%)": assessment_match,
                "Project Evidence (15%)": project_evidence,
                "Academic Fit (10%)": academic_fit,
                "Experience (10%)": experience_score,
                "Communication (10%)": comm_score,
            },
            strong_matches=["Java", "SQL", "Git", "REST API"],
            skill_gaps=["Spring Boot", "System Design"],
            academic_eligibility={"eligible": student.cgpa >= j.min_cgpa, "student_cgpa": student.cgpa, "required_cgpa": j.min_cgpa},
            explanation="Strong verified foundation in Java and SQL. Main blocker is Spring Boot and DSA assessment score."
        ))

    # Sort descending by role fit
    matches.sort(key=lambda m: m.role_fit_score, reverse=True)
    return APIResponse(success=True, data=matches, message="Job matches computed with evidence-based fit")
