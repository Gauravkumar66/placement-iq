import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app.core.security import get_password_hash
from app.models.entities import User, Student, Company, Job, Skill, StudentSkill, LearningPlan, Recommendation
from app.models.enums import UserRole

# Routers
from app.routers.auth import router as auth_router
from app.routers.students import router as students_router
from app.routers.skills import router as skills_router
from app.routers.jobs import router as jobs_router
from app.routers.assessments import router as assessments_router
from app.routers.tpo import router as tpo_router
from app.routers.recruiters import router as recruiters_router
from app.routers.simulator import router as simulator_router
from app.routers.notifications import router as notifications_router
from app.routers.assistant import router as assistant_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def seed_demo_data():
    db = SessionLocal()
    try:
        # Check if demo student exists
        student_user = db.query(User).filter(User.email == "student@example.com").first()
        if not student_user:
            logger.info("Seeding demo accounts into database...")
            pwd_hash = get_password_hash("Password123!")

            # 1. Student User
            u_student = User(
                email="student@example.com",
                hashed_password=pwd_hash,
                role=UserRole.STUDENT.value,
                is_active=True
            )
            db.add(u_student)
            db.flush()

            student = Student(
                user_id=u_student.id,
                full_name="Aarav Patel",
                email="student@example.com",
                phone="+91 98765 43210",
                college="Apex Institute of Technology",
                department="Computer Science & Engineering",
                degree="B.Tech",
                graduation_year=2026,
                cgpa=8.4,
                backlogs=0,
                location="Bengaluru, India",
                about="Aspiring Backend Engineer passionate about distributed systems, clean REST APIs, and database design.",
                github_url="https://github.com/aarav-patel",
                linkedin_url="https://linkedin.com/in/aarav-patel-tech",
                portfolio_url="https://aarav-portfolio.dev",
                preferred_job_roles=["Backend Developer", "Software Engineer"],
                profile_completion=78,
                readiness_score=68.0,
                technical_score=72.0,
                projects_score=70.0,
                communication_score=75.0,
                dsa_score=61.0,
                resume_score=80.0,
            )
            db.add(student)
            db.flush()

            # Seed Student Skills
            s_skills = [
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
            ]
            for sk in s_skills:
                db.add(sk)

            # 2. TPO User
            u_tpo = User(
                email="tpo@example.com",
                hashed_password=pwd_hash,
                role=UserRole.TPO.value,
                is_active=True
            )
            db.add(u_tpo)

            # 3. Recruiter User
            u_recruiter = User(
                email="recruiter@example.com",
                hashed_password=pwd_hash,
                role=UserRole.RECRUITER.value,
                is_active=True
            )
            db.add(u_recruiter)

            # 4. Admin User
            u_admin = User(
                email="admin@example.com",
                hashed_password=pwd_hash,
                role=UserRole.ADMIN.value,
                is_active=True
            )
            db.add(u_admin)

            # Companies & Jobs
            comp1 = Company(
                name="Nexus Innovations",
                industry="FinTech & Enterprise Cloud",
                website="https://nexusinnovations.tech",
                location="Bengaluru, India",
                description="Global financial intelligence and high-throughput transaction platform."
            )
            db.add(comp1)
            db.flush()

            job1 = Job(
                company_id=comp1.id,
                title="Backend Software Engineer",
                role_category="Backend Developer",
                description="Architect high-performance distributed microservices, REST APIs, and database schemas.",
                required_skills=["Java", "Spring Boot", "SQL", "DSA"],
                preferred_skills=["Docker", "AWS", "PostgreSQL"],
                soft_skills=["Problem Solving", "Communication"],
                min_cgpa=7.0,
                min_experience_years=0.0,
                max_experience_years=2.0,
                location="Bengaluru / Hybrid",
                salary_range="12 - 16 LPA"
            )
            job2 = Job(
                company_id=comp1.id,
                title="Full Stack Software Engineer",
                role_category="Full Stack Developer",
                description="Build end-to-end full stack web platforms using React, TypeScript, and Python/Node.",
                required_skills=["React", "TypeScript", "Node.js", "SQL"],
                preferred_skills=["Docker", "TailwindCSS"],
                soft_skills=["Collaboration", "Design sensibility"],
                min_cgpa=7.0,
                min_experience_years=0.0,
                max_experience_years=2.0,
                location="Hyderabad / Remote",
                salary_range="10 - 14 LPA"
            )
            db.add(job1)
            db.add(job2)

            # Seed extra demo students for TPO batch statistics
            departments = ["Computer Science & Engineering", "Information Technology", "Electronics & Communication", "Computer Applications"]
            for i in range(1, 26):
                dept = departments[i % len(departments)]
                readiness = round(52.0 + (i * 1.7) % 43, 1)
                dsa = round(48.0 + (i * 2.1) % 45, 1)
                u = User(
                    email=f"student{i}@example.com",
                    hashed_password=pwd_hash,
                    role=UserRole.STUDENT.value,
                    is_active=True
                )
                db.add(u)
                db.flush()
                st = Student(
                    user_id=u.id,
                    full_name=f"Student {i:02d}",
                    email=f"student{i}@example.com",
                    department=dept,
                    degree="B.Tech",
                    graduation_year=2026,
                    cgpa=round(7.0 + (i % 25) * 0.1, 2),
                    backlogs=0 if i % 4 != 0 else 1,
                    profile_completion=70 + (i % 25),
                    readiness_score=readiness,
                    technical_score=round(readiness + 2.0, 1),
                    projects_score=round(readiness - 3.0, 1),
                    communication_score=round(70.0 + (i % 15), 1),
                    dsa_score=dsa,
                    resume_score=round(75.0 + (i % 18), 1),
                    preferred_job_roles=["Backend Developer" if i % 2 == 0 else "Software Engineer"]
                )
                db.add(st)

            db.commit()
            logger.info("Demo data seed complete!")
    except Exception as e:
        db.rollback()
        logger.error(f"Error seeding demo data: {e}")
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables and seed
    Base.metadata.create_all(bind=engine)
    seed_demo_data()
    yield
    # Shutdown


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Placement Intelligence System — Turn skills into opportunities.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Error handling
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": f"HTTP_{exc.status_code}",
                "message": str(exc.detail),
                "details": None,
            }
        }
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "Input validation failed. Please check submitted fields.",
                "details": exc.errors(),
            }
        }
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error processing {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "Something went wrong. Your data is safe — try again.",
                "details": None,
            }
        }
    )


# Include Routers
app.include_router(auth_router, prefix="/api")
app.include_router(students_router, prefix="/api")
app.include_router(skills_router, prefix="/api")
app.include_router(jobs_router, prefix="/api")
app.include_router(assessments_router, prefix="/api")
app.include_router(tpo_router, prefix="/api")
app.include_router(recruiters_router, prefix="/api")
app.include_router(simulator_router, prefix="/api")
app.include_router(notifications_router, prefix="/api")
app.include_router(assistant_router, prefix="/api")


@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "Placement IQ Backend", "version": "1.0.0"}
