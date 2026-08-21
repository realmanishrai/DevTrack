import Members from './pages/Members/Members';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom';
import Navbar from './components/layout/Navbar/Navbar';
import LandingPage from './pages/LandingPage/LandingPage';
import Login from './pages/Login/Login';
import { logoutUser ,  getCurrentUser } from './api';
import { clearLpAuthTokens } from './loginAuth/lpAuthStorage';
import Register from './pages/Register/Register';
import Profile from './pages/Profile/Profile';

import PageContainer from './components/layout/PageContainer/PageContainer';
import Dashboard from './pages/Dashboard/Dashboard';
import Tasks from './pages/Tasks/Tasks';
import Rooms from './pages/Rooms/Rooms';
import DtCard from './components/ui/DtCard/DtCard';
import DtButton from './components/ui/DtButton/DtButton';
import { mockDashboardData } from './utils/mockDashboardData';
import apiRequest, { getRoomTasks, createTask, updateTask, deleteTask } from './api';
import { mapBackendRoomsListToUi } from './utils/roomAdapter';
import {
  mapBackendTasksListToUi,
  computeDashboardStatsFromTasks,
} from './utils/taskAdapter';
import {
  TasksIcon,
  MembersIcon,
  ActivityIcon,
  SettingsIcon,
} from './assets/icons';

import './index.css';

