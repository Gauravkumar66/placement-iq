import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  Button,
  Chip,
  LinearProgress,
  Checkbox,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  BookOpen,
  CheckCircle2,
  Calendar,
  Sparkles,
  ExternalLink,
  Target,
  ArrowRight,
  Flame,
  Clock,
  Layers,
} from 'lucide-react';
import { apiClient } from '../services/api/client';
import { APIResponse } from '../types/api';
import { LearningPlan, LearningModule } from '../types/student';
import { ResultDiagnosticModal } from '../components/ResultDiagnosticModal';

export const StudentPlanPage: React.FC = () => {
  const [plan, setPlan] = useState<LearningPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [completedDays, setCompletedDays] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('completed_sprint_days');
      return saved ? JSON.parse(saved) : { 'Day 1': true, 'Day 2': true };
    } catch {
      return { 'Day 1': true, 'Day 2': true };
    }
  });

  const [diagnosticOpen, setDiagnosticOpen] = useState(false);

  const fetchPlan = async () => {
    try {
      const res = await apiClient.get<APIResponse<LearningPlan>>('/students/plan');
      setPlan(res.data.data);
    } catch (err) {
      console.error('Error fetching plan:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, []);

  const toggleDayCompletion = (day: string) => {
    setCompletedDays((prev) => {
      const updated = { ...prev, [day]: !prev[day] };
      localStorage.setItem('completed_sprint_days', JSON.stringify(updated));
      return updated;
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  const modules = plan?.modules || [];
  const completedCount = modules.filter((m) => completedDays[m.day]).length;
  const progressPercent = modules.length > 0 ? Math.round((completedCount / modules.length) * 100) : 0;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Personalized 14-Day Preparation Sprint
          </Typography>
          <Typography variant="body1" color="text.secondary">
            AI-sequenced curriculum targeting your critical skill gaps for {plan?.target_role || 'Backend Developer'}.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Sparkles size={18} />}
          onClick={() => setDiagnosticOpen(true)}
          sx={{ borderRadius: 2 }}
        >
          Re-Analyze Interview Feedback
        </Button>
      </Box>

      {/* Sprint Progress Summary */}
      <Card sx={{ p: 3, borderRadius: 3, mb: 4, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={7}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <Flame size={24} color="#ed6c02" />
              <Typography variant="h6" fontWeight={800}>
                Sprint Trajectory: {completedCount} of {modules.length} Days Completed
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Target: Lift readiness from <strong>{plan?.current_readiness || 68}%</strong> to <strong>{plan?.target_readiness || 85}%</strong> before upcoming campus drives.
            </Typography>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  Sprint Completion
                </Typography>
                <Typography variant="caption" fontWeight={700}>
                  {progressPercent}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progressPercent}
                color="primary"
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: 'background.default',
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                justifyContent: 'space-around',
                textAlign: 'center',
              }}
            >
              <Box>
                <Typography variant="caption" color="text.secondary">
                  CURRENT FIT
                </Typography>
                <Typography variant="h5" fontWeight={800} color="warning.main">
                  {plan?.current_readiness || 68}%
                </Typography>
              </Box>
              <Divider orientation="vertical" flexItem />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  PROJECTED FIT
                </Typography>
                <Typography variant="h5" fontWeight={800} color="success.main">
                  {plan?.target_readiness || 85}%
                </Typography>
              </Box>
              <Divider orientation="vertical" flexItem />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  POTENTIAL LIFT
                </Typography>
                <Typography variant="h5" fontWeight={800} color="primary.main">
                  +17%
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* Week 1 Modules */}
      <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
        Week 1: Core Problem Solving & DSA Bottlenecks
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {modules.slice(0, 7).map((module) => {
          const isDone = completedDays[module.day];
          return (
            <Grid item xs={12} key={module.day}>
              <Card
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: isDone ? 'success.light' : 'divider',
                  bgcolor: isDone ? 'action.hover' : 'background.paper',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Checkbox
                    checked={Boolean(isDone)}
                    onChange={() => toggleDayCompletion(module.day)}
                    color="success"
                  />
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label={module.day} size="small" color={isDone ? 'success' : 'primary'} />
                      <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        sx={{ textDecoration: isDone ? 'line-through' : 'none' }}
                      >
                        {module.topic}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      Focus: <strong>{module.focus}</strong> • Closes Gap: {module.gap}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={isDone ? 'Completed' : 'Pending'}
                    size="small"
                    color={isDone ? 'success' : 'default'}
                    variant={isDone ? 'filled' : 'outlined'}
                  />
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Week 2 Modules */}
      <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
        Week 2: Backend Architecture & Production System Design
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {modules.slice(7).map((module) => {
          const isDone = completedDays[module.day];
          return (
            <Grid item xs={12} key={module.day}>
              <Card
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: isDone ? 'success.light' : 'divider',
                  bgcolor: isDone ? 'action.hover' : 'background.paper',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Checkbox
                    checked={Boolean(isDone)}
                    onChange={() => toggleDayCompletion(module.day)}
                    color="success"
                  />
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label={module.day} size="small" color={isDone ? 'success' : 'primary'} />
                      <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        sx={{ textDecoration: isDone ? 'line-through' : 'none' }}
                      >
                        {module.topic}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      Focus: <strong>{module.focus}</strong> • Closes Gap: {module.gap}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={isDone ? 'Completed' : 'Pending'}
                    size="small"
                    color={isDone ? 'success' : 'default'}
                    variant={isDone ? 'filled' : 'outlined'}
                  />
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Diagnostic Modal */}
      <ResultDiagnosticModal
        open={diagnosticOpen}
        onClose={() => setDiagnosticOpen(false)}
        onAnalysisComplete={() => {
          fetchPlan();
        }}
      />
    </Box>
  );
};
