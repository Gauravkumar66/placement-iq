from typing import Any, Dict, List, Optional
from datetime import datetime
from pydantic import BaseModel, Field


class JobCreate(BaseModel):
    title: str
    company_id: int
    role_category: str
    description: str
    required_skills: List[str] = Field(default_factory=list)
    preferred_skills: List[str] = Field(default_factory=list)
    soft_skills: List[str] = Field(default_factory=list)
    min_cgpa: float = 7.0
    min_experience_years: float = 0.0
    max_experience_years: float = 2.0
    location: str = "Bengaluru / Remote"
    salary_range: str = "8 - 14 LPA"


class JobOut(BaseModel):
    id: int
    company_id: int
    company_name: Optional[str] = None
    company_logo: Optional[str] = None
    title: str
    role_category: str
    description: str
    required_skills: List[str]
    preferred_skills: List[str]
    soft_skills: List[str]
    min_cgpa: float
    min_experience_years: float
    max_experience_years: float
    location: str
    salary_range: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class JobRoleFitOut(BaseModel):
    job: JobOut
    role_fit_score: float
    eligibility_status: str  # MATCHED, NEAR_MATCH, NOT_ELIGIBLE
    category_fit: str  # Best Match, Good Match, Stretch Opportunity
    score_breakdown: Dict[str, float]
    strong_matches: List[str]
    skill_gaps: List[str]
    academic_eligibility: Dict[str, Any]
    explanation: str
