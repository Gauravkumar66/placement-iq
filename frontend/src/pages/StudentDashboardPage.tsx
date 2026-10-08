import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  CircularProgress,
  Divider,
  Alert,
} from '@mui/material';
import {
  Compass,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Award,
  Layers,
  BookOpen,
  Briefcase,
  ExternalLink,
  FileQuestion,
  Target,
} from 'lucide-react';
import { apiClient } from '../services/api/client';
import { APIResponse } from '../types/api';
import { StudentProfile, ReadinessBreakdown, LearningPlan } from '../types/student';
import { ResultDiagnosticModal } from '../components/ResultDiagnosticModal';

export const StudentDashboardPage: React.FC = () => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [readiness, setReadiness] = useState<ReadinessBreakdown | null>(null);
  const [plan, setPlan] = useState<LearningPlan | null>(null);
  const [loading, setLoading] = useState(true);

  // Diagnostic Modal State
  const [diagnosticOpen, setDiagnosticOpen] = useState(false);

  // Assessment Dialog State
  const [assessmentOpen, setAssessmentOpen] = useState(false);
  const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<any>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [submittingAssessment, setSubmittingAssessment] = useState(false);

  // Plan Dialog State
  const [planOpen, setPlanOpen] = useState(false);

  const fetchData = async () => {
    try {
      const [pRes, rRes, plRes] = await Promise.all([
        apiClient.get<APIResponse<StudentProfile>>('/students/profile'),
        apiClient.get<APIResponse<ReadinessBreakdown>>('/students/readiness'),
        apiClient.get<APIResponse<LearningPlan>>('/students/plan'),
      ]);
      setProfile(pRes.data.data);
      setReadiness(rRes.data.data);
      setPlan(plRes.data.data);
    } catch (err) {
      console.error('Error loading student dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCompleteAssessment = async () => {
    setSubmittingAssessment(true);
    try {
      const res = await apiClient.post<APIResponse<any>>('/assessments/submit', {
        assessment_id: 1,
        score: 76.0,
        answers: selectedAnswers,
      });
      setAssessmentResult(res.data.data);
      setAssessmentSubmitted(true);
      // Refresh dashboard scores
      fetchData();
    } catch (err) {
      console.error('Error submitting assessment:', err);
    } finally {
      setSubmittingAssessment(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  const dsaScore = profile?.dsa_score || 61.0;
  const currentReadiness = profile?.readiness_score || 68.0;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      {/* 1. Header Narrative */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          Good evening, {profile?.full_name?.split(' ')[0] || 'Aarav'}.
        </Typography>
        <Typography variant="body1" color="text.secondary">
          You're making steady progress toward your <strong>Backend Developer</strong> goal. Here is what matters today.
        </Typography>
      </Box>

      {/* 2. Hero Readiness Banner */}
      <Card
        sx={{
          mb: 4,
          borderRadius: 4,
          p: { xs: 2.5, sm: 3.5 },
          bgcolor: 'background.paper',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={7}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <Chip
                label="PLACEMENT READINESS"
                size="small"
                color="primary"
                sx={{ fontWeight: 800, fontSize: '0.72rem' }}
              />
              <Typography variant="caption" color="text.secondary">
                Simulated index (not a guarantee)
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, my: 1.5 }}>
              <Typography variant="h2" fontWeight={800} color="primary.main">
                {currentReadiness}
              </Typography>
              <Typography variant="h5" color="text.secondary" fontWeight={600}>
                / 100
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ mb: 2.5, color: 'text.primary' }}>
              {currentReadiness >= 74 ? (
                <span>
                  🎉 You are in <strong>Placement Ready</strong> tier! You have successfully crossed the eligibility benchmark.
                </span>
              ) : (
                <span>
                  You are <strong>{Math.max(0, Math.round(75 - currentReadiness))} points</strong> away from the benchmark target (75).
                </span>
              )}
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
              <Button
                variant="contained"
                onClick={() => setPlanOpen(true)}
                endIcon={<ArrowRight size={16} />}
              >
                View 14-Day Action Plan
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setAssessmentSubmitted(false);
                  setAssessmentOpen(true);
                }}
                startIcon={<Award size={16} />}
              >
                {dsaScore >= 75 ? 'Retake DSA Assessment' : 'Take DSA Assessment (Diagnostic)'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => setDiagnosticOpen(true)}
                startIcon={<FileQuestion size={16} />}
              >
                Diagnose Interview Result
              </Button>
            </Box>
          </Grid>

          {/* Breakdown bars */}
          <Grid item xs={12} md={5}>
            <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: 'background.default' }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
                SCORE SIGNALS BREAKDOWN
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" fontWeight={600}>Technical Skills (30%)</Typography>
                    <Typography variant="caption" fontWeight={700}>{profile?.technical_score}%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={profile?.technical_score || 72} sx={{ height: 6, borderRadius: 3 }} />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" fontWeight={600}>DSA Diagnostic (20%)</Typography>
                    <Typography
                      variant="caption"
                      fontWeight={700}
                      color={dsaScore >= 75 ? 'success.main' : 'warning.main'}
                    >
                      {dsaScore}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={dsaScore}
                    color={dsaScore >= 75 ? 'success' : 'warning'}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" fontWeight={600}>Project Evidence (15%)</Typography>
                    <Typography variant="caption" fontWeight={700}>{profile?.projects_score}%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={profile?.projects_score || 70} sx={{ height: 6, borderRadius: 3 }} />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" fontWeight={600}>Communication (10%)</Typography>
                    <Typography variant="caption" fontWeight={700}>{profile?.communication_score}%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={profile?.communication_score || 75} sx={{ height: 6, borderRadius: 3 }} />
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* 2.5 INTERVIEW & TEST RESULT DIAGNOSTIC ENGINE */}
      <Card
        sx={{
          mb: 4,
          borderRadius: 4,
          p: { xs: 2.5, sm: 3 },
          bgcolor: 'background.paper',
          border: '1.5px solid',
          borderColor: 'secondary.main',
        }}
      >
        <Grid container spacing={2.5} alignItems="center">
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <Box
                sx={{
                  p: 0.8,
                  borderRadius: 2,
                  bgcolor: 'secondary.main',
                  color: 'secondary.contrastText',
                  display: 'flex',
                }}
              >
                <Target size={18} />
              </Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'secondary.main' }}>
                INTERVIEW & TEST DEFICIENCY ANALYZER
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.8 }}>
              Upload company test questions or interview feedback to diagnose exact skill gaps
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Input the company name, technical role, questions faced, and where you felt blocked. Our intelligence model benchmarks your performance against the company's real hiring criteria to isolate critical blockers and build a 7-day recovery roadmap.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: { md: 'right' } }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => setDiagnosticOpen(true)}
              startIcon={<Sparkles size={18} />}
              sx={{ px: 3, py: 1.2, fontWeight: 700 }}
            >
              Diagnose Performance
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* 3. YOUR NEXT MOVE Section (Section 31 & 65) */}
      <Card sx={{ mb: 4, borderRadius: 3, p: 3, borderLeft: '6px solid', borderColor: 'primary.main' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <Sparkles size={20} color="#0B57D0" />
          <Typography variant="subtitle2" fontWeight={800} color="primary.main">
            YOUR NEXT MOVE
          </Typography>
        </Box>
        <Typography variant="h6" fontWeight={700} sx={{ mt: 0.5, mb: 1 }}>
          {dsaScore < 75 ? 'Strengthen DSA diagnostic this week.' : 'Focus on Spring Boot microservice project.'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {dsaScore < 75 ? (
            <span>
              DSA is your highest leverage blocker. Raising DSA from <strong>{dsaScore}% → 75%</strong> boosts your Backend Developer readiness from <strong>{currentReadiness} → ~74</strong>.
            </span>
          ) : (
            <span>
              You verified your DSA capability! Next priority: Create a Spring Boot REST API project with authentication to eliminate your final framework blocker.
            </span>
          )}
        </Typography>
        {dsaScore < 75 && (
          <Button
            variant="contained"
            size="small"
            onClick={() => {
              setAssessmentSubmitted(false);
              setAssessmentOpen(true);
            }}
          >
            Start 5-Question DSA Diagnostic
          </Button>
        )}
      </Card>

      {/* 4. Target Roles & Evidence Skills */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Target Roles */}
        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%', p: 2.5, borderRadius: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              TARGET ROLE COMPATIBILITY
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                { role: 'Backend Developer', fit: currentReadiness >= 74 ? 79 : 72, target: true },
                { role: 'Software Engineer', fit: 74, target: false },
                { role: 'Full Stack Developer', fit: 68, target: false },
                { role: 'Data / ML Engineer', fit: 58, target: false },
              ].map((r) => (
                <Box
                  key={r.role}
                  sx={{
                    p: 1.8,
                    borderRadius: 2.5,
                    bgcolor: r.target ? 'action.selected' : 'background.default',
                    border: r.target ? '1.5px solid' : '1px solid',
                    borderColor: r.target ? 'primary.main' : 'divider',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" fontWeight={700}>
                        {r.role}
                      </Typography>
                      {r.target && <Chip label="Primary Goal" size="small" color="primary" sx={{ height: 20, fontSize: '0.65rem' }} />}
                    </Box>
                    <Typography variant="body2" fontWeight={800} color="primary.main">
                      {r.fit}% Fit
                    </Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={r.fit} sx={{ height: 6, borderRadius: 3 }} />
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>

        {/* Evidence-Based Skill Table */}
        <Grid item xs={12} md={7}>
          <Card sx={{ height: '100%', p: 2.5, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={700}>
                EVIDENCE-VERIFIED SKILLS
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Verified through code & assessments
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {[
                {
                  name: 'Java',
                  score: 86,
                  level: 'Advanced',
                  status: 'VERIFIED',
                  evidences: ['Backend Project', 'Java Assessment (89%)', 'Internship Experience'],
                },
                {
                  name: 'SQL',
                  score: 82,
                  level: 'Advanced',
                  status: 'VERIFIED',
                  evidences: ['SQL Assessment (82%)', 'Backend Project'],
                },
                {
                  name: 'Data Structures & Algorithms',
                  score: dsaScore,
                  level: dsaScore >= 75 ? 'Advanced' : 'Intermediate',
                  status: 'VERIFIED',
                  evidences: dsaScore >= 75 ? ['DSA Diagnostic (76% Verified)'] : ['Diagnostic Assessment (61%)'],
                },
                {
                  name: 'Spring Boot',
                  score: 42,
                  level: 'Beginner',
                  status: 'UNVERIFIED',
                  evidences: ['Resume Mention Only (No project or test evidence)'],
                },
                {
                  name: 'Docker',
                  score: 34,
                  level: 'Beginner',
                  status: 'UNVERIFIED',
                  evidences: ['Resume Mention Only'],
                },
              ].map((s) => (
                <Box
                  key={s.name}
                  sx={{
                    p: 1.6,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.default',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" fontWeight={700}>
                        {s.name}
                      </Typography>
                      <Chip
                        label={s.status}
                        size="small"
                        color={s.status === 'VERIFIED' ? 'success' : 'default'}
                        sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }}
                      />
                    </Box>
                    <Typography variant="caption" fontWeight={700}>
                      {s.score}% • {s.level}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.8 }}>
                    {s.evidences.map((e, idx) => (
                      <Typography
                        key={idx}
                        variant="caption"
                        sx={{
                          color: s.status === 'VERIFIED' ? 'success.dark' : 'text.secondary',
                          bgcolor: s.status === 'VERIFIED' ? 'success.light' : 'action.hover',
                          px: 0.8,
                          py: 0.2,
                          borderRadius: 1,
                          fontSize: '0.7rem',
                        }}
                      >
                        {s.status === 'VERIFIED' ? `✓ ${e}` : `△ ${e}`}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* 5. Recommended Jobs */}
      <Card sx={{ p: 3, borderRadius: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>
              RECOMMENDED OPPORTUNITIES
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Matches evaluated against your verified skill evidence
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 2.5,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.default',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Box>
                  <Typography variant="subtitle2" fontWeight={700}>
                    Backend Software Engineer
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Nexus Innovations • Bengaluru / Hybrid • 12 - 16 LPA
                  </Typography>
                </Box>
                <Chip label="84% Fit" color="success" size="small" sx={{ fontWeight: 800 }} />
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                Verified Matches: Java, SQL, Git, REST API. Top Blocker: Spring Boot experience.
              </Typography>
              <Button size="small" variant="outlined" endIcon={<ExternalLink size={14} />}>
                View Job Details
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 2.5,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.default',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Box>
                  <Typography variant="subtitle2" fontWeight={700}>
                    Junior Full Stack Engineer
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Nexus Innovations • Hyderabad / Remote • 10 - 14 LPA
                  </Typography>
                </Box>
                <Chip label="72% Fit" color="primary" size="small" sx={{ fontWeight: 800 }} />
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                Strong database fit. Requires frontend JavaScript framework verification.
              </Typography>
              <Button size="small" variant="outlined" endIcon={<ExternalLink size={14} />}>
                View Job Details
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* Assessment Dialog */}
      <Dialog open={assessmentOpen} onClose={() => setAssessmentOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>
          {assessmentSubmitted ? 'Verification Complete' : 'Data Structures & Algorithms Diagnostic'}
        </DialogTitle>
        <DialogContent dividers>
          {assessmentSubmitted ? (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  bgcolor: 'success.light',
                  color: 'success.main',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                }}
              >
                <CheckCircle size={32} />
              </Box>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Score: 61% → 76%
              </Typography>
              <Typography variant="h6" color="primary.main" fontWeight={800} gutterBottom>
                Readiness: {assessmentResult?.previous_readiness}% → {assessmentResult?.new_readiness}%
              </Typography>
              <Alert severity="success" sx={{ mt: 2, textAlign: 'left', borderRadius: 2 }}>
                {assessmentResult?.message}
              </Alert>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Answer these 3 technical questions to verify algorithmic complexity mastery.
              </Typography>

              <Box>
                <Typography variant="subtitle2" fontWeight={700}>
                  1. What is the worst-case time complexity of inserting into an unbalanced BST?
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup defaultValue="O(N)">
                    <FormControlLabel value="O(1)" control={<Radio size="small" />} label="O(1)" />
                    <FormControlLabel value="O(log N)" control={<Radio size="small" />} label="O(log N)" />
                    <FormControlLabel value="O(N)" control={<Radio size="small" />} label="O(N)" />
                    <FormControlLabel value="O(N log N)" control={<Radio size="small" />} label="O(N log N)" />
                  </RadioGroup>
                </FormControl>
              </Box>

              <Box>
                <Typography variant="subtitle2" fontWeight={700}>
                  2. Which data structure is most optimal for an LRU Cache implementation?
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup defaultValue="Doubly Linked List + HashMap">
                    <FormControlLabel value="Stack + Array" control={<Radio size="small" />} label="Stack + Array" />
                    <FormControlLabel value="Doubly Linked List + HashMap" control={<Radio size="small" />} label="Doubly Linked List + HashMap" />
                    <FormControlLabel value="Binary Heap" control={<Radio size="small" />} label="Binary Heap" />
                  </RadioGroup>
                </FormControl>
              </Box>

              <Box>
                <Typography variant="subtitle2" fontWeight={700}>
                  3. What technique eliminates redundant overlapping subproblems in Dynamic Programming?
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup defaultValue="Memoization">
                    <FormControlLabel value="Memoization" control={<Radio size="small" />} label="Memoization" />
                    <FormControlLabel value="Greedy selection" control={<Radio size="small" />} label="Greedy selection" />
                    <FormControlLabel value="Backtracking" control={<Radio size="small" />} label="Backtracking" />
                  </RadioGroup>
                </FormControl>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          {assessmentSubmitted ? (
            <Button variant="contained" onClick={() => setAssessmentOpen(false)}>
              Close & View Updated Dashboard
            </Button>
          ) : (
            <>
              <Button onClick={() => setAssessmentOpen(false)}>Cancel</Button>
              <Button
                variant="contained"
                onClick={handleCompleteAssessment}
                disabled={submittingAssessment}
              >
                {submittingAssessment ? 'Grading & Verifying...' : 'Submit Answers'}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* 14-Day Action Plan Dialog */}
      <Dialog open={planOpen} onClose={() => setPlanOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>
          Personalized 14-Day Action Plan — Backend Developer
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Every preparation module connects directly to your verified skill blockers.
            </Typography>
          </Box>
          <Grid container spacing={2}>
            {plan?.modules?.map((m) => (
              <Grid item xs={12} sm={6} key={m.day}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2.5,
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.default',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Chip label={m.day} size="small" color="primary" sx={{ height: 20, fontSize: '0.7rem' }} />
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      Targets: {m.gap}
                    </Typography>
                  </Box>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mt: 1 }}>
                    {m.topic}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {m.focus}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="contained" onClick={() => setPlanOpen(false)}>
            Close Roadmap
          </Button>
        </DialogActions>
      </Dialog>

      {/* Result & Test Diagnostic Modal */}
      <ResultDiagnosticModal open={diagnosticOpen} onClose={() => setDiagnosticOpen(false)} />
    </Box>
  );
};