function DashboardLayout({ theme, onToggleTheme }) {
  const { roomCode } = useParams();
  const [activeRoute, setActiveRoute] = useState('dashboard');
  const [currentRoom, setCurrentRoom] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const navigate = useNavigate();

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const fetchDashboardData = useCallback(async () => {
    if (!roomCode) return;
    setIsLoading(true);
    setDashboardError(null);

    try {
      const [rawTasks, rawRooms] = await Promise.all([
        getRoomTasks(roomCode),
        apiRequest({
          url: '/roomlist',
          method: 'GET',
        }),
      ]);

      const adaptedTasks = mapBackendTasksListToUi(rawTasks);
      setTasks(adaptedTasks);

      const adaptedRooms = mapBackendRoomsListToUi(rawRooms);
      const matchedRoom = adaptedRooms.find(
        (r) => r.roomCode === roomCode
      );
      setCurrentRoom(matchedRoom || null);
    } catch (err) {
      if (err?.status === 401) {
        navigate('/login');
        return;
      }
      setDashboardError(
        err?.data?.detail || err?.message || 'Failed to load room data.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [roomCode, navigate]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const dashboardData = useMemo(() => {
    const computedStats = computeDashboardStatsFromTasks(
      tasks,
      mockDashboardData.members
    );

    return {
      ...mockDashboardData,
      room: {
        ...mockDashboardData.room,
        id: currentRoom?.id ?? mockDashboardData.room.id,
        name: currentRoom?.name || (isLoading ? 'Loading...' : `Room ${roomCode}`),
        description: currentRoom?.description !== undefined
          ? currentRoom.description
          : (isLoading ? '' : ''),
        code: roomCode || mockDashboardData.room.code,
        roomCode: roomCode || mockDashboardData.room.code,
      },
      tasks,
      progressStats: computedStats.progressStats,
      statCards: computedStats.statCards,
      statusSummary: computedStats.statusSummary,
    };
  }, [tasks, currentRoom, roomCode, isLoading]);

  const handleTaskCreate = async (taskFormData) => {
    try {
      const assigneeIds = [];
      if (taskFormData.assigneeId) {
        const parsedId = parseInt(taskFormData.assigneeId, 10);
        if (!isNaN(parsedId) && String(parsedId) === String(taskFormData.assigneeId)) {
          assigneeIds.push(parsedId);
        }
      }

      const payload = {
        title: taskFormData.title.trim(),
        description: taskFormData.description ? taskFormData.description.trim() : '',
        status: taskFormData.status || 'not_started',
        progress: typeof taskFormData.progress === 'number' ? taskFormData.progress : 0,
        priority: taskFormData.priority || 'medium',
        due_date: taskFormData.dueDate || new Date().toISOString().split('T')[0],
        assignee_ids: assigneeIds,
      };

      await createTask(roomCode, payload);
      showToast(`Task '${payload.title}' created successfully!`);
      await fetchDashboardData();
      return { success: true };
    } catch (err) {
      if (err?.status === 401) {
        navigate('/login');
        return { success: false, error: 'Session expired. Please log in again.' };
      }
      const detail = err?.data?.detail || err?.message || 'Failed to create task.';
      showToast(`Error: ${detail}`);
      return { success: false, error: detail };
    }
  };

  const handleTaskUpdate = async (taskId, updatedFields) => {
    try {
      const payload = {};

      if (updatedFields.title !== undefined) {
        payload.title = updatedFields.title.trim();
      }
      if (updatedFields.description !== undefined) {
        payload.description = updatedFields.description ? updatedFields.description.trim() : '';
      }
      if (updatedFields.status !== undefined) {
        payload.status = updatedFields.status;
      }
      if (updatedFields.progress !== undefined) {
        payload.progress = typeof updatedFields.progress === 'number'
          ? updatedFields.progress
          : parseInt(updatedFields.progress, 10) || 0;
      }
      if (updatedFields.priority !== undefined) {
        payload.priority = updatedFields.priority;
      }
      if (updatedFields.dueDate !== undefined) {
        payload.due_date = updatedFields.dueDate || null;
      } else if (updatedFields.due_date !== undefined) {
        payload.due_date = updatedFields.due_date || null;
      }

      if (updatedFields.assigneeIds !== undefined) {
        payload.assignee_ids = Array.isArray(updatedFields.assigneeIds)
          ? updatedFields.assigneeIds.map(Number).filter((n) => !isNaN(n))
          : [];
      } else if (updatedFields.assignee_ids !== undefined) {
        payload.assignee_ids = Array.isArray(updatedFields.assignee_ids)
          ? updatedFields.assignee_ids.map(Number).filter((n) => !isNaN(n))
          : [];
      } else if (updatedFields.assigneeId !== undefined) {
        const parsedId = parseInt(updatedFields.assigneeId, 10);
        if (!isNaN(parsedId) && String(parsedId) === String(updatedFields.assigneeId)) {
          payload.assignee_ids = [parsedId];
        }
      }

      const numericTaskId = parseInt(taskId, 10);
      await updateTask(roomCode, isNaN(numericTaskId) ? taskId : numericTaskId, payload);
      showToast('Task updated successfully!');
      await fetchDashboardData();
      return { success: true };
    } catch (err) {
      if (err?.status === 401) {
        navigate('/login');
        return { success: false, error: 'Session expired. Please log in again.' };
      }
      const detail = err?.data?.detail || err?.message || 'Failed to update task.';
      showToast(`Error: ${detail}`);
      return { success: false, error: detail };
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      const numericTaskId = parseInt(taskId, 10);
      await deleteTask(roomCode, isNaN(numericTaskId) ? taskId : numericTaskId);
      showToast('Task deleted successfully!');
      await fetchDashboardData();
      return { success: true };
    } catch (err) {
      if (err?.status === 401) {
        navigate('/login');
        return { success: false, error: 'Session expired. Please log in again.' };
      }
      const detail = err?.data?.detail || err?.message || 'Failed to delete task.';
      showToast(`Error: ${detail}`);
      return { success: false, error: detail };
    }
  };

  const handleNavigate = async (routeId) => {
    if (routeId === 'logout') {
      try {
        await logoutUser();
        clearLpAuthTokens();
        sessionStorage.setItem('justLoggedOut', 'true');
        showToast('Logged out of DevTrack');
        navigate('/');
      } catch (error) {
          console.error('Logout failed:', error);
          // Clear tokens even if logout request fails
          clearLpAuthTokens();
          showToast('Logout failed. Please try again.');
        }
        return;
    }

    if (routeId === 'landing') {
      navigate('/');
      return;
    }

    if (routeId === 'members') {
      navigate('/members');
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

  const getPageTitle = () => {
    switch (activeRoute) {
      case 'dashboard': return 'Room Overview';
      case 'tasks': return 'Tasks Board';
      case 'members': return 'Team Members';
      case 'activity': return 'Activity Log';
      case 'settings': return 'Room Settings';
      default: return 'Dashboard';
    }
  };

  const renderPlaceholderView = (title, icon, description) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <DtCard style={{ textAlign: 'center', padding: '64px 24px' }}>
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

        <DtButton
          variant="primary"
          onClick={() => setActiveRoute('dashboard')}
        >
          Back to Dashboard
        </DtButton>
      </DtCard>
    </div>
  );

  return (
    <PageContainer
      activeRoute={activeRoute}
      onNavigate={handleNavigate}
      pageTitle={getPageTitle()}
      room={dashboardData.room}
      currentUser={dashboardData.currentUser}
      theme={theme}
      onToggleTheme={onToggleTheme}
    >
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

      {activeRoute === 'tasks' && (
        <Tasks
          data={dashboardData}
          onTaskCreate={handleTaskCreate}
          onTaskUpdate={handleTaskUpdate}
          onTaskDelete={handleTaskDelete}
        />
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

function Layout({ theme, onToggleTheme }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const showNavbar = pathname === '/';

  return (
    <>
      {showNavbar && <Navbar theme={theme} onToggleTheme={onToggleTheme} />}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
        path="/profile"
        element={
          <Profile
          theme={theme}
          onToggleTheme={onToggleTheme}
          />
        }
        />

        <Route
          path="/rooms"
          element={
            <Rooms
              theme={theme}
              onToggleTheme={onToggleTheme}
            />
          }
        />

      <Route
  path="/members"
  element={
    <PageContainer
      activeRoute="members"
      onNavigate={(routeId) => {
        if (routeId === 'members') return;

        if (routeId === 'landing') {
          navigate('/');
          return;
        }

        navigate('/dashboard');
      }}
      pageTitle="Team Members"
      currentUser={mockDashboardData.currentUser}
      theme={theme}
      onToggleTheme={onToggleTheme}
    >
      <Members />
    </PageContainer>
  }
/>
        <Route
          path="/rooms/:roomCode/dashboard"
          element={
            <DashboardLayout
              theme={theme}
              onToggleTheme={onToggleTheme}
            />
          }
        />
        {/* Fallback to Landing page for unknown paths */}
        <Route path="*" element={<LandingPage />} />
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

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('devtrack-theme', theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <Layout theme={theme} onToggleTheme={toggleTheme} />
    </BrowserRouter>
  );
}

export default App;