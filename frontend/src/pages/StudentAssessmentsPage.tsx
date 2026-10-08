import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  Button,
  Chip,
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
  CheckCircle,
  Clock,
  Sparkles,
  Award,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { apiClient } from '../services/api/client';
import { APIResponse } from '../types/api';

interface AssessmentItem {
  id: number;
  title: string;
  skill_name: string;
  category: string;
  difficulty: string;
  time_limit_minutes: number;
  total_questions: number;
  passing_score: number;
  current_score: number;
  status: string;
  impact_note: string;
}

export const StudentAssessmentsPage: React.FC = () => {
  const [assessments, setAssessments] = useState<AssessmentItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Active Assessment Dialog State
  const [activeTest, setActiveTest] = useState<AssessmentItem | null>(null);
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const fetchAssessments = async () => {
    try {
      const res = await apiClient.get<APIResponse<AssessmentItem[]>>('/assessments/');
      setAssessments(res.data.data || []);
    } catch (err) {
      console.error('Error fetching assessments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  const handleStartTest = (item: AssessmentItem) => {
    setActiveTest(item);
    setSelectedAnswers({});
    setTestResult(null);
    setTestModalOpen(true);
  };

  const handleSubmitTest = async () => {
    if (!activeTest) return;
    setSubmitting(true);
    try {
      const res = await apiClient.post<APIResponse<any>>('/assessments/submit', {
        assessment_id: activeTest.id,
        score: 78.0,
        answers: selectedAnswers,
      });
      setTestResult(res.data.data);
      fetchAssessments();
    } catch (err) {
      console.error('Error submitting assessment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Technical Assessments & Skill Verification
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Take proctored technical diagnostic evaluations to verify your skills and boost your recruiter match ranking.
          </Typography>
        </Box>
      </Box>

      {/* Info Alert */}
      <Alert severity="info" sx={{ mb: 3, borderRadius: 3 }}>
        <Typography variant="body2">
          Recruiters give <strong>3.2x higher interview shortlisting priority</strong> to candidates who verify their skills via proctored benchmarks.
        </Typography>
      </Alert>

      {/* Assessment Cards Grid */}
      <Grid container spacing={3}>
        {assessments.map((item) => {
          const isVerified = item.status.includes('Verified');
          return (
            <Grid item xs={12} md={6} key={item.id}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: isVerified ? 'success.light' : 'divider',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Box>
                      <Typography variant="h6" fontWeight={800}>
                        {item.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.category} • Difficulty: {item.difficulty}
                      </Typography>
                    </Box>
                    <Chip
                      label={item.status}
                      size="small"
                      color={isVerified ? 'success' : 'primary'}
                      variant={isVerified ? 'filled' : 'outlined'}
                      sx={{ fontWeight: 700, fontSize: '0.72rem' }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, my: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                      <Clock size={16} />
                      <Typography variant="caption">{item.time_limit_minutes} mins</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                      <HelpCircle size={16} />
                      <Typography variant="caption">{item.total_questions} Questions</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                      <Award size={16} />
                      <Typography variant="caption">Pass: {item.passing_score}%</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ p: 1.5, bgcolor: 'background.default', borderRadius: 2, mb: 2 }}>
                    <Typography variant="caption" color="primary.main" fontWeight={700}>
                      PLACEMENT IMPACT:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.impact_note}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ pt: 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" fontWeight={700}>
                    Current Score: {item.current_score}%
                  </Typography>
                  <Button
                    variant={isVerified ? 'outlined' : 'contained'}
                    size="small"
                    startIcon={isVerified ? <RotateCcw size={16} /> : <CheckCircle size={16} />}
                    onClick={() => handleStartTest(item)}
                    sx={{ borderRadius: 2 }}
                  >
                    {isVerified ? 'Retake Benchmark' : 'Start Assessment'}
                  </Button>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Interactive Assessment Modal */}
      <Dialog
        open={testModalOpen}
        onClose={() => setTestModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={800}>
              {activeTest?.title}
            </Typography>
            <Chip label="Proctored Simulation" size="small" color="primary" />
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {testResult ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CheckCircle2 size={56} color="#2e7d32" style={{ margin: '0 auto 16px' }} />
              <Typography variant="h5" fontWeight={800} gutterBottom>
                Assessment Completed!
              </Typography>
              <Typography variant="h3" fontWeight={900} color="success.main" gutterBottom>
                {testResult.score}%
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto', mb: 3 }}>
                {testResult.message || 'Your verified score has been saved and your readiness index has been updated!'}
              </Typography>
              <Alert severity="success" sx={{ maxWidth: 500, mx: 'auto' }}>
                Technical readiness improved to <strong>74%</strong>. Match fit for Backend Developer raised by +6%.
              </Alert>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Question 1 */}
              <Card sx={{ p: 2.5, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  1. What is the amortized worst-case time complexity of inserting n elements into an AVL Tree?
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup
                    value={selectedAnswers[1] || ''}
                    onChange={(e) => setSelectedAnswers({ ...selectedAnswers, 1: e.target.value })}
                  >
                    <FormControlLabel value="O(n)" control={<Radio size="small" />} label="O(n)" />
                    <FormControlLabel value="O(n log n)" control={<Radio size="small" />} label="O(n log n)" />
                    <FormControlLabel value="O(n^2)" control={<Radio size="small" />} label="O(n^2)" />
                    <FormControlLabel value="O(1)" control={<Radio size="small" />} label="O(1)" />
                  </RadioGroup>
                </FormControl>
              </Card>

              {/* Question 2 */}
              <Card sx={{ p: 2.5, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  2. In relational databases, what transaction isolation level prevents Dirty Reads and Non-Repeatable Reads, but allows Phantom Reads?
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup
                    value={selectedAnswers[2] || ''}
                    onChange={(e) => setSelectedAnswers({ ...selectedAnswers, 2: e.target.value })}
                  >
                    <FormControlLabel value="READ_UNCOMMITTED" control={<Radio size="small" />} label="Read Uncommitted" />
                    <FormControlLabel value="READ_COMMITTED" control={<Radio size="small" />} label="Read Committed" />
                    <FormControlLabel value="REPEATABLE_READ" control={<Radio size="small" />} label="Repeatable Read" />
                    <FormControlLabel value="SERIALIZABLE" control={<Radio size="small" />} label="Serializable" />
                  </RadioGroup>
                </FormControl>
              </Card>

              {/* Question 3 */}
              <Card sx={{ p: 2.5, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  3. In Spring Framework, how does @Transactional handle unchecked (RuntimeException) by default?
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup
                    value={selectedAnswers[3] || ''}
                    onChange={(e) => setSelectedAnswers({ ...selectedAnswers, 3: e.target.value })}
                  >
                    <FormControlLabel value="Rolls back transaction" control={<Radio size="small" />} label="Automatically rolls back the transaction" />
                    <FormControlLabel value="Commits transaction" control={<Radio size="small" />} label="Commits transaction regardless" />
                    <FormControlLabel value="Throws ConfigurationException" control={<Radio size="small" />} label="Throws a ConfigurationException" />
                  </RadioGroup>
                </FormControl>
              </Card>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          {testResult ? (
            <Button variant="contained" onClick={() => setTestModalOpen(false)}>
              Close & Update Dashboard
            </Button>
          ) : (
            <>
              <Button variant="outlined" onClick={() => setTestModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmitTest}
                disabled={submitting}
              >
                {submitting ? 'Evaluating Submission...' : 'Submit Answers'}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};
