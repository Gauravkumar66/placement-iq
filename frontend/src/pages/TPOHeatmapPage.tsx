import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  LinearProgress,
  Alert,
  Tooltip,
} from '@mui/material';
import {
  Layers,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Download,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/api/client';
import { APIResponse } from '../types/api';
import { TPOOverviewData } from '../types/tpo';

export const TPOHeatmapPage: React.FC = () => {
  const navigate = useNavigate();
  const [overview, setOverview] = useState<TPOOverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeatmap = async () => {
      try {
        const res = await apiClient.get<APIResponse<TPOOverviewData>>('/tpo/overview');
        setOverview(res.data.data);
      } catch (err) {
        console.error('Error fetching heatmap data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHeatmap();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  const heatmap = overview?.skill_heatmap || [
    { department: 'Computer Science', Java: 78, Python: 82, SQL: 74, DSA: 61, Cloud: 45 },
    { department: 'Information Technology', Java: 72, Python: 75, SQL: 70, DSA: 58, Cloud: 42 },
    { department: 'Electronics & Comm.', Java: 60, Python: 68, SQL: 62, DSA: 52, Cloud: 35 },
  ];

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Department × Skill Capability Heatmap
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Aggregate verified skill proficiency metrics across academic departments and identify batch curriculum gaps.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Sparkles size={18} />}
          onClick={() => navigate('/tpo/simulator')}
          sx={{ borderRadius: 2 }}
        >
          Model Intervention
        </Button>
      </Box>

      {/* Critical Gap Banner */}
      <Alert
        severity="warning"
        icon={<AlertTriangle size={20} />}
        sx={{ mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'warning.light' }}
      >
        <Typography variant="subtitle2" fontWeight={700}>
          Batch-Wide Bottleneck Identified: Data Structures & Algorithms (DSA)
        </Typography>
        <Typography variant="body2">
          Mean DSA proficiency across all departments is <strong>57%</strong>, falling below the 70% threshold required by Tier-1 product recruiters (Nexus Innovations, CloudScale Systems).
        </Typography>
      </Alert>

      {/* Main Heatmap Table Card */}
      <Card sx={{ p: 3, borderRadius: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>
              ACADEMIC DEPARTMENT PROFICIENCY MATRIX
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Color coding: Green (&gt;=70% Ready), Amber (50-69% Moderate), Red (&lt;50% Critical Deficit)
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: 'success.main' }} />
              <Typography variant="caption" fontWeight={600}>&gt;= 70%</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: 'warning.main' }} />
              <Typography variant="caption" fontWeight={600}>50 - 69%</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: 'error.main' }} />
              <Typography variant="caption" fontWeight={600}>&lt; 50%</Typography>
            </Box>
          </Box>
        </Box>

        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ bgcolor: 'action.hover' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, width: '28%' }}>Department</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Java</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Python</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>SQL</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>DSA</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Cloud / DevOps</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {heatmap.map((row) => (
                <TableRow key={row.department} hover>
                  <TableCell sx={{ fontWeight: 700 }}>{row.department}</TableCell>
                  {[
                    { name: 'Java', val: row.Java },
                    { name: 'Python', val: row.Python },
                    { name: 'SQL', val: row.SQL },
                    { name: 'DSA', val: row.DSA },
                    { name: 'Cloud', val: row.Cloud },
                  ].map((cell, idx) => {
                    const isGreen = cell.val >= 70;
                    const isAmber = cell.val >= 50 && cell.val < 70;
                    const bgColor = isGreen ? 'rgba(46, 125, 50, 0.12)' : isAmber ? 'rgba(237, 108, 2, 0.12)' : 'rgba(211, 47, 47, 0.12)';
                    const textColor = isGreen ? 'success.dark' : isAmber ? 'warning.dark' : 'error.dark';

                    return (
                      <TableCell key={idx} align="center">
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: bgColor,
                            display: 'inline-flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            minWidth: 80,
                          }}
                        >
                          <Typography variant="body1" fontWeight={800} color={textColor}>
                            {cell.val}%
                          </Typography>
                          <Typography variant="caption" sx={{ fontSize: '0.68rem', color: textColor }}>
                            {isGreen ? 'Benchmark Met' : isAmber ? 'Moderate Gap' : 'Critical Deficit'}
                          </Typography>
                        </Box>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Curriculum Intervention Recommendations */}
      <Typography variant="h6" fontWeight={800} gutterBottom>
        Automated Curriculum Intervention Actions
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <Chip label="High Impact" size="small" color="error" />
              <Typography variant="subtitle2" fontWeight={800}>
                DSA Intensive Sprint
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Organize a 14-day Dynamic Programming & Tree Traversal workshop for CSE and IT. Will lift 11 candidates into the &gt;=70% readiness tier.
            </Typography>
            <Button
              variant="outlined"
              size="small"
              fullWidth
              endIcon={<ArrowRight size={16} />}
              onClick={() => navigate('/tpo/simulator')}
            >
              Simulate in What-If Tool
            </Button>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <Chip label="Medium Impact" size="small" color="warning" />
              <Typography variant="subtitle2" fontWeight={800}>
                Cloud & Docker Lab
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              ECE students show only 35% proficiency in Cloud tools. A hands-on containerization lab will open eligibility for DevOps associate drives.
            </Typography>
            <Button
              variant="outlined"
              size="small"
              fullWidth
              endIcon={<ArrowRight size={16} />}
              onClick={() => navigate('/tpo/simulator')}
            >
              Simulate in What-If Tool
            </Button>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <Chip label="Strength" size="small" color="success" />
              <Typography variant="subtitle2" fontWeight={800}>
                Python & ML Advantage
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              CSE batch demonstrates 82% verified proficiency in Python. Highly recommended to pitch our batch to Data Science and AI recruitment partners.
            </Typography>
            <Button
              variant="outlined"
              size="small"
              fullWidth
              endIcon={<ArrowRight size={16} />}
              onClick={() => navigate('/tpo/students')}
            >
              View Qualified Students
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
