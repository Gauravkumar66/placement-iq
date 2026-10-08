from datetime import datetime
from sqlalchemy import (
    Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Text, JSON
)
from sqlalchemy.orm import relationship
from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="STUDENT")  # STUDENT, TPO, RECRUITER, ADMIN
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    student_profile = relationship("Student", back_populates="user", uselist=False, cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="user")


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    profile_photo = Column(String(500), nullable=True)
    email = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    college = Column(String(255), default="Apex Institute of Technology")
    department = Column(String(100), default="Computer Science & Engineering")
    degree = Column(String(100), default="B.Tech")
    graduation_year = Column(Integer, default=2026)
    cgpa = Column(Float, default=8.0)
    backlogs = Column(Integer, default=0)
    location = Column(String(255), default="Bengaluru, India")
    about = Column(Text, nullable=True)
    
    # Portfolio Links
    resume_url = Column(String(500), nullable=True)
    github_url = Column(String(500), nullable=True)
    linkedin_url = Column(String(500), nullable=True)
    portfolio_url = Column(String(500), nullable=True)
    
    preferred_job_roles = Column(JSON, default=list)
    preferred_industries = Column(JSON, default=list)
    profile_completion = Column(Integer, default=70)
    
    # Readiness Scores (0-100)
    readiness_score = Column(Float, default=68.0)
    technical_score = Column(Float, default=72.0)
    projects_score = Column(Float, default=70.0)
    communication_score = Column(Float, default=75.0)
    dsa_score = Column(Float, default=61.0)
    resume_score = Column(Float, default=80.0)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="student_profile")
    skills = relationship("StudentSkill", back_populates="student", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="student", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="student", cascade="all, delete-orphan")
    assessment_attempts = relationship("AssessmentAttempt", back_populates="student", cascade="all, delete-orphan")
    interviews = relationship("Interview", back_populates="student", cascade="all, delete-orphan")
    recommendations = relationship("Recommendation", back_populates="student", cascade="all, delete-orphan")
    learning_plans = relationship("LearningPlan", back_populates="student", cascade="all, delete-orphan")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    normalized_name = Column(String(100), index=True, nullable=False)
    category = Column(String(100), nullable=False)  # Programming Language, Framework, Tool, Database, Core CS, Soft Skill
    parent_skill_id = Column(Integer, ForeignKey("skills.id"), nullable=True)
    related_roles = Column(JSON, default=list)


class StudentSkill(Base):
    __tablename__ = "student_skills"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=True)
    skill_name = Column(String(100), nullable=False)
    category = Column(String(100), default="Technical")
    skill_level = Column(String(50), default="INTERMEDIATE")  # BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
    confidence_score = Column(Float, default=50.0)  # 0-100
    verification_status = Column(String(50), default="UNVERIFIED")  # VERIFIED, UNVERIFIED
    evidence_sources = Column(JSON, default=list)  # e.g. ["Backend Project", "Java Assessment", "Resume Mention"]
    assessment_score = Column(Float, nullable=True)
    project_evidence_count = Column(Integer, default=0)
    experience_evidence_count = Column(Integer, default=0)
    last_verified_at = Column(DateTime, nullable=True)

    student = relationship("Student", back_populates="skills")
    evidences = relationship("SkillEvidence", back_populates="student_skill", cascade="all, delete-orphan")


class SkillEvidence(Base):
    __tablename__ = "skill_evidences"

    id = Column(Integer, primary_key=True, index=True)
    student_skill_id = Column(Integer, ForeignKey("student_skills.id"), nullable=False)
    evidence_type = Column(String(50), nullable=False)  # PROJECT, ASSESSMENT, INTERNSHIP, RESUME
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    verified_at = Column(DateTime, default=datetime.utcnow)
    score = Column(Float, nullable=True)

    student_skill = relationship("StudentSkill", back_populates="evidences")


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    tech_stack = Column(JSON, default=list)
    github_url = Column(String(500), nullable=True)
    live_url = Column(String(500), nullable=True)
    complexity_score = Column(Float, default=70.0)
    relevance_score = Column(Float, default=75.0)
    recommendation_improvement = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("Student", back_populates="projects")


