export interface Job {
  id: number;
  company_id: number;
  company_name?: string | null;
  company_logo?: string | null;
  title: string;
  role_category: string;
  description: string;
  required_skills: string[];
  preferred_skills: string[];
  soft_skills: string[];
  min_cgpa: number;
  min_experience_years: number;
  max_experience_years: number;
  location: string;
  salary_range: string;
  is_active: boolean;
  created_at: string;
}

export interface JobRoleFit {
  job: Job;
  role_fit_score: number;
  eligibility_status: 'MATCHED' | 'NEAR_MATCH' | 'NOT_ELIGIBLE';
  category_fit: 'Best Match' | 'Good Match' | 'Stretch Opportunity';
  score_breakdown: Record<string, number>;
  strong_matches: string[];
  skill_gaps: string[];
  academic_eligibility: {
    eligible: boolean;
    student_cgpa: number;
    required_cgpa: number;
  };
  explanation: string;
}
