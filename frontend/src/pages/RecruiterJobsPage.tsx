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
  TextField,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Briefcase,
  Plus,
  Building,
  MapPin,
  DollarSign,
  Users,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { apiClient } from '../services/api/client';
import { APIResponse } from '../types/api';
import { Job } from '../types/job';

export const RecruiterJobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // New Requisition Dialog
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Backend Developer');
  const [newLocation, setNewLocation] = useState('Bangalore / Hybrid');
  const [newSalary, setNewSalary] = useState('12 - 16 LPA');
  const [newSkills, setNewSkills] = useState('Java, Spring Boot, PostgreSQL, DSA');
  const [submitting, setSubmitting] = useState(false);

  const fetchJobs = async () => {
    try {
      const res = await apiClient.get<APIResponse<Job[]>>('/jobs/');
      setJobs(res.data.data || []);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleCreateJob = async () => {
    if (!newTitle.trim()) return;
    setSubmitting(true);
    try {
      // Simulate posting job
      const newJob: Job = {
        id: Date.now(),
        company_id: 1,
        company_name: 'Nexus Innovations',
        title: newTitle,
        role_category: newCategory,
        description: 'New campus requisition looking for skilled graduates.',
        required_skills: newSkills.split(',').map((s) => s.trim()),
        preferred_skills: ['Docker', 'AWS'],
        soft_skills: ['Communication', 'Teamwork'],
        min_cgpa: 7.0,
        min_experience_years: 0,
        max_experience_years: 1,
        location: newLocation,
        salary_range: newSalary,
        is_active: true,
        created_at: new Date().toISOString(),
      };
      setJobs((prev) => [newJob, ...prev]);
      setCreateModalOpen(false);
      setNewTitle('');
    } catch (err) {
      console.error('Error creating job:', err);
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
            Open Requisitions & Campus Drives
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your company hiring criteria, required skill benchmarks, and applicant screening thresholds.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={() => setCreateModalOpen(true)}
          sx={{ borderRadius: 2 }}
        >
          Post New Requisition
        </Button>
      </Box>

      {/* Jobs Grid */}
      <Grid container spacing={3}>
        {jobs.map((job) => (
          <Grid item xs={12} key={job.id}>
            <Card sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Box>
                  <Typography variant="h5" fontWeight={800}>
                    {job.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5, color: 'text.secondary' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Building size={16} />
                      <Typography variant="body2" fontWeight={600}>
                        {job.company_name || 'Tech Innovations'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <MapPin size={16} />
                      <Typography variant="caption">{job.location}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <DollarSign size={16} />
                      <Typography variant="caption" fontWeight={700} color="primary.main">
                        {job.salary_range}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Chip
                  label={job.is_active ? 'Active Drive' : 'Closed'}
                  color={job.is_active ? 'success' : 'default'}
                  size="small"
                  sx={{ fontWeight: 700 }}
                />
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ my: 1.5 }}>
                {job.description}
              </Typography>

              {/* Skills and Eligibility */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center', mt: 2 }}>
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mr: 1 }}>
                  REQUIRED SKILLS:
                </Typography>
                {job.required_skills?.map((sk) => (
                  <Chip key={sk} label={sk} size="small" color="primary" variant="outlined" sx={{ height: 22, fontSize: '0.72rem' }} />
                ))}
                <Box sx={{ ml: 'auto' }}>
                  <Typography variant="caption" color="text.secondary">
                    Min CGPA: <strong>{job.min_cgpa}</strong>
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Post Job Modal */}
      <Dialog open={createModalOpen} onClose={() => setCreateModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Create New Campus Requisition</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Job Role Title"
              placeholder="e.g. Associate Backend Engineer"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              fullWidth
              size="small"
            />
            <TextField
              label="Role Category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              fullWidth
              size="small"
            />
            <TextField
              label="Location"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              fullWidth
              size="small"
            />
            <TextField
              label="Salary Package"
              value={newSalary}
              onChange={(e) => setNewSalary(e.target.value)}
              fullWidth
              size="small"
            />
            <TextField
              label="Required Skills (comma separated)"
              value={newSkills}
              onChange={(e) => setNewSkills(e.target.value)}
              fullWidth
              size="small"
              helperText="e.g. Java, Spring Boot, SQL, DSA"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setCreateModalOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleCreateJob} variant="contained" disabled={submitting || !newTitle.trim()}>
            {submitting ? 'Posting...' : 'Publish Requisition'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
