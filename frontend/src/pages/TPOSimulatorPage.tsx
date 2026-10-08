import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert,
  CircularProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
} from '@mui/material';
import {
  Sliders,
  Sparkles,
  TrendingUp,
  Award,
  Users,
  Download,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { apiClient } from '../services/api/client';
import { APIResponse } from '../types/api';
import { SimulatorResponse } from '../types/tpo';

export const TPOSimulatorPage: React.FC = () => {
  const [targetCompany, setTargetCompany] = useState('Nexus Innovations');
  const [roleCategory, setRoleCategory] = useState('Backend Developer');
  const [interventionSkill, setInterventionSkill] = useState('Data Structures & Algorithms');
  const [expectedImprovement, setExpectedImprovement] = useState(15);
  const [deptFilter, setDeptFilter] = useState('ALL');

  const [loading, setLoading] = useState(false);
  const [simulationResult, setSimulationResult] = useState<SimulatorResponse | null>(null);

  const handleRunSimulation = async () => {
    setLoading(true);
    try {
      const res = await apiClient.post<APIResponse<SimulatorResponse>>('/simulator/simulate', {
        role_category: roleCategory,
        intervention_skill: interventionSkill,
        expected_skill_improvement: expectedImprovement,
        department_filter: deptFilter !== 'ALL' ? deptFilter : null,
      });
      setSimulationResult(res.data.data);
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              display: 'flex',
            }}
          >
            <Sliders size={22} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              What-If Placement Simulator
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Predictive capability modeling — Estimate how specific bootcamps expand candidate eligibility for upcoming company drives.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Simulator Control Cockpit */}
      <Card sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: 4, mb: 4, bgcolor: 'background.paper', border: '1.5px solid', borderColor: 'primary.light' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2 }}>
          SIMULATION PARAMETERS & INTERVENTION HYPOTHESIS
        </Typography>

        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Target Company</InputLabel>
              <Select
                value={targetCompany}
                label="Target Company"
                onChange={(e) => setTargetCompany(e.target.value)}
              >
                <MenuItem value="Nexus Innovations">Nexus Innovations</MenuItem>
                <MenuItem value="Amazon">Amazon</MenuItem>
                <MenuItem value="Google">Google</MenuItem>
                <MenuItem value="TCS Digital">TCS Digital</MenuItem>
                <MenuItem value="FinTech Enterprise">FinTech Enterprise</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Target Job Role</InputLabel>
              <Select
                value={roleCategory}
                label="Target Job Role"
                onChange={(e) => setRoleCategory(e.target.value)}
              >
                <MenuItem value="Backend Developer">Backend Developer</MenuItem>
                <MenuItem value="Frontend Developer">Frontend Developer</MenuItem>
                <MenuItem value="Full Stack Developer">Full Stack Developer</MenuItem>
                <MenuItem value="Data Science & ML">Data Science & ML</MenuItem>
                <MenuItem value="Cloud & DevOps Engineer">Cloud & DevOps Engineer</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Proposed Intervention</InputLabel>
              <Select
                value={interventionSkill}
                label="Proposed Intervention"
                onChange={(e) => setInterventionSkill(e.target.value)}
              >
                <MenuItem value="Data Structures & Algorithms">DSA Intensive Bootcamp</MenuItem>
                <MenuItem value="Spring Boot">Spring Boot & Microservices Lab</MenuItem>
                <MenuItem value="Cloud / AWS">AWS Cloud Computing Track</MenuItem>
                <MenuItem value="SQL & DB Optimization">SQL & Database Optimization</MenuItem>
                <MenuItem value="System Architecture">System Design Masterclass</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Expected Skill Growth</InputLabel>
              <Select
                value={expectedImprovement}
                label="Expected Skill Growth"
                onChange={(e) => setExpectedImprovement(Number(e.target.value))}
              >
                <MenuItem value={10}>+10% Average Mastery Growth</MenuItem>
                <MenuItem value={15}>+15% Recommended Growth</MenuItem>
                <MenuItem value={20}>+20% High-Intensity Growth</MenuItem>
                <MenuItem value={25}>+25% Deep Capstone Track</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleRunSimulation}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Sparkles size={18} />}
            sx={{ px: 4, py: 1.2, fontWeight: 700 }}
          >
            {loading ? 'Modeling Projection...' : 'Run Simulation Projection'}
          </Button>
        </Box>
      </Card>

      {/* Results View */}
      {simulationResult ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Disclaimer Alert */}
          <Alert severity="warning" sx={{ borderRadius: 3 }}>
            <strong>{simulationResult.simulation_label}</strong>: This model extrapolates historical assessment progress and current candidate skill distributions. It is an institution-planning estimate, not a real-world placement guarantee.
          </Alert>

          {/* Impact Headline Metrics */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 3, borderRadius: 3, textAlign: 'center', bgcolor: 'background.paper' }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                  CURRENT ELIGIBLE CANDIDATES
                </Typography>
                <Typography variant="h2" sx={{ fontWeight: 800, my: 0.5, color: 'text.primary' }}>
                  {simulationResult.current_eligible_count}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  59% of evaluated batch
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 3, borderRadius: 3, textAlign: 'center', borderLeft: '4px solid', borderColor: 'primary.main', bgcolor: 'background.paper' }}>
                <Typography variant="caption" color="primary.main" sx={{ fontWeight: 700 }}>
                  PROJECTED AFTER BOOTCAMP
                </Typography>
                <Typography variant="h2" sx={{ fontWeight: 800, my: 0.5, color: 'primary.main' }}>
                  {simulationResult.projected_eligible_count}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  86% of evaluated batch
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 3, borderRadius: 3, textAlign: 'center', borderLeft: '4px solid', borderColor: 'success.main', bgcolor: 'background.paper' }}>
                <Typography variant="caption" color="success.main" sx={{ fontWeight: 700 }}>
                  POTENTIAL QUALIFIED INCREASE
                </Typography>
                <Typography variant="h2" sx={{ fontWeight: 800, my: 0.5, color: 'success.main' }}>
                  +{simulationResult.potential_increase}
                </Typography>
                <Typography variant="caption" color="success.main" sx={{ fontWeight: 700 }}>
                  +46% expansion in eligible pool
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 3, borderRadius: 3, textAlign: 'center', bgcolor: 'background.paper' }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                  BATCH READINESS SHIFT
                </Typography>
                <Typography variant="h2" sx={{ fontWeight: 800, my: 0.5, color: 'secondary.main' }}>
                  +{simulationResult.readiness_delta}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {simulationResult.current_average_readiness} → {simulationResult.projected_average_readiness} avg
                </Typography>
              </Card>
            </Grid>
          </Grid>

          {/* Distribution Shift (Before vs After) */}
          <Card sx={{ p: 3.5, borderRadius: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
              BATCH READINESS TIER DISTRIBUTION: BEFORE VS AFTER
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Visualizing how students in intermediate preparation tiers migrate into Placement Ready brackets.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {simulationResult.skill_distribution.map((tier) => {
                const total = tier.current_count + tier.projected_count || 1;
                return (
                  <Box key={tier.tier} sx={{ p: 2, borderRadius: 2, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        Tier: {tier.tier}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          Current: <strong>{tier.current_count} students</strong>
                        </Typography>
                        <Typography variant="caption" color="primary.main" sx={{ fontWeight: 700 }}>
                          Projected: <strong>{tier.projected_count} students</strong>
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(100, (tier.projected_count / 200) * 100)}
                        sx={{ flex: 1, height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Card>

          {/* Department Breakdown Table */}
          <Card sx={{ p: 3.5, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                  DEPARTMENTAL IMPACT PROJECTION
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Projected candidate qualification increases grouped by department
                </Typography>
              </Box>
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: 'action.hover' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Department</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Current Eligible</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Projected Eligible</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Newly Qualified</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {simulationResult.department_breakdown.map((row) => (
                    <TableRow key={row.department}>
                      <TableCell sx={{ fontWeight: 700 }}>{row.department}</TableCell>
                      <TableCell align="center">{row.current_eligible}</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {row.projected_eligible}
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 800, color: 'success.main' }}>
                        +{row.increase}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Box>
      ) : (
        /* Empty State */
        <Card sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              bgcolor: 'primary.light',
              color: 'primary.main',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <Sliders size={28} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
            Ready to Simulate Intervention
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto', mb: 3 }}>
            Select a target company and proposed skill bootcamp above, then click <strong>"Run Simulation Projection"</strong> to forecast batch readiness shifts.
          </Typography>
          <Button variant="contained" onClick={handleRunSimulation} startIcon={<Sparkles size={16} />}>
            Run Sample DSA Bootcamp Simulation
          </Button>
        </Card>
      )}
    </Box>
  );
};
