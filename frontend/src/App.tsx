import React, { useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getM3Theme } from './theme/theme';
import { AuthProvider, useAuth } from './features/auth/AuthContext';
import { ProtectedRoute } from './features/auth/ProtectedRoute';
import { AppShell } from './layouts/AppShell';

import { LoginPage } from './pages/LoginPage';
import { StudentDashboardPage } from './pages/StudentDashboardPage';
import { StudentSkillsPage } from './pages/StudentSkillsPage';
import { StudentJobsPage } from './pages/StudentJobsPage';
import { StudentPlanPage } from './pages/StudentPlanPage';
import { StudentAssessmentsPage } from './pages/StudentAssessmentsPage';

import { TPODashboardPage } from './pages/TPODashboardPage';
import { TPOStudentsPage } from './pages/TPOStudentsPage';
import { TPOHeatmapPage } from './pages/TPOHeatmapPage';
import { TPOSimulatorPage } from './pages/TPOSimulatorPage';

import { RecruiterDashboardPage } from './pages/RecruiterDashboardPage';
import { RecruiterCandidatesPage } from './pages/RecruiterCandidatesPage';
import { RecruiterJobsPage } from './pages/RecruiterJobsPage';

import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { NotFoundPage } from './pages/NotFoundPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const RoleRootRedirect: React.FC = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'STUDENT') return <Navigate to="/student/dashboard" replace />;
  if (user.role === 'TPO') return <Navigate to="/tpo/dashboard" replace />;
  if (user.role === 'RECRUITER') return <Navigate to="/recruiter/dashboard" replace />;
  return <Navigate to="/student/dashboard" replace />;
};

export const App: React.FC = () => {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme_mode') as 'light' | 'dark') || 'light';
  });

  const toggleTheme = () => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme_mode', next);
      return next;
    });
  };

  const theme = useMemo(() => getM3Theme(mode), [mode]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              {/* Protected App Shell */}
              <Route
                element={
                  <ProtectedRoute>
                    <AppShell mode={mode} onToggleTheme={toggleTheme} />
                  </ProtectedRoute>
                }
              >
                <Route path="/" element={<RoleRootRedirect />} />

                {/* Student Views */}
                <Route
                  path="/student/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
                      <StudentDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/skills"
                  element={
                    <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
                      <StudentSkillsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/jobs"
                  element={
                    <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
                      <StudentJobsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/plan"
                  element={
                    <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
                      <StudentPlanPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/assessments"
                  element={
                    <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
                      <StudentAssessmentsPage />
                    </ProtectedRoute>
                  }
                />

                {/* TPO Views */}
                <Route
                  path="/tpo/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['TPO', 'ADMIN']}>
                      <TPODashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tpo/students"
                  element={
                    <ProtectedRoute allowedRoles={['TPO', 'ADMIN']}>
                      <TPOStudentsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tpo/heatmap"
                  element={
                    <ProtectedRoute allowedRoles={['TPO', 'ADMIN']}>
                      <TPOHeatmapPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tpo/simulator"
                  element={
                    <ProtectedRoute allowedRoles={['TPO', 'ADMIN']}>
                      <TPOSimulatorPage />
                    </ProtectedRoute>
                  }
                />

                {/* Recruiter Views */}
                <Route
                  path="/recruiter/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['RECRUITER', 'ADMIN']}>
                      <RecruiterDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recruiter/candidates"
                  element={
                    <ProtectedRoute allowedRoles={['RECRUITER', 'ADMIN']}>
                      <RecruiterCandidatesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recruiter/jobs"
                  element={
                    <ProtectedRoute allowedRoles={['RECRUITER', 'ADMIN']}>
                      <RecruiterJobsPage />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* 404 Fallback */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
