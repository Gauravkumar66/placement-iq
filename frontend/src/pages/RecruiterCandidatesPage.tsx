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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Alert,
} from '@mui/material';
import {
  Users,
  Search,
  CheckCircle,
  Award,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Star,
  FileText,
  Mail,
  Filter,
} from 'lucide-react';
import { apiClient } from '../services/api/client';
import { APIResponse } from '../types/api';
import { MatchedCandidate } from '../types/recruiter';

export const RecruiterCandidatesPage: React.FC = () => {
  const [candidates, setCandidates] = useState<MatchedCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [minFit, setMinFit] = useState(60);
  const [shortlisted, setShortlisted] = useState<Record<number, boolean>>({});

  // Candidate Dossier Modal
  const [selectedCandidate, setSelectedCandidate] = useState<MatchedCandidate | null>(null);

  const fetchCandidates = async () => {
    try {
      const res = await apiClient.get<APIResponse<MatchedCandidate[]>>('/recruiters/candidates');
      setCandidates(res.data.data || []);
    } catch (err) {
      console.error('Error fetching candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleToggleShortlist = (id: number) => {
    setShortlisted((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.full_name.toLowerCase().includes(search.toLowerCase()) ||
      c.department.toLowerCase().includes(search.toLowerCase());
    const matchesFit = c.role_fit_score >= minFit;
    return matchesSearch && matchesFit;
  });

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Matched Candidate Discovery
          </Typography>
          <Typography variant="body1" color="text.secondary">
            AI-screened candidates with verified project evidence and proctored technical ratings.
          </Typography>
        </Box>
        <Chip
          label={`${filteredCandidates.length} Candidates Qualified`}
          color="primary"
          sx={{ fontWeight: 700 }}
        />
      </Box>

      {/* Filter Toolbar */}
      <Card sx={{ p: 2.5, borderRadius: 3, mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder="Search candidate name or department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: <Search size={16} style={{ marginRight: 8, color: '#888' }} />,
          }}
          sx={{ minWidth: 280, flexGrow: 1 }}
        />
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Min Role Fit Score</InputLabel>
          <Select value={minFit} label="Min Role Fit Score" onChange={(e) => setMinFit(Number(e.target.value))}>
            <MenuItem value={50}>50% & Above</MenuItem>
            <MenuItem value={60}>60% & Above</MenuItem>
            <MenuItem value={70}>70% & Above (Ready)</MenuItem>
            <MenuItem value={80}>80% & Above (Top Tier)</MenuItem>
          </Select>
        </FormControl>
      </Card>

      {/* Candidates List */}
      <Grid container spacing={3}>
        {filteredCandidates.map((candidate) => {
          const isShortlisted = shortlisted[candidate.id];
          return (
            <Grid item xs={12} key={candidate.id}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: isShortlisted ? 'primary.main' : 'divider',
                  bgcolor: isShortlisted ? 'action.hover' : 'background.paper',
                }}
              >
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                      <Typography variant="h5" fontWeight={800}>
                        {candidate.full_name}
                      </Typography>
                      <Chip
                        label={`${candidate.department} • CGPA ${candidate.cgpa}`}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.72rem' }}
                      />
                      <Chip
                        label={candidate.status}
                        size="small"
                        color={candidate.role_fit_score >= 70 ? 'success' : 'warning'}
                        sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                      />
                    </Box>

                    {/* "Why this candidate?" insights */}
                    <Box sx={{ my: 1.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography variant="caption" fontWeight={700} color="text.secondary">
                        WHY THIS CANDIDATE:
                      </Typography>
                      {candidate.why_this_candidate?.map((why, idx) => (
                        <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                          <CheckCircle size={14} color="#2e7d32" />
                          <Typography variant="body2" color="text.primary">
                            {why.text}
                          </Typography>
                        </Box>
                      ))}
                    </Box>

                    {/* Verified Skills */}
                    <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                      <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mr: 1 }}>
                        VERIFIED:
                      </Typography>
                      {candidate.verified_skills?.map((sk) => (
                        <Chip
                          key={sk}
                          label={sk}
                          size="small"
                          color="success"
                          variant="outlined"
                          icon={<ShieldCheck size={12} />}
                          sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600 }}
                        />
                      ))}
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                    <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="caption" color="text.secondary" fontWeight={700}>
                        ROLE FIT INDEX
                      </Typography>
                      <Typography
                        variant="h3"
                        fontWeight={900}
                        color={candidate.role_fit_score >= 70 ? 'success.main' : 'warning.main'}
                      >
                        {candidate.role_fit_score}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                        Academic Fit: {candidate.academic_fit}
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Button
                          variant={isShortlisted ? 'contained' : 'outlined'}
                          color="primary"
                          startIcon={<Star size={16} fill={isShortlisted ? 'currentColor' : 'none'} />}
                          onClick={() => handleToggleShortlist(candidate.id)}
                          sx={{ flexGrow: 1 }}
                        >
                          {isShortlisted ? 'Shortlisted' : 'Shortlist'}
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => setSelectedCandidate(candidate)}
                        >
                          Dossier
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

      {/* Candidate Dossier Dialog */}
      <Dialog
        open={Boolean(selectedCandidate)}
        onClose={() => setSelectedCandidate(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={800}>
              Verified Candidate Dossier
            </Typography>
            <Chip
              label={`${selectedCandidate?.role_fit_score}% Fit`}
              color="success"
              size="small"
              sx={{ fontWeight: 800 }}
            />
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedCandidate && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="h5" fontWeight={800}>
                  {selectedCandidate.full_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedCandidate.department} • Graduation Batch {selectedCandidate.graduation_year} • CGPA {selectedCandidate.cgpa}
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                  Verified Technical Portfolio:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedCandidate.verified_skills?.map((sk) => (
                    <Chip key={sk} label={sk} color="success" size="small" icon={<ShieldCheck size={14} />} />
                  ))}
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                  Evidence & Verification Rationale:
                </Typography>
                {selectedCandidate.why_this_candidate?.map((why, idx) => (
                  <Typography key={idx} variant="body2" sx={{ mb: 0.5 }}>
                    • {why.text}
                  </Typography>
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setSelectedCandidate(null)} variant="outlined">
            Close
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              alert(`Interview invitation dispatched to ${selectedCandidate?.full_name}!`);
              setSelectedCandidate(null);
            }}
          >
            Schedule Technical Round
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
