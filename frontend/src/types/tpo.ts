export interface BatchMetrics {
  total_students: number;
  placement_ready: number;
  near_ready: number;
  at_risk: number;
  not_assessed: number;
  avg_readiness: number;
  avg_technical: number;
  avg_communication: number;
  top_skill: string;
  biggest_skill_gap: string;
}

export interface DepartmentStats {
  department: string;
  name: string;
  students: number;
  avg_readiness: number;
  ready_percentage: number;
}

export interface SkillHeatmapRow {
  department: string;
  Java: number;
  Python: number;
  SQL: number;
  DSA: number;
  Cloud: number;
}

export interface SkillGapAnalysis {
  skill: string;
  demand_percentage: number;
  batch_supply_percentage: number;
  gap_percentage: number;
}

export interface TPOStudentRow {
  id: number;
  name: string;
  email: string;
  department: string;
  cgpa: number;
  readiness: number;
  target_role: string;
  top_skill: string;
  critical_gap: string;
  status: string;
  graduation_year: number;
}

export interface TPOOverviewData {
  metrics: BatchMetrics;
  departments: DepartmentStats[];
  skill_heatmap: SkillHeatmapRow[];
  skill_gaps: SkillGapAnalysis[];
  readiness_trends: Array<{
    month: string;
    readiness: number;
    ready_students: number;
  }>;
}

export interface SimulatorRequest {
  job_id?: number | null;
  role_category?: string;
  intervention_skill: string;
  expected_skill_improvement: number;
  department_filter?: string | null;
}

export interface SimulatorResponse {
  simulation_label: string;
  target_role_or_job: string;
  intervention_skill: string;
  expected_improvement_applied: number;
  total_evaluated_students: number;
  current_eligible_count: number;
  projected_eligible_count: number;
  potential_increase: number;
  current_average_readiness: number;
  projected_average_readiness: number;
  readiness_delta: number;
  skill_distribution: Array<{
    tier: string;
    current_count: number;
    projected_count: number;
  }>;
  department_breakdown: Array<{
    department: string;
    current_eligible: number;
    projected_eligible: number;
    increase: number;
  }>;
  explanation: string;
}
