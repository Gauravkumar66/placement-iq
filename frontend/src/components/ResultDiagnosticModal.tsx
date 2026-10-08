import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  AlertTriangle,
  CheckCircle,
  Building,
  Target,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileQuestion,
  HelpCircle,
} from 'lucide-react';
import { apiClient } from '../services/api/client';
import { APIResponse } from '../types/api';
import { ResultAnalysisResponse } from '../types/resultAnalysis';

interface ResultDiagnosticModalProps {
  open: boolean;
  onClose: () => void;
  onAnalysisComplete?: () => void;
}

export const ResultDiagnosticModal: React.FC<ResultDiagnosticModalProps> = ({ open, onClose, onAnalysisComplete }) => {
  const [companyName, setCompanyName] = useState('Nexus Innovations');
  const [techField, setTechField] = useState('Backend Developer');
  const [stage, setStage] = useState('Technical Interview Round 1');
  const [verdict, setVerdict] = useState('REJECTED / NEEDS IMPROVEMENT');
  const [questionsFaced, setQuestionsFaced] = useState('');
  const [struggleAreas, setStruggleAreas] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFillSample = () => {
    setCompanyName('Nexus Innovations');
    setTechField('Backend Developer');
    setStage('Technical Interview Round 1');
    setVerdict('REJECTED / NEEDS IMPROVEMENT');
    setQuestionsFaced(
      'They asked me to solve Binary Tree Lowest Common Ancestor with DP caching, and then asked how to design a thread-safe cache with locks in Java. I got confused about time complexity and race conditions.'
    );
    setStruggleAreas(
      'Struggled to explain thread locks and race conditions under pressure. Could not reduce the tree recursion from O(N^2) to O(N).'
    );
    setNotes('Interviewer said my Java syntax was fine, but architectural and Big-O depth was lacking.');
  };

  const handleAnalyze = async () => {
    if (!companyName.trim() || !questionsFaced.trim()) {
      setError('Please provide at least the Company Name and Questions/Topics Faced.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await apiClient.post<APIResponse<ResultAnalysisResponse>>('/students/analyze-result', {
        company_name: companyName,
        tech_field: techField,
        stage,
        verdict,
        questions_faced: questionsFaced,
        struggle_areas: struggleAreas,
        notes,
      });
      setResult(res.data.data);
      onAnalysisComplete?.();
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to analyze result. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              display: 'flex',
            }}
          >
            <Target size={20} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Interview & Test Diagnostic Engine
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Upload evaluation feedback & questions to uncover exact missing skills
            </Typography>
          </Box>
        </Box>
        {!result && (
          <Button size="small" variant="text" onClick={handleFillSample} startIcon={<Sparkles size={14} />}>
            Auto-Fill Sample
          </Button>
        )}
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {!result ? (
          /* Input Form */
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, py: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Target Company Name"
                  fullWidth
                  size="small"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Nexus Innovations, Amazon, Google, TCS"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Tech Field / Role</InputLabel>
                  <Select
                    value={techField}
                    label="Tech Field / Role"
                    onChange={(e) => setTechField(e.target.value)}
                  >
                    <MenuItem value="Backend Developer">Backend Developer</MenuItem>
                    <MenuItem value="Frontend Developer">Frontend Developer</MenuItem>
                    <MenuItem value="Full Stack Developer">Full Stack Developer</MenuItem>
                    <MenuItem value="Data Science & ML">Data Science & ML</MenuItem>
                    <MenuItem value="DevOps & Cloud">DevOps & Cloud</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Interview / Test Stage</InputLabel>
                  <Select
                    value={stage}
                    label="Interview / Test Stage"
                    onChange={(e) => setStage(e.target.value)}
                  >
                    <MenuItem value="Online Coding Assessment">Online Coding Assessment</MenuItem>
                    <MenuItem value="Technical Interview Round 1">Technical Interview Round 1</MenuItem>
                    <MenuItem value="Technical Interview Round 2 (Deep Dive)">Technical Interview Round 2 (Deep Dive)</MenuItem>
                    <MenuItem value="System Architecture & Design">System Architecture & Design</MenuItem>
                    <MenuItem value="Final Technical & Managerial Round">Final Technical & Managerial Round</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Evaluation Verdict</InputLabel>
                  <Select
                    value={verdict}
                    label="Evaluation Verdict"
                    onChange={(e) => setVerdict(e.target.value)}
                  >
                    <MenuItem value="REJECTED / NEEDS IMPROVEMENT">Rejected / Needs Improvement</MenuItem>
                    <MenuItem value="BORDERLINE / WAITLISTED">Borderline / Waitlisted</MenuItem>
                    <MenuItem value="PASSED WITH CONCERNS">Passed with Concerns</MenuItem>
                    <MenuItem value="DIAGNOSTIC PRACTICE TEST">Diagnostic Practice Test</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                Questions & Topics Faced
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                size="small"
                value={questionsFaced}
                onChange={(e) => setQuestionsFaced(e.target.value)}
                placeholder="Paste the technical questions asked, coding problems, framework topics, or SQL queries that came up..."
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                Where Did You Struggle or Feel Blocked? (Optional)
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={2}
                size="small"
                value={struggleAreas}
                onChange={(e) => setStruggleAreas(e.target.value)}
                placeholder="e.g. Could not optimize to O(N), forgot index execution order, got nervous when asked about thread safety..."
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                Interviewer Feedback or Notes (Optional)
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any direct feedback mentioned by the recruiter or interviewer..."
              />
            </Box>
          </Box>
        ) : (
          /* Structured Diagnostic Results View */
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 1 }}>
            {/* Header Summary */}
            <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Diagnostic Report: {result.company_name}
                </Typography>
                <Chip
                  label={`${result.overall_gap_severity} SEVERITY DEFICITS`}
                  color={result.overall_gap_severity === 'HIGH' ? 'error' : 'warning'}
                  size="small"
                  sx={{ fontWeight: 800 }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                {result.analysis_summary}
              </Typography>
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                <strong>{result.company_name} Hiring Bar:</strong> {result.company_hiring_bar_summary}
              </Alert>
            </Box>

            {/* Identified Lacking Skills */}
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1.5 }}>
                EXACT LACKING SKILLS & CRITICAL GAPS
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {result.lacking_skills.map((s, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      p: 2,
                      borderRadius: 2.5,
                      border: '1.5px solid',
                      borderColor: s.severity === 'CRITICAL_BLOCKER' ? 'error.light' : 'warning.light',
                      bgcolor: 'background.paper',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                        {s.skill_name}
                      </Typography>
                      <Chip
                        label={s.severity === 'CRITICAL_BLOCKER' ? '🚨 Critical Blocker' : '⚠️ Moderate Gap'}
                        color={s.severity === 'CRITICAL_BLOCKER' ? 'error' : 'warning'}
                        size="small"
                        sx={{ fontWeight: 700 }}
                      />
                    </Box>

                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.8 }}>
                      <strong>Your Performance:</strong> {s.current_demonstrated_level} <br />
                      <strong>Company Standard:</strong> {s.company_benchmark_level}
                    </Typography>

                    <Box sx={{ p: 1.2, borderRadius: 1.5, bgcolor: 'background.default', mb: 1 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary', display: 'block' }}>
                        💡 Why it mattered in this evaluation:
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {s.why_it_matters}
                      </Typography>
                    </Box>

                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main', display: 'block' }}>
                      👉 Corrective Action: {s.recommended_action}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Strengths Identified */}
            <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'background.default' }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'success.main', display: 'block', mb: 0.5 }}>
                ✓ STRENGTHS DEMONSTRATED
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                {result.strengths_identified.map((str, idx) => (
                  <Chip key={idx} label={`✓ ${str}`} size="small" color="success" variant="outlined" sx={{ fontWeight: 600 }} />
                ))}
              </Box>
            </Box>

            {/* 7-Day Targeted Recovery Roadmap */}
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1.5 }}>
                7-DAY RECOVERY ROADMAP
              </Typography>
              <Grid container spacing={1.5}>
                {result.recovery_roadmap.map((m, idx) => (
                  <Grid item xs={12} sm={6} key={idx}>
                    <Box sx={{ p: 1.8, borderRadius: 2, border: '1px solid', borderColor: 'divider', bgcolor: 'background.default' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Chip label={m.day} size="small" color="primary" sx={{ height: 20, fontSize: '0.68rem', fontWeight: 700 }} />
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>
                          {m.focus}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {m.action}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Impact Projection */}
            <Alert severity="success" sx={{ borderRadius: 2 }}>
              <strong>Estimated Readiness Lift:</strong> {result.estimated_readiness_impact}
            </Alert>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        {result ? (
          <>
            <Button onClick={handleReset} variant="outlined">
              Diagnose Another Result
            </Button>
            <Button onClick={onClose} variant="contained">
              Save to My Learning Plan & Close
            </Button>
          </>
        ) : (
          <>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              onClick={handleAnalyze}
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} /> : <Sparkles size={16} />}
            >
              {loading ? 'Analyzing Feedback...' : 'Analyze Deficiencies & Gaps'}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};
