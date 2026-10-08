import { createTheme } from '@mui/material/styles';
import { m3Tokens } from './tokens';

export const getM3Theme = (mode: 'light' | 'dark') => {
  const t = mode === 'light' ? m3Tokens.light : m3Tokens.dark;

  return createTheme({
    palette: {
      mode,
      primary: {
        main: t.primary,
        contrastText: t.onPrimary,
      },
      secondary: {
        main: t.secondary,
        contrastText: t.onSecondary,
      },
      background: {
        default: t.surface,
        paper: t.surfaceContainer,
      },
      text: {
        primary: t.onSurface,
        secondary: t.onSurfaceVariant,
      },
      error: {
        main: t.error,
        contrastText: t.onError,
      },
      warning: {
        main: t.warning,
        contrastText: t.onWarning,
      },
      info: {
        main: t.info,
        contrastText: t.onInfo,
      },
      success: {
        main: t.success,
        contrastText: t.onSuccess,
      },
      divider: t.outlineVariant,
    },
    shape: {
      borderRadius: 16,
    },
    typography: {
      fontFamily: m3Tokens.typography.fontFamily,
      h1: {
        fontSize: '2.5rem',
        fontWeight: 700,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 700,
        letterSpacing: '-0.015em',
      },
      h3: {
        fontSize: '1.625rem',
        fontWeight: 600,
        letterSpacing: '-0.01em',
      },
      h4: {
        fontSize: '1.375rem',
        fontWeight: 600,
      },
      h5: {
        fontSize: '1.15rem',
        fontWeight: 600,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
      },
      body1: {
        fontSize: '0.95rem',
        lineHeight: 1.6,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.5,
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
        letterSpacing: '0.01em',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 24,
            padding: '8px 20px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: mode === 'light' ? '0 2px 6px rgba(0,0,0,0.08)' : '0 2px 6px rgba(0,0,0,0.3)',
            },
          },
          contained: {
            backgroundColor: t.primary,
            color: t.onPrimary,
            '&:hover': {
              backgroundColor: t.primary,
              filter: 'brightness(1.08)',
            },
          },
          outlined: {
            borderColor: t.outlineVariant,
            '&:hover': {
              backgroundColor: mode === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)',
              borderColor: t.primary,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            backgroundColor: mode === 'light' ? '#FFFFFF' : t.surfaceContainer,
            border: `1px solid ${t.outlineVariant}40`,
            boxShadow: mode === 'light' 
              ? '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)' 
              : '0 1px 3px rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'light' ? 'rgba(253, 252, 251, 0.85)' : 'rgba(17, 19, 21, 0.85)',
            backdropFilter: 'blur(12px)',
            color: t.onSurface,
            boxShadow: 'none',
            borderBottom: `1px solid ${t.outlineVariant}30`,
          },
        },
      },
    },
  });
};
