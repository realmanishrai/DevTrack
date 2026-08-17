import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import ProfileMenu from '../../components/layout/ProfileMenu/ProfileMenu';
import IconButton from '../../components/ui/IconButton/IconButton';
import DtButton from '../../components/ui/DtButton/DtButton';
import RmCard from '../../components/ui/RmCard/RmCard';
import RmEmptyState from '../../components/ui/RmEmptyState/RmEmptyState';
import RmCreateRoomModal from '../../components/ui/RmCreateRoomModal/RmCreateRoomModal';
import RmJoinRoomModal from '../../components/ui/RmJoinRoomModal/RmJoinRoomModal';

import { mapBackendRoomsListToUi } from '../../utils/roomAdapter';
import apiRequest, { getCurrentUser } from '../../api';
import {
  PlusIcon,
  UserPlusIcon,
  SunIcon,
  MoonIcon,
  AlertCircleIcon,
} from '../../assets/icons';

import './Rooms.css';

/**
 * Rooms page — lobby screen between Login and a specific Room's Dashboard.
 * Flow: Login → /rooms → select a room → /dashboard
 *
 * Layout: standalone (no Sidebar). Top bar with logo + theme toggle + ProfileMenu.
 */
const Rooms = ({ theme, onToggleTheme }) => {
  const navigate = useNavigate();

  // Rooms and authenticated user state
  const [rooms, setRooms] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Modal visibility
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // ── Fetch Rooms & User from Backend ───────────────────────────────────────
  const fetchRooms = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);

    try {
      // Parallel fetch: room list and user profile
      const [roomsData, userData] = await Promise.all([
        apiRequest({
          url: '/roomlist',
          method: 'GET',
        }),
        getCurrentUser().catch((err) => {
          console.warn('Could not fetch user profile:', err);
          return null;
        }),
      ]);

      const adaptedRooms = mapBackendRoomsListToUi(roomsData);
      setRooms(adaptedRooms);

      if (userData && userData.id) {
        setCurrentUser({
          id: userData.id,
          name: `${userData.firstname || ''} ${userData.lastname || ''}`.trim() || userData.username,
          username: userData.username,
          email: userData.email,
          role: 'admin',
        });
      }
    } catch (err) {
      if (err?.status === 401) {
        // Unrecoverable unauthorized — redirect to login
        navigate('/login');
        return;
      }
      setFetchError(
        err?.message || 'Failed to load rooms. Please check your connection and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // ── Handler: Open Room ────────────────────────────────────────────────────
  const handleOpenRoom = (roomCode) => {
    // TODO (route restructuring): navigate(`/room/${roomCode}/dashboard`) once
    // the nested /room/:roomCode/ route pattern is set up in a future session.
    navigate('/dashboard');
  };

  // ── Handler: Create Room Success ──────────────────────────────────────────
  const handleCreateRoomSuccess = async (createdRoomName) => {
    showToast(`Room "${createdRoomName}" created successfully!`);
    await fetchRooms();
  };

  // ── Handler: Join Request ─────────────────────────────────────────────────
  const handleJoinRequest = (roomCode) => {
    // Join request sent to creator for approval; modal displays confirmation
  };

  // ── Handler: Leave Room ───────────────────────────────────────────────────
  const handleLeaveRoom = async (roomCode) => {
    try {
      await apiRequest({
        url: `/leaveroom/${roomCode}`,
        method: 'DELETE',
      });
      showToast('You have left the room.');
      await fetchRooms();
      return { success: true };
    } catch (err) {
      if (err?.status === 401) {
        navigate('/login');
        return { success: false, error: 'Session expired. Please log in again.' };
      }

      const detail = err?.data?.detail || err?.message || '';

      if (err?.status === 403) {
        if (detail.includes('sole admin')) {
          return {
            success: false,
            error: 'Cannot leave room as the sole admin; assign another admin first',
          };
        }
        return {
          success: false,
          error: detail || 'You are not a member of this room.',
        };
      }

      if (err?.status === 404) {
        return {
          success: false,
          error: 'Room not found. It may have already been removed.',
        };
      }

      return {
        success: false,
        error: detail || 'Failed to leave the room. Please try again.',
      };
    }
  };

  // ── Handler: Delete Room ──────────────────────────────────────────────────
  const handleDeleteRoom = async (roomCode) => {
    try {
      await apiRequest({
        url: `/room/${roomCode}/delete`,
        method: 'DELETE',
      });
      showToast('Room deleted successfully.');
      await fetchRooms();
      return { success: true };
    } catch (err) {
      if (err?.status === 401) {
        navigate('/login');
        return { success: false, error: 'Session expired. Please log in again.' };
      }

      const detail = err?.data?.detail || err?.message || '';

      if (err?.status === 403) {
        return {
          success: false,
          error: "You don't have permission to delete this room.",
        };
      }

      if (err?.status === 404) {
        return {
          success: false,
          error: 'Room not found. It may have already been deleted.',
        };
      }

      return {
        success: false,
        error: detail || 'Failed to delete the room. Please try again.',
      };
    }
  };

  // ── ProfileMenu navigation handler ───────────────────────────────────────
  const handleProfileNavigate = (routeId) => {
    if (routeId === 'logout') {
      showToast('Logged out of DevTrack');
      // TODO: clear auth state and navigate to /login
    }
  };

  return (
    <div className="rm-page" data-theme={theme}>
      {/* ── Top Bar ──────────────────────────────────────────────────────── */}
      <header className="rm-topbar">
        <div className="rm-topbar__left">
          <a href="/" className="rm-topbar__logo" title="DevTrack Home">
            DevTrack
          </a>
        </div>
        <div className="rm-topbar__right">
          <IconButton
            icon={
              theme === 'dark' ? (
                <SunIcon size={20} color="var(--warning)" />
              ) : (
                <MoonIcon size={20} color="var(--info)" />
              )
            }
            onClick={onToggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            variant="outline"
            size="md"
          />
          <ProfileMenu
            currentUser={currentUser}
            onNavigate={handleProfileNavigate}
          />
        </div>
      </header>

      {/* ── Main content area ─────────────────────────────────────────────── */}
      <main className="rm-main">
        {/* Page title section */}
        <section
          className={`rm-hero ${
            !isLoading && !fetchError && rooms.length === 0 ? 'rm-hero--empty' : ''
          }`}
        >
          <div className="rm-hero__text">
            <h1 className="rm-hero__heading">Your Rooms</h1>
            <p className="rm-hero__sub">
              Select a room to view its dashboard, or create and join rooms below.
            </p>
          </div>
          {/* Heading-row buttons only show when at least 1 room exists (hidden during true zero-rooms empty state) */}
          {rooms.length > 0 && (
            <div className="rm-hero__actions">
              <DtButton
                variant="outline"
                size="md"
                icon={<UserPlusIcon size={16} />}
                onClick={() => setShowJoinModal(true)}
                id="rm-page-join-btn"
              >
                Join Room
              </DtButton>
              <DtButton
                variant="primary"
                size="md"
                icon={<PlusIcon size={16} />}
                onClick={() => setShowCreateModal(true)}
                id="rm-page-create-btn"
              >
                Create Room
              </DtButton>
            </div>
          )}
        </section>

        {/* Content States: Loading | Error | Empty | Room List */}
        {isLoading ? (
          <div className="rm-loading-state" role="status" aria-live="polite">
            <div className="rm-spinner" aria-hidden="true" />
            <p className="rm-loading-text">Loading your rooms...</p>
          </div>
        ) : fetchError ? (
          <div className="rm-error-state" role="alert">
            <div className="rm-error-icon-wrapper" aria-hidden="true">
              <AlertCircleIcon size={28} />
            </div>
            <h2 className="rm-error-title">Unable to load rooms</h2>
            <p className="rm-error-message">{fetchError}</p>
            <DtButton variant="primary" size="md" onClick={fetchRooms}>
              Retry
            </DtButton>
          </div>
        ) : rooms.length === 0 ? (
          <RmEmptyState
            onCreateRoom={() => setShowCreateModal(true)}
            onJoinRoom={() => setShowJoinModal(true)}
          />
        ) : (
          <div className="rm-room-list">
            {rooms.map((room) => (
              <RmCard
                key={room.roomCode || room.id}
                room={room}
                currentUserId={currentUser?.id}
                onOpenRoom={handleOpenRoom}
                onLeaveRoom={handleLeaveRoom}
                onDeleteRoom={handleDeleteRoom}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── Modals ────────────────────────────────────────────────────────── */}
      <RmCreateRoomModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateRoomSuccess}
      />
      <RmJoinRoomModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onJoinRequest={handleJoinRequest}
      />

      {/* ── Toast notification ────────────────────────────────────────────── */}
      {toastMessage && (
        <div className="rm-toast" role="status" aria-live="polite">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default Rooms;
