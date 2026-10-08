import enum


class UserRole(str, enum.Enum):
    STUDENT = "STUDENT"
    TPO = "TPO"
    RECRUITER = "RECRUITER"
    ADMIN = "ADMIN"


class SkillLevel(str, enum.Enum):
    BEGINNER = "BEGINNER"
    INTERMEDIATE = "INTERMEDIATE"
    ADVANCED = "ADVANCED"
    EXPERT = "EXPERT"


class VerificationStatus(str, enum.Enum):
    VERIFIED = "VERIFIED"
    UNVERIFIED = "UNVERIFIED"


class EligibilityStatus(str, enum.Enum):
    MATCHED = "MATCHED"
    NEAR_MATCH = "NEAR_MATCH"
    NOT_ELIGIBLE = "NOT_ELIGIBLE"


class QuestionDifficulty(str, enum.Enum):
    EASY = "EASY"
    MEDIUM = "MEDIUM"
    HARD = "HARD"


class ApplicationStatus(str, enum.Enum):
    APPLIED = "APPLIED"
    SHORTLISTED = "SHORTLISTED"
    ASSESSMENT_PENDING = "ASSESSMENT_PENDING"
    INTERVIEW_SCHEDULED = "INTERVIEW_SCHEDULED"
    OFFERED = "OFFERED"
    REJECTED = "REJECTED"


class AssessmentType(str, enum.Enum):
    MCQ = "MCQ"
    CODING = "CODING"
    SHORT_ANSWER = "SHORT_ANSWER"
    SCENARIO = "SCENARIO"
