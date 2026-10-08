from typing import Any, Dict, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.routers.deps import get_current_student, get_current_user
from app.models.entities import Skill, Student, StudentSkill
from app.schemas.skill import SkillGraphData, SkillGraphNode, SkillGraphEdge, SkillOut
from app.schemas.student import StudentSkillItem
from app.schemas.common import APIResponse

router = APIRouter(prefix="/skills", tags=["Skills"])


@router.get("/", response_model=APIResponse[List[SkillOut]])
def get_all_skills(db: Session = Depends(get_db)):
    skills = db.query(Skill).all()
    return APIResponse(success=True, data=skills, message="Skills retrieved")


@router.get("/graph", response_model=APIResponse[SkillGraphData])
def get_skill_graph():
    # Return structured graph representing Language -> Framework -> Tool -> Role
    nodes = [
        # Languages
        SkillGraphNode(id="java", label="Java", type="language", category="Programming Language"),
        SkillGraphNode(id="python", label="Python", type="language", category="Programming Language"),
        SkillGraphNode(id="typescript", label="TypeScript", type="language", category="Programming Language"),
        SkillGraphNode(id="sql", label="SQL", type="language", category="Database"),
        # Frameworks
        SkillGraphNode(id="spring_boot", label="Spring Boot", type="framework", category="Backend Framework"),
        SkillGraphNode(id="fastapi", label="FastAPI", type="framework", category="Backend Framework"),
        SkillGraphNode(id="react", label="React", type="framework", category="Frontend Framework"),
        # Tools & DB
        SkillGraphNode(id="postgresql", label="PostgreSQL", type="tool", category="Database"),
        SkillGraphNode(id="docker", label="Docker", type="tool", category="DevOps"),
        SkillGraphNode(id="dsa", label="DSA", type="tool", category="Core Computer Science"),
        # Roles
        SkillGraphNode(id="backend_dev", label="Backend Developer", type="role", category="Job Role"),
        SkillGraphNode(id="frontend_dev", label="Frontend Developer", type="role", category="Job Role"),
        SkillGraphNode(id="fullstack_dev", label="Full Stack Developer", type="role", category="Job Role"),
    ]

    edges = [
        # Java path
        SkillGraphEdge(source="java", target="spring_boot", relation="framework_for"),
        SkillGraphEdge(source="spring_boot", target="postgresql", relation="integrates_with"),
        SkillGraphEdge(source="postgresql", target="backend_dev", relation="qualifies_for"),
        SkillGraphEdge(source="spring_boot", target="backend_dev", relation="qualifies_for"),
        SkillGraphEdge(source="dsa", target="backend_dev", relation="core_requirement"),
        # Python path
        SkillGraphEdge(source="python", target="fastapi", relation="framework_for"),
        SkillGraphEdge(source="fastapi", target="backend_dev", relation="qualifies_for"),
        # React path
        SkillGraphEdge(source="typescript", target="react", relation="framework_for"),
        SkillGraphEdge(source="react", target="frontend_dev", relation="qualifies_for"),
        # Full stack joins
        SkillGraphEdge(source="frontend_dev", target="fullstack_dev", relation="expands_to"),
        SkillGraphEdge(source="backend_dev", target="fullstack_dev", relation="expands_to"),
    ]

    return APIResponse(
        success=True,
        data=SkillGraphData(nodes=nodes, edges=edges),
        message="Skill ontology graph retrieved"
    )


@router.get("/student", response_model=APIResponse[List[StudentSkillItem]])
def get_student_skills(
    student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    skills = db.query(StudentSkill).filter(StudentSkill.student_id == student.id).all()
    if not skills:
        # Default demo evidence-based skills for student
        sample_skills = [
            StudentSkill(
                student_id=student.id,
                skill_name="Java",
                category="Programming Language",
                skill_level="ADVANCED",
                confidence_score=86.0,
                verification_status="VERIFIED",
                evidence_sources=["Backend Project", "Java Assessment", "Internship Experience", "Resume Mention"],
                assessment_score=89.0,
                project_evidence_count=2,
                experience_evidence_count=1,
            ),
            StudentSkill(
                student_id=student.id,
                skill_name="SQL",
                category="Database",
                skill_level="ADVANCED",
                confidence_score=82.0,
                verification_status="VERIFIED",
                evidence_sources=["SQL Assessment", "Backend Project", "Resume Mention"],
                assessment_score=82.0,
                project_evidence_count=1,
                experience_evidence_count=0,
            ),
            StudentSkill(
                student_id=student.id,
                skill_name="Data Structures & Algorithms",
                category="Core CS",
                skill_level="INTERMEDIATE",
                confidence_score=61.0,
                verification_status="VERIFIED",
                evidence_sources=["DSA Assessment", "Resume Mention"],
                assessment_score=61.0,
                project_evidence_count=0,
                experience_evidence_count=0,
            ),
            StudentSkill(
                student_id=student.id,
                skill_name="Docker",
                category="DevOps",
                skill_level="BEGINNER",
                confidence_score=34.0,
                verification_status="UNVERIFIED",
                evidence_sources=["Resume Mention"],
                assessment_score=None,
                project_evidence_count=0,
                experience_evidence_count=0,
            ),
            StudentSkill(
                student_id=student.id,
                skill_name="Spring Boot",
                category="Backend Framework",
                skill_level="BEGINNER",
                confidence_score=42.0,
                verification_status="UNVERIFIED",
                evidence_sources=["Resume Mention"],
                assessment_score=None,
                project_evidence_count=0,
                experience_evidence_count=0,
            ),
        ]
        for s in sample_skills:
            db.add(s)
        db.commit()
        skills = db.query(StudentSkill).filter(StudentSkill.student_id == student.id).all()

    return APIResponse(success=True, data=skills, message="Student skills retrieved")
