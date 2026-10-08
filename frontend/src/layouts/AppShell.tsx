import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
  Menu,
  MenuItem,
  Divider,
  Fab,
  Tooltip,
  useMediaQuery,
  useTheme,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from '@mui/material';
import {
  Compass,
  Briefcase,
  Layers,
  GraduationCap,
  Users,
  Building,
  Target,
  Sparkles,
  Sun,
  Moon,
  LogOut,
  User as UserIcon,
  Bell,
  Sliders,
  CheckCircle,
  BarChart3,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';
import { CareerGuideDrawer } from '../components/CareerGuideDrawer';

interface AppShellProps {
  mode: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const AppShell: React.FC<AppShellProps> = ({ mode, onToggleTheme }) => {
  const { user, logout, quickDemoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [roleMenuEl, setRoleMenuEl] = useState<null | HTMLElement>(null);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseUserMenu = () => setAnchorEl(null);

  const handleRoleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setRoleMenuEl(event.currentTarget);
  };
  const handleCloseRoleMenu = () => setRoleMenuEl(null);

  const handleSwitchRole = async (targetRole: 'STUDENT' | 'TPO' | 'RECRUITER' | 'ADMIN') => {
    handleCloseRoleMenu();
    await quickDemoLogin(targetRole);
    if (targetRole === 'STUDENT') navigate('/student/dashboard');
    else if (targetRole === 'TPO') navigate('/tpo/dashboard');
    else if (targetRole === 'RECRUITER') navigate('/recruiter/dashboard');
  };

  // Nav items per role
  const getNavItems = () => {
    if (user?.role === 'STUDENT') {
      return [
        { label: 'Overview', path: '/student/dashboard', icon: <Compass size={20} /> },
        { label: 'Skills & Evidence', path: '/student/skills', icon: <Layers size={20} /> },
        { label: 'Job Matches', path: '/student/jobs', icon: <Briefcase size={20} /> },
        { label: 'Preparation Plan', path: '/student/plan', icon: <BookOpen size={20} /> },
        { label: 'Assessments', path: '/student/assessments', icon: <CheckCircle size={20} /> },
      ];
    } else if (user?.role === 'TPO') {
      return [
        { label: 'Overview', path: '/tpo/dashboard', icon: <BarChart3 size={20} /> },
        { label: 'Student Batch', path: '/tpo/students', icon: <Users size={20} /> },
        { label: 'Skill Heatmap', path: '/tpo/heatmap', icon: <Layers size={20} /> },
        { label: 'What-If Simulator', path: '/tpo/simulator', icon: <Sliders size={20} /> },
      ];
    } else {
      // Recruiter
      return [
        { label: 'Overview', path: '/recruiter/dashboard', icon: <BarChart3 size={20} /> },
        { label: 'Matched Candidates', path: '/recruiter/candidates', icon: <Users size={20} /> },
        { label: 'Open Jobs', path: '/recruiter/jobs', icon: <Briefcase size={20} /> },
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Top App Bar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.2,
                cursor: 'pointer',
              }}
              onClick={() => {
                if (user?.role === 'STUDENT') navigate('/student/dashboard');
                else if (user?.role === 'TPO') navigate('/tpo/dashboard');
                else navigate('/recruiter/dashboard');
              }}
            >
              <Box
                sx={{
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  p: 0.9,
                  borderRadius: '12px',
                  display: 'flex',
                }}
              >
                <GraduationCap size={22} />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.1 }}>
                  PLACEMENT IQ
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
                  Career & Placement Intelligence
                </Typography>
              </Box>
            </Box>

            {/* Role Badge */}
            {user && (
              <Chip
                label={user.role}
                size="small"
                color={user.role === 'STUDENT' ? 'primary' : user.role === 'TPO' ? 'secondary' : 'default'}
                sx={{ fontWeight: 700, borderRadius: '8px', ml: 1, display: { xs: 'none', md: 'inline-flex' } }}
              />
            )}
          </Box>

          {/* Right actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Quick Demo Switcher */}
            <Button
              variant="outlined"
              size="small"
              onClick={handleRoleMenuClick}
              sx={{
                borderRadius: '12px',
                px: 1.5,
                py: 0.5,
                fontSize: '0.8rem',
                display: { xs: 'none', sm: 'flex' },
              }}
            >
              Demo Role: {user?.role}
            </Button>
            <Menu anchorEl={roleMenuEl} open={Boolean(roleMenuEl)} onClose={handleCloseRoleMenu}>
              <MenuItem onClick={() => handleSwitchRole('STUDENT')}>Switch to Student (Aarav)</MenuItem>
              <MenuItem onClick={() => handleSwitchRole('TPO')}>Switch to TPO (Batch Officer)</MenuItem>
              <MenuItem onClick={() => handleSwitchRole('RECRUITER')}>Switch to Recruiter (Nexus)</MenuItem>
            </Menu>

            {/* Theme Toggle */}
            <Tooltip title={`Switch to ${mode === 'light' ? 'Dark' : 'Light'} Mode`}>
              <IconButton onClick={onToggleTheme} color="inherit" size="small">
                {mode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </IconButton>
            </Tooltip>

            {/* User Profile */}
            <Tooltip title="Account menu">
              <IconButton onClick={handleUserMenuClick} size="small" sx={{ ml: 0.5 }}>
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                  }}
                >
                  {user?.full_name ? user.full_name[0] : user?.email[0].toUpperCase()}
                </Box>
              </IconButton>
            </Tooltip>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseUserMenu}>
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  {user?.full_name || user?.email}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Role: {user?.role}
                </Typography>
              </Box>
              <Divider />
              <MenuItem onClick={() => { handleCloseUserMenu(); logout(); navigate('/login'); }}>
                <ListItemIcon>
                  <LogOut size={16} />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Desktop / Tablet Sidebar Navigation */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: isTablet ? 72 : 240,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: isTablet ? 72 : 240,
              boxSizing: 'border-box',
              borderRight: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
              pt: 9,
            },
          }}
        >
          <List sx={{ px: 1.5, py: 2 }}>
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <ListItem key={item.path} disablePadding sx={{ mb: 0.8 }}>
                  <ListItemButton
                    onClick={() => navigate(item.path)}
                    selected={active}
                    sx={{
                      borderRadius: '12px',
                      py: 1.2,
                      px: isTablet ? 1.5 : 2,
                      justifyContent: isTablet ? 'center' : 'initial',
                      bgcolor: active ? 'primary.main' : 'transparent',
                      color: active ? 'primary.contrastText' : 'text.primary',
                      '&:hover': {
                        bgcolor: active ? 'primary.main' : 'action.hover',
                      },
                      '&.Mui-selected': {
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        '&:hover': {
                          bgcolor: 'primary.main',
                        },
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: isTablet ? 0 : 2,
                        justifyContent: 'center',
                        color: active ? 'primary.contrastText' : 'inherit',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {!isTablet && (
                      <ListItemText
                        primary={
                          <Typography sx={{ fontSize: '0.88rem', fontWeight: active ? 600 : 500 }}>
                            {item.label}
                          </Typography>
                        }
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Drawer>
      )}

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          pt: { xs: 9, sm: 10, md: 11 },
          pb: { xs: 10, sm: 4 }, // space for mobile bottom nav
          minHeight: '100vh',
          width: { sm: `calc(100% - ${isTablet ? 72 : 240}px)` },
        }}
      >
        <Outlet />
      </Box>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <Paper
          sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }}
          elevation={4}
        >
          <BottomNavigation
            value={location.pathname}
            onChange={(_, newValue) => navigate(newValue)}
            showLabels
          >
            {navItems.slice(0, 4).map((item) => (
              <BottomNavigationAction
                key={item.path}
                label={item.label}
                value={item.path}
                icon={item.icon}
              />
            ))}
          </BottomNavigation>
        </Paper>
      )}

      {/* Floating Career Guide Button */}
      {user?.role === 'STUDENT' && (
        <Tooltip title="Ask Career Guide AI" placement="left">
          <Fab
            color="primary"
            onClick={() => setAssistantOpen(true)}
            sx={{
              position: 'fixed',
              bottom: { xs: 72, sm: 28 },
              right: 28,
              boxShadow: '0 6px 18px rgba(11,87,208,0.35)',
              zIndex: 1100,
            }}
          >
            <Sparkles size={22} />
          </Fab>
        </Tooltip>
      )}

      {/* Career Guide AI Side Drawer */}
      <CareerGuideDrawer open={assistantOpen} onClose={() => setAssistantOpen(false)} />
    </Box>
  );
};
