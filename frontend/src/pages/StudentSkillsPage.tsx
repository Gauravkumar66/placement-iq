import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  Button,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Tabs,
  Tab,
  Alert,
} from '@mui/material';
import {
  Layers,
  CheckCircle,
  Plus,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Award,
  GitBranch,
  BookOpen,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { apiClient } from '../services/api/client';
import { APIResponse } from '../types/api';
import { StudentProfile, StudentSkill } from '../types/student';

export const StudentSkillsPage: React.FC = () => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [skills, setSkills] = useState<StudentSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  // Add Skill Dialog
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('Programming Language');
  const [newSkillLevel, setNewSkillLevel] = useState<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'>('INTERMEDIATE');
  const [newEvidenceSource, setNewEvidenceSource] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await apiClient.get<APIResponse<StudentProfile>>('/students/profile');
      setProfile(res.data.data);
      setSkills(res.data.data.skills || []);
    } catch (err) {
      console.error('Error fetching skills:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleAddSkill = async () => {
    if (!newSkillName.trim()) return;
    setSubmitting(true);
    try {
      await apiClient.post<APIResponse<any>>('/skills/student-skills', {
        skill_name: newSkillName,
        category: newSkillCategory,
        skill_level: newSkillLevel,
        evidence_sources: newEvidenceSource ? [newEvidenceSource] : ['Self-reported'],
      });
      setAddModalOpen(false);
      setNewSkillName('');
      setNewEvidenceSource('');
      fetchProfile();
    } catch (err) {
      console.error('Error adding skill:', err);
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

  const verifiedSkills = skills.filter((s) => s.verification_status === 'VERIFIED');
  const unverifiedSkills = skills.filter((s) => s.verification_status !== 'VERIFIED');

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Skills & Evidence Portfolio
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Verified technical proficiencies backed by code repositories, assessment scores, and production projects.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={() => setAddModalOpen(true)}
          sx={{ borderRadius: 2 }}
        >
          Add Skill & Evidence
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ShieldCheck size={20} color="#2e7d32" />
              <Typography variant="caption" color="success.main" fontWeight={700}>
                VERIFIED SKILLS
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight={800} sx={{ mt: 0.5 }}>
              {verifiedSkills.length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Backed by project repo or proctored test
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <HelpCircle size={20} color="#ed6c02" />
              <Typography variant="caption" color="warning.main" fontWeight={700}>
                PENDING VERIFICATION
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight={800} sx={{ mt: 0.5 }}>
              {unverifiedSkills.length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Take a 15-min assessment to verify
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Award size={20} color="#1976d2" />
              <Typography variant="caption" color="primary.main" fontWeight={700}>
                PRIMARY ROLE MATCH
              </Typography>
            </Box>
            <Typography variant="h5" fontWeight={800} sx={{ mt: 0.5 }}>
              Backend Developer
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Target role readiness: 68%
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, val) => setActiveTab(val)}>
          <Tab label={`All Skills (${skills.length})`} sx={{ fontWeight: 700 }} />
          <Tab label="Skill Knowledge Graph" sx={{ fontWeight: 700 }} />
        </Tabs>
      </Box>

      {activeTab === 0 ? (
        <Grid container spacing={2.5}>
          {skills.map((skill) => {
            const isVerified = skill.verification_status === 'VERIFIED';
            return (
              <Grid item xs={12} sm={6} md={4} key={skill.id}>
                <Card
                  sx={{
                    p: 2.5,
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" fontWeight={800}>
                        {skill.skill_name}
                      </Typography>
                      <Chip
                        label={isVerified ? 'Verified' : 'Unverified'}
                        size="small"
                        color={isVerified ? 'success' : 'default'}
                        icon={isVerified ? <ShieldCheck size={14} /> : undefined}
                        sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                      />
                    </Box>

                    <Typography variant="caption" color="text.secondary" gutterBottom>
                      Category: {skill.category} • Level: {skill.skill_level}
                    </Typography>

                    <Box sx={{ my: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          Proficiency Confidence
                        </Typography>
                        <Typography variant="caption" fontWeight={700}>
                          {skill.confidence_score}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={skill.confidence_score}
                        color={isVerified ? 'success' : 'warning'}
                        sx={{ height: 6, borderRadius: 2 }}
                      />
                    </Box>

                    {/* Evidence Tags */}
                    <Box sx={{ mt: 1.5 }}>
                      <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                        Evidence Proofs:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {skill.evidence_sources && skill.evidence_sources.length > 0 ? (
                          skill.evidence_sources.map((src, idx) => (
                            <Chip
                              key={idx}
                              label={src}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.68rem', height: 20 }}
                            />
                          ))
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            No external evidence attached yet
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ mt: 2, pt: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="caption" color="text.secondary">
                      Projects linked: {skill.project_evidence_count} • Assessments: {skill.assessment_score ? `${skill.assessment_score}%` : 'None'}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        /* Skill Knowledge Graph Representation */
        <Card sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight={800} gutterBottom>
            Career Skill Dependency Graph
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            How your technical stack connects to job role qualifications.
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom color="primary.main">
                  1. Foundations (Languages)
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Chip label="Java (Advanced)" color="primary" />
                  <Chip label="Python (Proficient)" color="primary" />
                  <Chip label="SQL (Verified 82%)" color="primary" />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom color="info.main">
                  2. Frameworks & Tools
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Chip label="Spring Boot (Intermediate)" color="info" />
                  <Chip label="PostgreSQL (Verified)" color="info" />
                  <Chip label="Docker (Pending Verification)" variant="outlined" />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom color="success.main">
                  3. Qualified Job Targets
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Chip label="Backend Developer (68% Fit)" color="success" />
                  <Chip label="Full Stack Associate (62% Fit)" color="success" variant="outlined" />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Card>
      )}

      {/* Add Skill Dialog */}
      <Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Add Technical Skill & Evidence</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Skill Name"
              placeholder="e.g. Docker, Redis, Kubernetes"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              fullWidth
              size="small"
            />
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select value={newSkillCategory} label="Category" onChange={(e) => setNewSkillCategory(e.target.value)}>
                <MenuItem value="Programming Language">Programming Language</MenuItem>
                <MenuItem value="Backend Framework">Backend Framework</MenuItem>
                <MenuItem value="Frontend Framework">Frontend Framework</MenuItem>
                <MenuItem value="Database">Database</MenuItem>
                <MenuItem value="DevOps & Cloud">DevOps & Cloud</MenuItem>
                <MenuItem value="Core CS">Core Computer Science</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel>Proficiency Level</InputLabel>
              <Select value={newSkillLevel} label="Proficiency Level" onChange={(e) => setNewSkillLevel(e.target.value as any)}>
                <MenuItem value="BEGINNER">Beginner (Basic Syntax & Concepts)</MenuItem>
                <MenuItem value="INTERMEDIATE">Intermediate (Built Academic Projects)</MenuItem>
                <MenuItem value="ADVANCED">Advanced (Production Experience)</MenuItem>
                <MenuItem value="EXPERT">Expert (Deep System Optimization)</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Evidence URL / Proof Description"
              placeholder="e.g. GitHub Repository, Certification Link, LeetCode profile"
              value={newEvidenceSource}
              onChange={(e) => setNewEvidenceSource(e.target.value)}
              fullWidth
              size="small"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAddModalOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleAddSkill} variant="contained" disabled={submitting || !newSkillName.trim()}>
            {submitting ? 'Saving...' : 'Save Skill'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
