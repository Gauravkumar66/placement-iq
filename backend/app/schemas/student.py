from typing import Any, Dict, List, Optional
from datetime import datetime
from pydantic import BaseModel, Field


class StudentSkillItem(BaseModel):
    id: int
    skill_name: str
    category: str
    skill_level: str
    confidence_score: float
    verification_status: str
    evidence_sources: List[str]
    assessment_score: Optional[float] = None
    project_evidence_count: int = 0
    experience_evidence_count: int = 0
    last_verified_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ProjectItem(BaseModel):
    id: int
    title: str
    description: str
    tech_stack: List[str]
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    complexity_score: float
    relevance_score: float
    recommendation_improvement: Optional[str] = None

    class Config:
        from_attributes = True


class StudentProfileOut(BaseModel):
    id: int
    user_id: int
    full_name: str
    profile_photo: Optional[str] = None
    email: str
    phone: Optional[str] = None
    college: str
    department: str
    degree: str
    graduation_year: int
    cgpa: float
    backlogs: int
    location: Optional[str] = None
    about: Optional[str] = None
    resume_url: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    preferred_job_roles: List[str] = Field(default_factory=list)
    preferred_industries: List[str] = Field(default_factory=list)
    profile_completion: int
    
    # Readiness Scores
    readiness_score: float
    technical_score: float
    projects_score: float
    communication_score: float
    dsa_score: float
    resume_score: float
    
    skills: List[StudentSkillItem] = Field(default_factory=list)
    projects: List[ProjectItem] = Field(default_factory=list)

    class Config:
        from_attributes = True


class StudentProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    college: Optional[str] = None
    department: Optional[str] = None
    degree: Optional[str] = None
    graduation_year: Optional[int] = None
    cgpa: Optional[float] = None
    backlogs: Optional[int] = None
    location: Optional[str] = None
    about: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    preferred_job_roles: Optional[List[str]] = None
    preferred_industries: Optional[List[str]] = None


class ReadinessBreakdownOut(BaseModel):
    overall_readiness: float
    status_label: str  # Highly Ready, Placement Ready, Needs Preparation, Early Preparation
    technical: float
    projects: float
    communication: float
    dsa: float
    resume: float
    biggest_opportunity: Dict[str, Any]
    target_role_readiness: List[Dict[str, Any]]
