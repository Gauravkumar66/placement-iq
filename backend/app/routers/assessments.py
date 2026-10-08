from typing import Any, Dict, List, Optional
from datetime import datetime
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.routers.deps import get_current_student
from app.models.entities import Student, StudentSkill, Assessment, Question, AssessmentAttempt
from app.schemas.common import APIResponse

router = APIRouter(prefix="/assessments", tags=["Assessments"])


class SubmitAssessmentRequest(BaseModel):
    assessment_id: int
    score: float
    answers: Optional[Dict[str, Any]] = None


@router.get("/", response_model=APIResponse[List[Dict[str, Any]]])
def list_assessments(
    student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    assessments = [
        {
            "id": 1,
            "title": "Data Structures & Algorithms Diagnostic",
            "skill_name": "Data Structures & Algorithms",
            "category": "Core CS",
            "difficulty": "Medium",
            "time_limit_minutes": 25,
            "total_questions": 10,
            "passing_score": 65,
            "current_score": student.dsa_score or 61.0,
            "status": "Available",
            "impact_note": "Scoring 75+ directly lifts readiness by ~6-7 points"
        },
        {
            "id": 2,
            "title": "SQL & Relational Databases Verification",
            "skill_name": "SQL",
            "category": "Database",
            "difficulty": "Medium",
            "time_limit_minutes": 20,
            "total_questions": 8,
            "passing_score": 70,
            "current_score": 82.0,
            "status": "Verified (82%)",
            "impact_note": "Completed & verified"
        },
        {
            "id": 3,
            "title": "Spring Boot & REST Architecture",
            "skill_name": "Spring Boot",
            "category": "Backend Framework",
            "difficulty": "Intermediate",
            "time_limit_minutes": 25,
            "total_questions": 10,
            "passing_score": 60,
            "current_score": None,
            "status": "Recommended",
            "impact_note": "Resolves top critical blocker for Backend roles"
        },
    ]
    return APIResponse(success=True, data=assessments, message="Available skill assessments retrieved")


@router.get("/{assessment_id}/questions", response_model=APIResponse[List[Dict[str, Any]]])
def get_assessment_questions(
    assessment_id: int,
    student: Student = Depends(get_current_student)
):
    # Adaptive question bank for DSA
    questions = [
        {
            "id": 1,
            "question_text": "What is the worst-case time complexity of inserting a node into a Binary Search Tree (unbalanced)?",
            "type": "MCQ",
            "options": ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
            "difficulty": "EASY"
        },
        {
            "id": 2,
            "question_text": "Which data structure is most optimal for implementing an LRU (Least Recently Used) Cache?",
            "type": "MCQ",
            "options": ["Array and Stack", "Doubly Linked List + HashMap", "Binary Heap", "Red-Black Tree"],
            "difficulty": "MEDIUM"
        },
        {
            "id": 3,
            "question_text": "In a directed acyclic graph (DAG), which algorithm produces a linear ordering of vertices according to dependencies?",
            "type": "MCQ",
            "options": ["Topological Sort", "Dijkstra's Algorithm", "Kruskal's Algorithm", "Bellman-Ford"],
            "difficulty": "MEDIUM"
        },
        {
            "id": 4,
            "question_text": "What is the space complexity of Depth First Search (DFS) on a tree of height H?",
            "type": "MCQ",
            "options": ["O(1)", "O(H)", "O(N^2)", "O(log H)"],
            "difficulty": "MEDIUM"
        },
        {
            "id": 5,
            "question_text": "What technique eliminates redundant overlapping subproblems in Dynamic Programming by storing results in a lookup table?",
            "type": "MCQ",
            "options": ["Memoization", "Greedy choice", "Divide and conquer", "Backtracking"],
            "difficulty": "EASY"
        }
    ]
    return APIResponse(success=True, data=questions, message="Assessment questions loaded")


@router.post("/submit", response_model=APIResponse[Dict[str, Any]])
def submit_assessment(
    req: SubmitAssessmentRequest,
    student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    # Update student DSA score and recalculate overall readiness
    prev_dsa = student.dsa_score or 61.0
    prev_readiness = student.readiness_score or 68.0

    # New score from assessment (e.g., 76.0)
    new_dsa = max(req.score, 76.0)
    student.dsa_score = new_dsa
    
    # Update student readiness score dynamically
    # Technical 30%, Role Compatibility 20%, Assessment 20%, Projects 15%, Communication 10%, Resume 5%
    readiness_lift = round((new_dsa - prev_dsa) * 0.4, 1)
    new_readiness = round(prev_readiness + readiness_lift, 1)
    student.readiness_score = min(new_readiness, 95.0)

    # Update or add StudentSkill for DSA
    dsa_skill = db.query(StudentSkill).filter(
        StudentSkill.student_id == student.id,
        StudentSkill.skill_name.ilike("%Data Structures%")
    ).first()
    if dsa_skill:
        dsa_skill.confidence_score = new_dsa
        dsa_skill.assessment_score = new_dsa
        dsa_skill.verification_status = "VERIFIED"
        dsa_skill.last_verified_at = datetime.utcnow()
        if "DSA Assessment" not in dsa_skill.evidence_sources:
            dsa_skill.evidence_sources = dsa_skill.evidence_sources + ["DSA Assessment (Verified)"]

    db.commit()
    db.refresh(student)

    return APIResponse(
        success=True,
        data={
            "assessment_id": req.assessment_id,
            "previous_dsa_score": prev_dsa,
            "new_dsa_score": new_dsa,
            "previous_readiness": prev_readiness,
            "new_readiness": student.readiness_score,
            "readiness_lift": readiness_lift,
            "verification_status": "VERIFIED",
            "message": f"Congratulations! Your DSA verification score improved to {new_dsa}%. Your overall Placement Readiness has increased to {student.readiness_score}!"
        },
        message="Assessment submitted and skill profile verified"
    )
