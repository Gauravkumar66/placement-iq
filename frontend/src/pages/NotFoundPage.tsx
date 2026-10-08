import React from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { Compass, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

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
              bgcolor: 'primary.light',
              color: 'primary.main',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <Compass size={32} />
          </Box>
          <Typography variant="h5" fontWeight={800} gutterBottom>
            Page Not Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            The requested intelligence view does not exist or has been relocated.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/')} startIcon={<ArrowLeft size={16} />}>
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};
