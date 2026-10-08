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
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Building,
  Users,
  CheckCircle,
  Briefcase,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Code2,
} from 'lucide-react';
import { apiClient } from '../services/api/client';
import { APIResponse } from '../types/api';
import { MatchedCandidate, RecruiterOverview } from '../types/recruiter';

export const RecruiterDashboardPage: React.FC = () => {
  const [overview, setOverview] = useState<RecruiterOverview | null>(null);
  const [candidates, setCandidates] = useState<MatchedCandidate[]>([]);
  const [loading, setLoading] = useState(true);

  // Candidate detail dialog
  const [selectedCandidate, setSelectedCandidate] = useState<MatchedCandidate | null>(null);
  const [shortlistedMap, setShortlistedMap] = useState<Record<number, boolean>>({});

  const fetchData = async () => {
    try {
      const [oRes, cRes] = await Promise.all([
        apiClient.get<APIResponse<RecruiterOverview>>('/recruiters/overview'),
        apiClient.get<APIResponse<MatchedCandidate[]>>('/recruiters/candidates'),
      ]);
      setOverview(oRes.data.data);
      setCandidates(cRes.data.data);
    } catch (err) {
      console.error('Error loading recruiter dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleShortlist = (id: number) => {
    setShortlistedMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  const metrics = overview?.metrics;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      {/* 1. Header Narrative */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          Find candidates based on evidence, not keywords.
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Nexus Innovations • Talent Discovery & Verified Skill Pipeline
        </Typography>
      </Box>

      {/* 2. Top Metrics */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={3}>
          <Card sx={{ p: 2.5, borderRadius: 3 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              OPEN ROLES
            </Typography>
            <Typography variant="h3" fontWeight={800} color="primary.main" sx={{ my: 0.5 }}>
              {metrics?.open_jobs || 3}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Active engineering drives
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ p: 2.5, borderRadius: 3 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              EVIDENCE MATCHES
            </Typography>
            <Typography variant="h3" fontWeight={800} color="text.primary" sx={{ my: 0.5 }}>
              {metrics?.matched_candidates || 142}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Across all departments
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ p: 2.5, borderRadius: 3, borderLeft: '4px solid', borderColor: 'success.main' }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              SHORTLISTED
            </Typography>
            <Typography variant="h3" fontWeight={800} color="success.main" sx={{ my: 0.5 }}>
              {(metrics?.shortlisted || 28) + Object.values(shortlistedMap).filter(Boolean).length}
            </Typography>
            <Typography variant="caption" color="success.main" fontWeight={600}>
              Ready for technical round
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ p: 2.5, borderRadius: 3 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              IN ASSESSMENT
            </Typography>
            <Typography variant="h3" fontWeight={800} color="secondary.main" sx={{ my: 0.5 }}>
              {metrics?.interviewing || 8}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Live coding & interviews
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* 3. Pipeline Stages Banner */}
      <Card sx={{ p: 2.5, borderRadius: 3, mb: 4 }}>
        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
          RECRUITMENT FUNNEL STAGES
        </Typography>
        <Grid container spacing={2}>
          {overview?.pipeline?.map((p, idx) => (
            <Grid item xs={6} sm={2.4} key={p.stage}>
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'background.default', textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} noWrap sx={{ display: 'block' }}>
                  {p.stage}
                </Typography>
                <Typography variant="h5" fontWeight={800} color="primary.main" sx={{ mt: 0.5 }}>
                  {p.count}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Card>

      {/* 4. Candidate Matches with Mandatory Explainability */}
      <Card sx={{ p: 3, borderRadius: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>
              TOP MATCHED CANDIDATES FOR BACKEND SOFTWARE ENGINEER
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ranked by verified skills, code repositories, and diagnostic assessments
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {candidates.map((c) => {
            const isShortlisted = shortlistedMap[c.id] || c.status === 'SHORTLISTED';
            return (
              <Box
                key={c.id}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  border: '1.5px solid',
                  borderColor: isShortlisted ? 'success.main' : 'divider',
                  bgcolor: 'background.default',
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={8}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                      <Typography variant="h6" fontWeight={800}>
                        {c.full_name}
                      </Typography>
                      <Chip
                        label={`${c.role_fit_score}% Role Fit`}
                        color={c.role_fit_score >= 85 ? 'success' : 'primary'}
                        size="small"
                        sx={{ fontWeight: 800 }}
                      />
                      {isShortlisted && (
                        <Chip
                          label="Shortlisted"
                          color="success"
                          variant="outlined"
                          size="small"
                          sx={{ fontWeight: 700 }}
                        />
                      )}
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                      {c.department} • Batch {c.graduation_year} • {c.academic_fit}
                    </Typography>

                    {/* MANDATORY EXPLAINABILITY BOX (Section 23) */}
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="caption" fontWeight={800} color="primary.main" sx={{ display: 'block', mb: 0.8 }}>
                        WHY THIS CANDIDATE?
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.4 }}>
                        {c.why_this_candidate?.map((w, idx) => (
                          <Typography
                            key={idx}
                            variant="caption"
                            sx={{
                              color: w.type === 'positive' ? 'success.dark' : 'text.secondary',
                              fontWeight: w.type === 'positive' ? 600 : 400,
                            }}
                          >
                            {w.type === 'positive' ? `✓ ${w.text}` : `△ ${w.text}`}
                          </Typography>
                        ))}
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={4} sx={{ textAlign: { sm: 'right' } }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: { sm: 'flex-end' } }}>
                      <Button
                        variant={isShortlisted ? 'outlined' : 'contained'}
                        color={isShortlisted ? 'inherit' : 'primary'}
                        size="small"
                        onClick={() => handleToggleShortlist(c.id)}
                        startIcon={isShortlisted ? <CheckCircle size={16} /> : undefined}
                      >
                        {isShortlisted ? 'Shortlisted' : 'Shortlist Candidate'}
                      </Button>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => setSelectedCandidate(c)}
                        endIcon={<ChevronRight size={16} />}
                      >
                        Inspect Evidence Details
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            );
          })}
        </Box>
      </Card>

      {/* Candidate Evidence Modal */}
      <Dialog
        open={Boolean(selectedCandidate)}
        onClose={() => setSelectedCandidate(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          Verified Evidence Dossier — {selectedCandidate?.full_name}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="caption" fontWeight={700} color="text.secondary">
                ROLE FIT SCORE
              </Typography>
              <Typography variant="h4" fontWeight={800} color="primary.main">
                {selectedCandidate?.role_fit_score}% Match
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                VERIFIED SKILLS (CODE / ASSESSMENTS)
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                {selectedCandidate?.verified_skills?.map((s) => (
                  <Chip key={s} label={`✓ ${s}`} color="success" size="small" sx={{ fontWeight: 600 }} />
                ))}
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                UNVERIFIED / DEVELOPMENT AREAS
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                {selectedCandidate?.unverified_skills?.map((s) => (
                  <Chip key={s} label={`△ ${s}`} size="small" variant="outlined" />
                ))}
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.5 }}>
                ACADEMIC ELIGIBILITY
              </Typography>
              <Typography variant="body2">{selectedCandidate?.academic_fit}</Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setSelectedCandidate(null)}>Close</Button>
          <Button
            variant="contained"
            onClick={() => {
              if (selectedCandidate) handleToggleShortlist(selectedCandidate.id);
              setSelectedCandidate(null);
            }}
          >
            {selectedCandidate && shortlistedMap[selectedCandidate.id] ? 'Remove from Shortlist' : 'Confirm Shortlist'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
