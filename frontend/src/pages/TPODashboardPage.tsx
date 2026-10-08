import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Users,
  TrendingUp,
  Award,
  AlertCircle,
  Sliders,
  Search,
  Filter,
  CheckCircle,
  Sparkles,
  Layers,
  Building,
} from 'lucide-react';
import { apiClient } from '../services/api/client';
import { APIResponse } from '../types/api';
import { TPOOverviewData, SimulatorResponse, TPOStudentRow } from '../types/tpo';

export const TPODashboardPage: React.FC = () => {
  const [overview, setOverview] = useState<TPOOverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  // What-If Simulator state
  const [interventionSkill, setInterventionSkill] = useState('Data Structures & Algorithms');
  const [expectedImprovement, setExpectedImprovement] = useState(15);
  const [simulationResult, setSimulationResult] = useState<SimulatorResponse | null>(null);
  const [runningSimulation, setRunningSimulation] = useState(false);

  // Student table state
  const [students, setStudents] = useState<TPOStudentRow[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');

  const fetchOverview = async () => {
    try {
      const res = await apiClient.get<APIResponse<TPOOverviewData>>('/tpo/overview');
      setOverview(res.data.data);
    } catch (err) {
      console.error('Error loading TPO overview:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await apiClient.get<APIResponse<any>>('/tpo/students', {
        params: {
          search: search || undefined,
          department: deptFilter !== 'ALL' ? deptFilter : undefined,
          page: page + 1,
          limit: rowsPerPage,
        },
      });
      setStudents(res.data.data.students);
      setTotalStudents(res.data.data.total);
    } catch (err) {
      console.error('Error loading students:', err);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [page, rowsPerPage, deptFilter, search]);

  const handleRunSimulation = async () => {
    setRunningSimulation(true);
    try {
      const res = await apiClient.post<APIResponse<SimulatorResponse>>('/simulator/simulate', {
        role_category: 'Backend Developer',
        intervention_skill: interventionSkill,
        expected_skill_improvement: expectedImprovement,
      });
      setSimulationResult(res.data.data);
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setRunningSimulation(false);
    }
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
          Placement intelligence for your campus.
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Real-time batch capability metrics, department gap heatmaps, and simulation tools.
        </Typography>
      </Box>

      {/* 2. Batch Overview Metric Cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={3}>
          <Card sx={{ p: 2.5, borderRadius: 3 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              TOTAL STUDENTS
            </Typography>
            <Typography variant="h3" fontWeight={800} color="primary.main" sx={{ my: 0.5 }}>
              {metrics?.total_students || 310}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Graduation Batch 2026
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ p: 2.5, borderRadius: 3, borderLeft: '4px solid', borderColor: 'success.main' }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              PLACEMENT READY
            </Typography>
            <Typography variant="h3" fontWeight={800} color="success.main" sx={{ my: 0.5 }}>
              {metrics?.placement_ready || 183}
            </Typography>
            <Typography variant="caption" color="success.main" fontWeight={600}>
              Crossed 70% readiness
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ p: 2.5, borderRadius: 3, borderLeft: '4px solid', borderColor: 'warning.main' }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              NEAR READY
            </Typography>
            <Typography variant="h3" fontWeight={800} color="warning.main" sx={{ my: 0.5 }}>
              {metrics?.near_ready || 92}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              50% - 69% readiness tier
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ p: 2.5, borderRadius: 3, borderLeft: '4px solid', borderColor: 'error.main' }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              AT RISK / EARLY PREP
            </Typography>
            <Typography variant="h3" fontWeight={800} color="error.main" sx={{ my: 0.5 }}>
              {metrics?.at_risk || 35}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Requires foundation track
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* 3. SIGNATURE FEATURE: What-If Placement Simulator */}
      <Card
        sx={{
          mb: 4,
          borderRadius: 4,
          p: { xs: 2.5, sm: 3.5 },
          bgcolor: 'background.paper',
          border: '1.5px solid',
          borderColor: 'primary.light',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <Box
            sx={{
              p: 0.8,
              borderRadius: 2,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              display: 'flex',
            }}
          >
            <Sliders size={20} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={800}>
              What-If Placement Simulator
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Simulate how targeted training interventions expand candidate eligibility before recruitment drives
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 2.5, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Proposed Intervention Skill</InputLabel>
                <Select
                  value={interventionSkill}
                  label="Proposed Intervention Skill"
                  onChange={(e) => setInterventionSkill(e.target.value)}
                >
                  <MenuItem value="Data Structures & Algorithms">DSA Intensive Bootcamp</MenuItem>
                  <MenuItem value="Spring Boot">Spring Boot & Microservices Lab</MenuItem>
                  <MenuItem value="Cloud / AWS">AWS Cloud Computing Track</MenuItem>
                  <MenuItem value="SQL & DB Optimization">SQL & Database Optimization</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Expected Skill Growth</InputLabel>
                <Select
                  value={expectedImprovement}
                  label="Expected Skill Growth"
                  onChange={(e) => setExpectedImprovement(Number(e.target.value))}
                >
                  <MenuItem value={10}>+10% Average Mastery Growth</MenuItem>
                  <MenuItem value={15}>+15% Average Mastery Growth (Recommended)</MenuItem>
                  <MenuItem value={20}>+20% Comprehensive Hands-on Mastery</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleRunSimulation}
                disabled={runningSimulation}
                startIcon={<Sparkles size={18} />}
                sx={{ py: 1 }}
              >
                {runningSimulation ? 'Calculating Projection...' : 'Run Simulation'}
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Simulation Output Area */}
        {simulationResult ? (
          <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: 'background.default' }}>
            <Alert severity="info" sx={{ mb: 2.5, borderRadius: 2 }}>
              <strong>{simulationResult.simulation_label}</strong>
              <br />
              {simulationResult.explanation}
            </Alert>

            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>
                  CURRENT ELIGIBLE CANDIDATES
                </Typography>
                <Typography variant="h2" fontWeight={800} color="text.primary">
                  {simulationResult.current_eligible_count}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  59% of evaluated batch
                </Typography>
              </Grid>

              <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
                <Typography variant="caption" color="primary.main" fontWeight={700}>
                  PROJECTED AFTER BOOTCAMP
                </Typography>
                <Typography variant="h2" fontWeight={800} color="primary.main">
                  {simulationResult.projected_eligible_count}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  86% of evaluated batch
                </Typography>
              </Grid>

              <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
                <Typography variant="caption" color="success.main" fontWeight={700}>
                  POTENTIAL QUALIFIED INCREASE
                </Typography>
                <Typography variant="h2" fontWeight={800} color="success.main">
                  +{simulationResult.potential_increase}
                </Typography>
                <Typography variant="caption" color="success.main" fontWeight={700}>
                  +46% more students ready
                </Typography>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'background.default', borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Click <strong>"Run Simulation"</strong> to model how a {interventionSkill} bootcamp will shift batch eligibility for upcoming Backend Developer drives.
            </Typography>
          </Box>
        )}
      </Card>

      {/* 4. Skill Heatmap (Department x Skill) */}
      <Card sx={{ p: 3, borderRadius: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>
              DEPARTMENT × SKILL CAPABILITY HEATMAP
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Mean verified skill proficiency across academic departments
            </Typography>
          </Box>
        </Box>

        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
          <Table size="small">
            <TableHead sx={{ bgcolor: 'action.hover' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Department</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Java</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Python</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>SQL</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>DSA</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Cloud / DevOps</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {overview?.skill_heatmap?.map((row) => (
                <TableRow key={row.department}>
                  <TableCell sx={{ fontWeight: 700 }}>{row.department}</TableCell>
                  {[row.Java, row.Python, row.SQL, row.DSA, row.Cloud].map((val, idx) => (
                    <TableCell key={idx} align="center">
                      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            bgcolor: val >= 70 ? 'success.main' : val >= 50 ? 'warning.main' : 'error.main',
                          }}
                        />
                        <Typography variant="body2" fontWeight={600}>
                          {val}%
                        </Typography>
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* 5. TPO Student Batch Table */}
      <Card sx={{ p: 3, borderRadius: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1" fontWeight={700}>
            BATCH ROSTER & READINESS DIRECTORY
          </Typography>
        </Box>

        {/* Filter bar */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          <TextField
            size="small"
            placeholder="Search candidate or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <Search size={16} style={{ marginRight: 8, color: '#888' }} />,
            }}
            sx={{ minWidth: 260 }}
          />
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Department</InputLabel>
            <Select value={deptFilter} label="Department" onChange={(e) => setDeptFilter(e.target.value)}>
              <MenuItem value="ALL">All Departments</MenuItem>
              <MenuItem value="Computer Science">CSE</MenuItem>
              <MenuItem value="Information">IT</MenuItem>
              <MenuItem value="Electronics">ECE</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Student Table */}
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
          <Table size="small">
            <TableHead sx={{ bgcolor: 'action.hover' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Student</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Department</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>CGPA</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Readiness</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Target Role</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Critical Gap</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((s) => (
                <TableRow key={s.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={700}>
                      {s.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {s.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">{s.department}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {s.cgpa}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      fontWeight={700}
                      color={s.readiness >= 70 ? 'success.main' : s.readiness >= 50 ? 'warning.main' : 'error.main'}
                    >
                      {s.readiness}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">{s.target_role}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="error.main" fontWeight={600}>
                      {s.critical_gap}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={s.status}
                      size="small"
                      color={s.status === 'Placement Ready' ? 'success' : s.status === 'Near Ready' ? 'warning' : 'error'}
                      sx={{ height: 22, fontSize: '0.7rem', fontWeight: 700 }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalStudents}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Card>
    </Box>
  );
};
