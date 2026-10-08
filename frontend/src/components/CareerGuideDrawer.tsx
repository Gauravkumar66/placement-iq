import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Chip,
  Paper,
  CircularProgress,
  Divider,
} from '@mui/material';
import { X, Send, Sparkles, Bot, UserCheck } from 'lucide-react';
import { apiClient } from '../services/api/client';
import { APIResponse } from '../types/api';

interface CareerGuideDrawerProps {
  open: boolean;
  onClose: () => void;
}

interface Message {
  sender: 'user' | 'assistant';
  text: string;
}

export const CareerGuideDrawer: React.FC<CareerGuideDrawerProps> = ({ open, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: "Hello! I am your Placement IQ Career Guide. I analyze your verified skills, projects, and assessments to give you evidence-based guidance. What would you like to explore today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const suggestedPrompts = [
    'Why is my readiness low?',
    'What should I learn this week?',
    'Which jobs am I eligible for?',
    'How can I improve my resume?',
    'What are my biggest skill gaps?',
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    setMessages((prev) => [...prev, { sender: 'user', text: textToSend }]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const res = await apiClient.post<APIResponse<{ response: string }>>('/assistant/query', {
        query: textToSend,
      });
      setMessages((prev) => [
        ...prev,
        { sender: 'assistant', text: res.data.data.response },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Unable to reach the assistant service right now. Your profile data remains safe. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 440 },
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          p: 0,
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              display: 'flex',
            }}
          >
            <Sparkles size={18} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Career Guide
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Evidence-based career advisory
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small">
          <X size={20} />
        </IconButton>
      </Box>

      {/* Suggested Chips */}
      <Box sx={{ p: 2, bgcolor: 'background.default', borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          SUGGESTED QUESTIONS
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
          {suggestedPrompts.map((prompt) => (
            <Chip
              key={prompt}
              label={prompt}
              size="small"
              onClick={() => handleSend(prompt)}
              clickable
              variant="outlined"
              sx={{ fontSize: '0.75rem', borderRadius: 2 }}
            />
          ))}
        </Box>
      </Box>

      {/* Messages Scroll Area */}
      <Box
        sx={{
          flex: 1,
          p: 2.5,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {messages.map((m, idx) => (
          <Box
            key={idx}
            sx={{
              alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: m.sender === 'user' ? 'primary.main' : 'background.paper',
                color: m.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                border: m.sender === 'user' ? 'none' : 1,
                borderColor: 'divider',
              }}
            >
              <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                {m.text}
              </Typography>
            </Paper>
          </Box>
        ))}
        {loading && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'text.secondary', p: 1 }}>
            <CircularProgress size={16} />
            <Typography variant="caption">Consulting your skill profile & roadmap...</Typography>
          </Box>
        )}
      </Box>

      {/* Input Field */}
      <Box
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          display: 'flex',
          gap: 1,
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Ask about readiness, skill gaps, or jobs..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button
          variant="contained"
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          sx={{ minWidth: 48, px: 2, borderRadius: 2 }}
        >
          <Send size={16} />
        </Button>
      </Box>
    </Drawer>
  );
};
