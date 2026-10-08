from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class ResultAnalysisRequest(BaseModel):
    company_name: str
    tech_field: str
    stage: str = "Technical Interview Round 1"
    verdict: str = "REJECTED / NEEDS IMPROVEMENT"
    score_or_performance: Optional[str] = "Round eliminated / Stuck on optimization"
    questions_faced: str
    struggle_areas: Optional[str] = None
    notes: Optional[str] = None


class LackingSkillDetail(BaseModel):
    skill_name: str
    severity: str  # CRITICAL_BLOCKER, MODERATE_GAP, MINOR_POLISH
    current_demonstrated_level: str
    company_benchmark_level: str
    why_it_matters: str
    recommended_action: str


class ResultAnalysisResponse(BaseModel):
    company_name: str
    tech_field: str
    stage: str
    verdict: str
    overall_gap_severity: str  # HIGH, MODERATE, LOW
    company_hiring_bar_summary: str
    analysis_summary: str
    lacking_skills: List[LackingSkillDetail]
    strengths_identified: List[str]
    recovery_roadmap: List[Dict[str, str]]
    estimated_readiness_impact: str
