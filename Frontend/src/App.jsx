import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/layout/Navbar/Navbar';
import LandingPage from './pages/LandingPage/LandingPage';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';

import PageContainer from './components/layout/PageContainer/PageContainer';
import Dashboard from './pages/Dashboard/Dashboard';
import Card from './components/ui/Card/Card';
import Button from './components/ui/Button/Button';
import { mockDashboardData } from './utils/mockDashboardData';
import {
  TasksIcon,
  MembersIcon,
  ActivityIcon,
  SettingsIcon,
} from './assets/icons';

import './index.css';


function DashboardLayout() {
  const [activeRoute, setActiveRoute] = useState('dashboard');
  const [dashboardData] = useState(mockDashboardData);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleNavigate = (routeId) => {
    if (routeId === 'logout') {
      showToast('Logged out of DevTrack');
      return;
    }

    setActiveRoute(routeId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInviteClick = () => {
    showToast(
      `Invite link generated for ${dashboardData.room.name} (${dashboardData.room.code})!`
    );
  };

  const renderPlaceholderView = (title, icon, description) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Card style={{ textAlign: 'center', padding: '64px 24px' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(46, 204, 113, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          {icon}
        </div>

        <h2
          style={{
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '8px',
          }}
        >
          {title}
        </h2>

        <p
          style={{
            color: 'var(--text-secondary)',
            maxWidth: '480px',
            margin: '0 auto 24px',
          }}
        >
          {description}
        </p>

        <Button
          variant="primary"
          onClick={() => setActiveRoute('dashboard')}
        >
          Back to Dashboard
        </Button>
      </Card>
    </div>
  );

  return (
    <PageContainer>
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            padding: '14px 24px',
            backgroundColor: 'var(--accent-primary)',
            color: '#0F1417',
            borderRadius: 'var(--radius-md)',
            fontWeight: '600',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 1000,
          }}
        >
          {toastMessage}
        </div>
      )}

      {activeRoute === 'dashboard' && (
        <Dashboard
          data={dashboardData}
          onNavigate={handleNavigate}
          onInviteClick={handleInviteClick}
        />
      )}

      {activeRoute === 'tasks' &&
        renderPlaceholderView(
          'Tasks Management Page',
          <TasksIcon size={32} color="var(--accent-primary)" />,
          'The full Tasks view is ready to be linked with task filters, Kanban boards, and drag-and-drop orchestration.'
        )}

      {activeRoute === 'members' &&
        renderPlaceholderView(
          'Team Members Roster',
          <MembersIcon size={32} color="var(--accent-primary)" />,
          'Manage room invitations, roles, permissions, and workload allocation across team members.'
        )}

      {activeRoute === 'activity' &&
        renderPlaceholderView(
          'Full Activity Log',
          <ActivityIcon size={32} color="var(--accent-primary)" />,
          'Comprehensive audit timeline for all room changes, commit links, and task transitions.'
        )}

      {activeRoute === 'settings' &&
        renderPlaceholderView(
          'Room Settings',
          <SettingsIcon size={32} color="var(--accent-primary)" />,
          'Configure room details, notification preferences, integration webhooks, and archive settings.'
        )}
    </PageContainer>
  );
}


function Layout() {
  const { pathname } = useLocation();

  const showNavbar = pathname === '/';

  return (
    <>
      {showNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<DashboardLayout />} />
      </Routes>
    </>
  );
}


function App() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('devtrack-theme');

    if (saved) return saved;

    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('devtrack-theme', theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
export default App;