import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../../ui/Avatar/Avatar';
import { LogoutIcon } from '../../../assets/icons';
import { getCurrentUser } from '../../../api';
import './ProfileMenu.css'; 

export const ProfileMenu = ({
  currentUser: providedUser = null,
  onNavigate = () => {},
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(providedUser);
  const menuRef = useRef(null); 
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const loadCurrentUser = async () => {
      try {
        const userData = await getCurrentUser();

        if (!isMounted || !userData) {
          return;
        }

        setCurrentUser({
          id: userData.id,
          name:
            `${userData.firstname || ''} ${userData.lastname || ''}`.trim() ||
            userData.username,
          username: userData.username,
          email: userData.email,
          avatar: userData.avatar,
        });
      } catch (error) {
        if (isMounted) {
          setCurrentUser(providedUser || null);
        }
      }
    };

    loadCurrentUser();

    return () => {
      isMounted = false;
    };
  }, [providedUser]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    onNavigate('logout');
  };

  if (!currentUser) {
    return null;
  }

  const fullName =
    currentUser.name ||
    `${currentUser.firstname || ''} ${currentUser.lastname || ''}`.trim() ||
    currentUser.username ||
    'User';

  const username = currentUser.username
    ? `@${currentUser.username.replace(/^@/, '')}`
    : '@user';

  const handleProfileClick = () => {
  setIsOpen(false);
  navigate('/profile');
  }; 
  
  return (
    <div
      className={`dt-profile-menu-container ${className}`}
      ref={menuRef}
    >
      <button
        type="button"
        className="dt-profile-menu__trigger"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-label="Open profile menu"
        aria-expanded={isOpen}
        title={fullName}
      >
        <Avatar
          src={currentUser.avatar}
          name={fullName}
          size="md"
          status="online"
        />
      </button>

      {isOpen && (
        <div
          className="dt-profile-menu__dropdown"
          role="dialog"
          aria-label="Profile menu"
        >
          <div className="dt-profile-menu__identity">
            <Avatar
              src={currentUser.avatar}
              name={fullName}
              size="lg"
              status="online"
            />

            <div className="dt-profile-menu__identity-text">
              <p className="dt-profile-menu__username">
                {username}
              </p>

              <h3 className="dt-profile-menu__name">
                {fullName}
              </h3>

              {currentUser.email && (
                <p className="dt-profile-menu__email">
                  {currentUser.email}
                </p>
              )}
            </div>
          </div>

          <div className="dt-profile-menu__divider" />

          <button
            type="button"
            className="dt-profile-menu__item dt-profile-menu__item--danger"
            onClick={handleLogout}
          >
            <LogoutIcon size={18} />
            <span>Log out</span>
          </button>

          <div className="dt-profile-menu__divider" />

          <button
            type="button"
            className="dt-profile-menu__item dt-profile-menu__item--profile"
            onClick={handleProfileClick}
          >
            <span>View Full Profile</span>

            <span
              className="dt-profile-menu__arrow"
              aria-hidden="true"
            >
              →
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;