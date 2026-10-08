import React from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleReturn = () => {
    if (user?.role === 'STUDENT') navigate('/student/dashboard');
    else if (user?.role === 'TPO') navigate('/tpo/dashboard');
    else if (user?.role === 'RECRUITER') navigate('/recruiter/dashboard');
    else navigate('/login');
  };

  return (
    <Box
      sx={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}
    >
      <Card sx={{ maxWidth: 460, textAlign: 'center', p: 3, borderRadius: 4 }}>
        <CardContent>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              bgcolor: 'error.light',
              color: 'error.main',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <ShieldAlert size={32} />
          </Box>
          <Typography variant="h5" fontWeight={800} gutterBottom>
            Access Restricted
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            You do not have permission to view this resource with your current role ({user?.role || 'Guest'}).
          </Typography>
          <Button variant="contained" onClick={handleReturn} startIcon={<ArrowLeft size={16} />}>
            Return to Authorized Dashboard
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};
