import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  Button,
  Chip,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Divider,
  Alert,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Briefcase,
  Building,
  MapPin,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Bookmark,
  Share2,
} from 'lucide-react';
import { apiClient } from '../services/api/client';
import { APIResponse } from '../types/api';
import { JobRoleFit } from '../types/job';
import { ResultDiagnosticModal } from '../components/ResultDiagnosticModal';

export const StudentJobsPage: React.FC = () => {
  const [jobMatches, setJobMatches] = useState<JobRoleFit[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [appliedJobs, setAppliedJobs] = useState<Record<number, boolean>>({});
  const [savedJobs, setSavedJobs] = useState<Record<number, boolean>>({});

  // Result Diagnostic Modal
  const [diagnosticOpen, setDiagnosticOpen] = useState(false);
  const [selectedJobForDiagnostic, setSelectedJobForDiagnostic] = useState<JobRoleFit | null>(null);

  const fetchJobMatches = async () => {
    try {
      const res = await apiClient.get<APIResponse<JobRoleFit[]>>('/jobs/matches');
      setJobMatches(res.data.data || []);
    } catch (err) {
      console.error('Error fetching job matches:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobMatches();
  }, []);

  const handleApply = (jobId: number, title: string) => {
    setAppliedJobs((prev) => ({ ...prev, [jobId]: true }));
    alert(`Application submitted for ${title}! The recruiter has received your verified evidence dossier.`);
  };

  const handleToggleSave = (jobId: number) => {
    setSavedJobs((prev) => ({ ...prev, [jobId]: !prev[jobId] }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  const filteredMatches = jobMatches.filter((item) => {
    if (roleFilter === 'ALL') return true;
    return item.job.role_category.toLowerCase().includes(roleFilter.toLowerCase());
  });

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Job Matches & Role Eligibility
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Algorithmic role fit scores based on your verified skills, project complexity, and academic standing.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Sparkles size={18} />}
          onClick={() => {
            setSelectedJobForDiagnostic(null);
            setDiagnosticOpen(true);
          }}
          sx={{ borderRadius: 2 }}
        >
          Analyze Test / Interview Result
        </Button>
      </Box>

      {/* Filter and Summary Bar */}
      <Card sx={{ p: 2.5, borderRadius: 3, mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
        <Typography variant="subtitle2" fontWeight={700}>
          Filter by Track:
        </Typography>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Role Category</InputLabel>
          <Select value={roleFilter} label="Role Category" onChange={(e) => setRoleFilter(e.target.value)}>
            <MenuItem value="ALL">All Categories ({jobMatches.length})</MenuItem>
            <MenuItem value="Backend">Backend Engineering</MenuItem>
            <MenuItem value="Frontend">Frontend Engineering</MenuItem>
            <MenuItem value="Full Stack">Full Stack</MenuItem>
            <MenuItem value="Data">Data & AI</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
          <Chip label="Match Criteria: Skills (50%) + Projects (30%) + CGPA (20%)" size="small" variant="outlined" />
        </Box>
      </Card>

      {/* Job Cards List */}
      <Grid container spacing={3}>
        {filteredMatches.map((item) => {
          const { job, role_fit_score, category_fit, strong_matches, skill_gaps, explanation } = item;
          const isApplied = appliedJobs[job.id];
          const isSaved = savedJobs[job.id];

          return (
            <Grid item xs={12} key={job.id}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: role_fit_score >= 70 ? 'success.light' : 'divider',
                  transition: 'box-shadow 0.2s',
                  '&:hover': { boxShadow: 3 },
                }}
              >
                <Grid container spacing={3} alignItems="center">
                  {/* Left Column: Job Info */}
                  <Grid item xs={12} md={7}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                      <Box>
                        <Typography variant="h5" fontWeight={800}>
                          {job.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                            <Building size={16} />
                            <Typography variant="body2" fontWeight={600}>
                              {job.company_name || 'Tech Innovations'}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                            <MapPin size={16} />
                            <Typography variant="caption">{job.location || 'Bangalore, India'}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                            <DollarSign size={16} />
                            <Typography variant="caption" fontWeight={700} color="primary.main">
                              {job.salary_range}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ my: 1.5 }}>
                      {job.description}
                    </Typography>

                    {/* Skill Breakdown Chips */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Typography variant="caption" fontWeight={700} color="success.main">
                          MATCHING SKILLS:
                        </Typography>
                        {strong_matches.map((sk) => (
                          <Chip
                            key={sk}
                            label={sk}
                            size="small"
                            color="success"
                            variant="outlined"
                            icon={<CheckCircle size={12} />}
                            sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600 }}
                          />
                        ))}
                      </Box>

                      {skill_gaps.length > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          <Typography variant="caption" fontWeight={700} color="error.main">
                            SKILL DEFICITS:
                          </Typography>
                          {skill_gaps.map((sk) => (
                            <Chip
                              key={sk}
                              label={sk}
                              size="small"
                              color="error"
                              variant="outlined"
                              icon={<AlertCircle size={12} />}
                              sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600 }}
                            />
                          ))}
                        </Box>
                      )}
                    </Box>
                  </Grid>

                  {/* Right Column: Match Score & Action */}
                  <Grid item xs={12} md={5}>
                    <Box
                      sx={{
                        p: 2.5,
                        borderRadius: 3,
                        bgcolor: 'background.default',
                        border: '1px solid',
                        borderColor: 'divider',
                        textAlign: 'center',
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={700}>
                          AI ROLE FIT
                        </Typography>
                        <Chip
                          label={category_fit}
                          size="small"
                          color={role_fit_score >= 70 ? 'success' : 'warning'}
                          sx={{ fontWeight: 700, fontSize: '0.72rem' }}
                        />
                      </Box>

                      <Typography
                        variant="h3"
                        fontWeight={900}
                        color={role_fit_score >= 70 ? 'success.main' : 'warning.main'}
                      >
                        {role_fit_score}%
                      </Typography>

                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                        {explanation}
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Button
                          variant={isApplied ? 'outlined' : 'contained'}
                          color={isApplied ? 'inherit' : 'primary'}
                          disabled={isApplied}
                          startIcon={isApplied ? <CheckCircle size={16} /> : <Briefcase size={16} />}
                          onClick={() => handleApply(job.id, job.title)}
                          sx={{ flexGrow: 1 }}
                        >
                          {isApplied ? 'Application Sent' : '1-Click Apply'}
                        </Button>
                        <Button
                          variant="outlined"
                          color={isSaved ? 'primary' : 'inherit'}
                          onClick={() => handleToggleSave(job.id)}
                          sx={{ minWidth: 44, px: 1 }}
                        >
                          <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Result Diagnostic Modal */}
      <ResultDiagnosticModal
        open={diagnosticOpen}
        onClose={() => setDiagnosticOpen(false)}
        onAnalysisComplete={() => {
          fetchJobMatches();
        }}
      />
    </Box>
  );
};
