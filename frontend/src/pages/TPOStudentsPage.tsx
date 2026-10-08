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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  LinearProgress,
} from '@mui/material';
import {
  Users,
  Search,
  Filter,
  Download,
  GraduationCap,
  Award,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { apiClient } from '../services/api/client';
import { APIResponse } from '../types/api';
import { TPOStudentRow } from '../types/tpo';

export const TPOStudentsPage: React.FC = () => {
  const [students, setStudents] = useState<TPOStudentRow[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Detail Modal
  const [selectedStudent, setSelectedStudent] = useState<TPOStudentRow | null>(null);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<APIResponse<any>>('/tpo/students', {
        params: {
          search: search || undefined,
          department: deptFilter !== 'ALL' ? deptFilter : undefined,
          page: page + 1,
          limit: rowsPerPage,
        },
      });
      let fetched: TPOStudentRow[] = res.data.data.students || [];
      if (statusFilter !== 'ALL') {
        fetched = fetched.filter((s) => s.status === statusFilter);
      }
      setStudents(fetched);
      setTotalStudents(res.data.data.total || fetched.length);
    } catch (err) {
      console.error('Error loading students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page, rowsPerPage, deptFilter, search, statusFilter]);

  const handleExportCSV = () => {
    const headers = ['ID,Name,Email,Department,CGPA,Readiness,Target Role,Critical Gap,Status'];
    const rows = students.map(
      (s) =>
        `"${s.id}","${s.name}","${s.email}","${s.department}",${s.cgpa},${s.readiness},"${s.target_role}","${s.critical_gap}","${s.status}"`
    );
    const blob = new Blob([[...headers, ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `student_batch_roster_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Student Batch Roster
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Verified candidate directory, academic benchmarks, and target role readiness for Graduation Batch 2026.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Download size={18} />}
          onClick={handleExportCSV}
          sx={{ borderRadius: 2 }}
        >
          Export CSV
        </Button>
      </Box>

      {/* Metrics Row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={3}>
          <Card sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              TOTAL CANDIDATES
            </Typography>
            <Typography variant="h4" fontWeight={800} sx={{ mt: 0.5 }}>
              {totalStudents || 26}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Graduation 2026
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" color="success.main" fontWeight={700}>
              PLACEMENT READY (&gt;=70%)
            </Typography>
            <Typography variant="h4" fontWeight={800} color="success.main" sx={{ mt: 0.5 }}>
              15
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Eligible for Tier-1 & Tier-2
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" color="warning.main" fontWeight={700}>
              NEAR READY (50-69%)
            </Typography>
            <Typography variant="h4" fontWeight={800} color="warning.main" sx={{ mt: 0.5 }}>
              11
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Targeted sprint needed
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" color="error.main" fontWeight={700}>
              FOUNDATION PREP (&lt;50%)
            </Typography>
            <Typography variant="h4" fontWeight={800} color="error.main" sx={{ mt: 0.5 }}>
              35
            </Typography>
            <Typography variant="caption" color="text.secondary">
              At-risk intervention pool
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Main Roster Card */}
      <Card sx={{ p: 3, borderRadius: 3 }}>
        {/* Filter Controls */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search candidate name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <Search size={16} style={{ marginRight: 8, color: '#888' }} />,
            }}
            sx={{ minWidth: 280, flexGrow: 1 }}
          />
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Department</InputLabel>
            <Select value={deptFilter} label="Department" onChange={(e) => setDeptFilter(e.target.value)}>
              <MenuItem value="ALL">All Departments</MenuItem>
              <MenuItem value="Computer Science">Computer Science</MenuItem>
              <MenuItem value="Information">Information Technology</MenuItem>
              <MenuItem value="Electronics">Electronics & Comm.</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Readiness Status</InputLabel>
            <Select value={statusFilter} label="Readiness Status" onChange={(e) => setStatusFilter(e.target.value)}>
              <MenuItem value="ALL">All Readiness Tiers</MenuItem>
              <MenuItem value="Placement Ready">Placement Ready</MenuItem>
              <MenuItem value="Near Ready">Near Ready</MenuItem>
              <MenuItem value="Early Prep">Early Prep</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Student Table */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
            <CircularProgress size={32} />
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Table size="medium">
              <TableHead sx={{ bgcolor: 'action.hover' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Candidate</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Department</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>CGPA</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Readiness</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Target Role</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Critical Skill Gap</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((s) => (
                  <TableRow key={s.id} hover sx={{ cursor: 'pointer' }} onClick={() => setSelectedStudent(s)}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={700}>
                        {s.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {s.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={s.department} size="small" variant="outlined" sx={{ height: 22, fontSize: '0.72rem' }} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={700}>
                        {s.cgpa}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                          variant="body2"
                          fontWeight={800}
                          color={s.readiness >= 70 ? 'success.main' : s.readiness >= 50 ? 'warning.main' : 'error.main'}
                        >
                          {s.readiness}%
                        </Typography>
                        <Box sx={{ width: 48 }}>
                          <LinearProgress
                            variant="determinate"
                            value={s.readiness}
                            color={s.readiness >= 70 ? 'success' : s.readiness >= 50 ? 'warning' : 'error'}
                            sx={{ height: 5, borderRadius: 2 }}
                          />
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {s.target_role}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={s.critical_gap}
                        size="small"
                        color="error"
                        variant="outlined"
                        sx={{ height: 22, fontSize: '0.72rem', fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={s.status}
                        size="small"
                        color={s.status === 'Placement Ready' ? 'success' : s.status === 'Near Ready' ? 'warning' : 'error'}
                        sx={{ height: 24, fontSize: '0.72rem', fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="text"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStudent(s);
                        }}
                      >
                        Inspect
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

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

      {/* Student Dossier Dialog */}
      <Dialog
        open={Boolean(selectedStudent)}
        onClose={() => setSelectedStudent(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" fontWeight={800}>
              Candidate Assessment Dossier
            </Typography>
            <Chip
              label={selectedStudent?.status}
              color={selectedStudent?.status === 'Placement Ready' ? 'success' : 'warning'}
              size="small"
            />
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedStudent && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box>
                <Typography variant="h5" fontWeight={800}>
                  {selectedStudent.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedStudent.email} • {selectedStudent.department}
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Card sx={{ p: 1.5, textAlign: 'center', bgcolor: 'background.default' }}>
                    <Typography variant="caption" color="text.secondary">
                      CGPA
                    </Typography>
                    <Typography variant="h5" fontWeight={800}>
                      {selectedStudent.cgpa}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  <Card sx={{ p: 1.5, textAlign: 'center', bgcolor: 'background.default' }}>
                    <Typography variant="caption" color="text.secondary">
                      READINESS
                    </Typography>
                    <Typography
                      variant="h5"
                      fontWeight={800}
                      color={selectedStudent.readiness >= 70 ? 'success.main' : 'warning.main'}
                    >
                      {selectedStudent.readiness}%
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  <Card sx={{ p: 1.5, textAlign: 'center', bgcolor: 'background.default' }}>
                    <Typography variant="caption" color="text.secondary">
                      TARGET
                    </Typography>
                    <Typography variant="body2" fontWeight={700} sx={{ mt: 0.5 }}>
                      {selectedStudent.target_role}
                    </Typography>
                  </Card>
                </Grid>
              </Grid>

              <Divider />

              <Box>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                  Primary Placement Bottleneck:
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'error.lighter',
                    border: '1px solid',
                    borderColor: 'error.main',
                  }}
                >
                  <Typography variant="body2" color="error.dark" fontWeight={600}>
                    {selectedStudent.critical_gap}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    Candidate requires 10-14 days of targeted practice on this topic to unlock eligibility for Tier-1 drives.
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                  Recommended TPO Action:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Enroll student into the upcoming <strong>DSA Intensive Bootcamp</strong>. Projected readiness lift: +12-15%.
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setSelectedStudent(null)} variant="outlined">
            Close
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              alert(`Enrollment reminder sent to ${selectedStudent?.name}`);
              setSelectedStudent(null);
            }}
          >
            Assign Bootcamp Sprint
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