class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, index=True, nullable=False)
    industry = Column(String(100), default="Technology")
    website = Column(String(500), nullable=True)
    logo_url = Column(String(500), nullable=True)
    description = Column(Text, nullable=True)
    location = Column(String(255), default="Bengaluru, India")

    jobs = relationship("Job", back_populates="company", cascade="all, delete-orphan")
    placement_drives = relationship("PlacementDrive", back_populates="company", cascade="all, delete-orphan")


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    title = Column(String(255), nullable=False)
    role_category = Column(String(100), nullable=False)  # Backend Developer, Frontend Developer, etc.
    description = Column(Text, nullable=False)
    required_skills = Column(JSON, default=list)
    preferred_skills = Column(JSON, default=list)
    soft_skills = Column(JSON, default=list)
    min_cgpa = Column(Float, default=7.0)
    min_experience_years = Column(Float, default=0.0)
    max_experience_years = Column(Float, default=2.0)
    location = Column(String(255), default="Bengaluru / Remote")
    salary_range = Column(String(100), default="8 - 14 LPA")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    company = relationship("Company", back_populates="jobs")
    applications = relationship("Application", back_populates="job", cascade="all, delete-orphan")


class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    skill_name = Column(String(100), nullable=False)
    category = Column(String(100), default="Technical")
    description = Column(Text, nullable=True)
    time_limit_minutes = Column(Integer, default=30)
    total_questions = Column(Integer, default=10)
    passing_score = Column(Float, default=60.0)

    questions = relationship("Question", back_populates="assessment", cascade="all, delete-orphan")
    attempts = relationship("AssessmentAttempt", back_populates="assessment", cascade="all, delete-orphan")


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"), nullable=False)
    question_text = Column(Text, nullable=False)
    question_type = Column(String(50), default="MCQ")  # MCQ, CODING, SHORT_ANSWER, SCENARIO
    options = Column(JSON, default=list)  # ["Option A", "Option B", ...]
    correct_answer = Column(String(255), nullable=False)
    difficulty = Column(String(50), default="MEDIUM")  # EASY, MEDIUM, HARD
    explanation = Column(Text, nullable=True)

    assessment = relationship("Assessment", back_populates="questions")


class AssessmentAttempt(Base):
    __tablename__ = "assessment_attempts"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    assessment_id = Column(Integer, ForeignKey("assessments.id"), nullable=False)
    score = Column(Float, default=0.0)
    passed = Column(Boolean, default=False)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    status = Column(String(50), default="COMPLETED")
    answers = Column(JSON, default=dict)

    student = relationship("Student", back_populates="assessment_attempts")
    assessment = relationship("Assessment", back_populates="attempts")


class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    interview_type = Column(String(50), default="TECHNICAL")  # TECHNICAL, HR, BEHAVIORAL
    target_role = Column(String(100), default="Backend Developer")
    status = Column(String(50), default="COMPLETED")
    overall_score = Column(Float, default=78.0)
    technical_depth = Column(Float, default=80.0)
    communication = Column(Float, default=82.0)
    problem_solving = Column(Float, default=74.0)
    strengths = Column(JSON, default=list)
    weaknesses = Column(JSON, default=list)
    transcript_or_notes = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("Student", back_populates="interviews")


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    status = Column(String(50), default="APPLIED")  # APPLIED, SHORTLISTED, ASSESSMENT_PENDING, INTERVIEW_SCHEDULED, OFFERED, REJECTED
    role_fit_score = Column(Float, default=75.0)
    applied_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("Student", back_populates="applications")
    job = relationship("Job", back_populates="applications")


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    target_role = Column(String(100), default="Backend Developer")
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    priority = Column(String(50), default="HIGH")  # HIGH, MEDIUM, LOW
    category = Column(String(50), default="SKILL_GAP")  # SKILL_GAP, PROJECT, ASSESSMENT, RESUME
    impact_description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("Student", back_populates="recommendations")


class LearningPlan(Base):
    __tablename__ = "learning_plans"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    target_role = Column(String(100), default="Backend Developer")
    current_readiness = Column(Float, default=68.0)
    target_readiness = Column(Float, default=85.0)
    days_duration = Column(Integer, default=14)
    modules = Column(JSON, default=list)  # structured 14-day schedule
    created_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("Student", back_populates="learning_plans")


class PlacementDrive(Base):
    __tablename__ = "placement_drives"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    title = Column(String(255), nullable=False)
    drive_date = Column(DateTime, default=datetime.utcnow)
    eligible_departments = Column(JSON, default=list)
    min_cgpa = Column(Float, default=7.0)
    status = Column(String(50), default="UPCOMING")  # UPCOMING, ONGOING, COMPLETED

    company = relationship("Company", back_populates="placement_drives")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), default="SYSTEM")  # READINESS, JOB_MATCH, ASSESSMENT, RESUME, SYSTEM
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="notifications")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    action = Column(String(100), nullable=False)
    resource = Column(String(100), nullable=False)
    details = Column(JSON, default=dict)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="audit_logs")
