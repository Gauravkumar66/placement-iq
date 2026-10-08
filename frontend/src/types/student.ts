export interface StudentSkill {
  id: number;
  skill_name: string;
  category: string;
  skill_level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  confidence_score: number;
  verification_status: 'VERIFIED' | 'UNVERIFIED';
  evidence_sources: string[];
  assessment_score?: number | null;
  project_evidence_count: number;
  experience_evidence_count: number;
  last_verified_at?: string | null;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  tech_stack: string[];
  github_url?: string | null;
  live_url?: string | null;
  complexity_score: number;
  relevance_score: number;
  recommendation_improvement?: string | null;
}

export interface StudentProfile {
  id: number;
  user_id: number;
  full_name: string;
  profile_photo?: string | null;
  email: string;
  phone?: string | null;
  college: string;
  department: string;
  degree: string;
  graduation_year: number;
  cgpa: number;
  backlogs: number;
  location?: string | null;
  about?: string | null;
  resume_url?: string | null;
  github_url?: string | null;
  linkedin_url?: string | null;
  portfolio_url?: string | null;
  preferred_job_roles: string[];
  preferred_industries: string[];
  profile_completion: number;
  readiness_score: number;
  technical_score: number;
  projects_score: number;
  communication_score: number;
  dsa_score: number;
  resume_score: number;
  skills: StudentSkill[];
  projects: Project[];
}

export interface ReadinessBreakdown {
  overall_readiness: number;
  status_label: 'Highly Ready' | 'Placement Ready' | 'Needs Preparation' | 'Early Preparation';
  technical: number;
  projects: number;
  communication: number;
  dsa: number;
  resume: number;
  biggest_opportunity: {
    skill: string;
    current_score: number;
    target_score: number;
    potential_overall_increase: number;
    target_role: string;
    note: string;
  };
  target_role_readiness: Array<{
    role: string;
    fit_score: number;
    status: string;
  }>;
}

export interface LearningModule {
  day: string;
  topic: string;
  focus: string;
  gap: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface LearningPlan {
  target_role: string;
  current_readiness: number;
  target_readiness: number;
  duration_days: number;
  modules: LearningModule[];
}

export interface Recommendation {
  id: number;
  title: string;
  description: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  impact: string;
}
