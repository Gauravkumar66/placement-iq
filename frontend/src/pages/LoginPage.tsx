import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider,
  Alert,
  CircularProgress,
  Chip,
  Grid,
} from '@mui/material';
import { GraduationCap, Sparkles, Shield, User, Building, Compass } from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';
import { UserRole } from '../types/auth';

export const LoginPage: React.FC = () => {
  const { login, quickDemoLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const user = await login(email, password);
      redirectByRole(user.role);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: UserRole) => {
    setError(null);
    setLoading(true);
    try {
      const user = await quickDemoLogin(role);
      redirectByRole(user.role);
    } catch (err: any) {
      setError('Demo login failed. Make sure backend service is running.');
    } finally {
      setLoading(false);
    }
  };

  const redirectByRole = (role: string) => {
    if (role === 'STUDENT') navigate('/student/dashboard');
    else if (role === 'TPO') navigate('/tpo/dashboard');
    else if (role === 'RECRUITER') navigate('/recruiter/dashboard');
    else navigate('/student/dashboard');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: { xs: 2, sm: 4 },
      }}
    >
      <Card
        sx={{
          maxWidth: 500,
          width: '100%',
          p: { xs: 2, sm: 3 },
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
        }}
      >
        <CardContent>
          {/* Logo & Headline */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: '16px',
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1.5,
              }}
            >
              <GraduationCap size={28} />
            </Box>
            <Typography variant="h4" fontWeight={800} color="text.primary">
              PLACEMENT IQ
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Evidence-based Career & Placement Intelligence
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* Form */}
          <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Email Address"
              type="email"
              fullWidth
              size="small"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. student@example.com"
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              size="small"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ mt: 1, py: 1.2, fontWeight: 700 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              OR EXPLORE DEMO PROFILES
            </Typography>
          </Divider>

          {/* 1-Click Demo Buttons */}
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5, textAlign: 'center' }}>
            Click any role to test with verified sample accounts (Password: <code>Password123!</code>):
          </Typography>

          <Grid container spacing={1.5}>
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => handleDemoLogin('STUDENT')}
                disabled={loading}
                startIcon={<User size={16} />}
                sx={{
                  justifyContent: 'flex-start',
                  py: 1,
                  fontSize: '0.82rem',
                  borderColor: 'primary.main',
                  color: 'primary.main',
                }}
              >
                Student (Aarav)
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => handleDemoLogin('TPO')}
                disabled={loading}
                startIcon={<Shield size={16} />}
                sx={{
                  justifyContent: 'flex-start',
                  py: 1,
                  fontSize: '0.82rem',
                  borderColor: 'secondary.main',
                  color: 'secondary.main',
                }}
              >
                Placement Officer (TPO)
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => handleDemoLogin('RECRUITER')}
                disabled={loading}
                startIcon={<Building size={16} />}
                sx={{
                  justifyContent: 'flex-start',
                  py: 1,
                  fontSize: '0.82rem',
                }}
              >
                Recruiter (Nexus)
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => handleDemoLogin('ADMIN')}
                disabled={loading}
                startIcon={<Sparkles size={16} />}
                sx={{
                  justifyContent: 'flex-start',
                  py: 1,
                  fontSize: '0.82rem',
                }}
              >
                Administrator
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};
