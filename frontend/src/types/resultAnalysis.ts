export interface LackingSkillDetail {
  skill_name: string;
  severity: 'CRITICAL_BLOCKER' | 'MODERATE_GAP' | 'MINOR_POLISH';
  current_demonstrated_level: string;
  company_benchmark_level: string;
  why_it_matters: string;
  recommended_action: string;
}

export interface ResultAnalysisRequest {
  company_name: string;
  tech_field: string;
  stage: string;
  verdict: string;
  score_or_performance?: string;
  questions_faced: string;
  struggle_areas?: string;
  notes?: string;
}

export interface ResultAnalysisResponse {
  company_name: string;
  tech_field: string;
  stage: string;
  verdict: string;
  overall_gap_severity: 'HIGH' | 'MODERATE' | 'LOW';
  company_hiring_bar_summary: string;
  analysis_summary: string;
  lacking_skills: LackingSkillDetail[];
  strengths_identified: string[];
  recovery_roadmap: Array<{
    day: string;
    focus: string;
    action: string;
  }>;
  estimated_readiness_impact: string;
}
