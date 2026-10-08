from typing import Any, Dict, List, Optional
from datetime import datetime
from pydantic import BaseModel, Field


class SkillCreate(BaseModel):
    name: str
    category: str
    parent_skill_id: Optional[int] = None
    related_roles: List[str] = Field(default_factory=list)


class SkillOut(BaseModel):
    id: int
    name: str
    normalized_name: str
    category: str
    parent_skill_id: Optional[int] = None
    related_roles: List[str] = Field(default_factory=list)

    class Config:
        from_attributes = True


class SkillGapItem(BaseModel):
    skill_name: str
    impact: str  # HIGH, MEDIUM, LOW
    status: str  # MISSING, WEAK, VERIFIED
    explanation: str
    recommended_action: str


class SkillGraphNode(BaseModel):
    id: str
    label: str
    type: str  # language, framework, tool, role
    category: str


class SkillGraphEdge(BaseModel):
    source: str
    target: str
    relation: str


class SkillGraphData(BaseModel):
    nodes: List[SkillGraphNode]
    edges: List[SkillGraphEdge]
