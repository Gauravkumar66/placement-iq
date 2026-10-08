export interface CandidateWhy {
  type: 'positive' | 'neutral' | 'negative';
  text: string;
}

export interface MatchedCandidate {
  id: number;
  full_name: string;
  department: string;
  graduation_year: number;
  cgpa: number;
  role_fit_score: number;
  status: string;
  why_this_candidate: CandidateWhy[];
  verified_skills: string[];
  unverified_skills: string[];
  academic_fit: string;
  github_url?: string | null;
  portfolio_url?: string | null;
}

export interface RecruiterOverview {
  metrics: {
    open_jobs: number;
    matched_candidates: number;
    shortlisted: number;
    interviewing: number;
  };
  pipeline: Array<{
    stage: string;
    count: number;
  }>;
  recent_jobs: Array<{
    id: number;
    title: string;
    company: string;
    role_category: string;
    matched_count: number;
    shortlisted_count: number;
    status: string;
    location: string;
    salary: string;
  }>;
}
