from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class SimulatorRequest(BaseModel):
    job_id: Optional[int] = None
    role_category: Optional[str] = "Backend Developer"
    intervention_skill: str = "Data Structures & Algorithms"
    expected_skill_improvement: float = 15.0  # e.g. +15%
    department_filter: Optional[str] = None  # None = All


class SimulatorDistributionItem(BaseModel):
    tier: str  # 0-49, 50-69, 70-84, 85-100
    current_count: int
    projected_count: int


class SimulatorResponse(BaseModel):
    simulation_label: str = "SIMULATION — ESTIMATED PROJECTION ONLY (NOT GUARANTEED)"
    target_role_or_job: str
    intervention_skill: str
    expected_improvement_applied: float
    total_evaluated_students: int
    current_eligible_count: int
    projected_eligible_count: int
    potential_increase: int
    current_average_readiness: float
    projected_average_readiness: float
    readiness_delta: float
    skill_distribution: List[SimulatorDistributionItem]
    department_breakdown: List[Dict[str, Any]]
    explanation: str
