import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../../ui/Avatar/Avatar';
import { LogoutIcon } from '../../../assets/icons';
import './lpprofilefloating.css';

const LpProfileFloating = ({
  currentUser = null,
  onLogout = () => {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

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

  const handleLogout = () => {
    setIsOpen(false);
    onLogout();
  };

  return (
    <div className="lpprofilefloating" ref={menuRef}>
      <button
        type="button"
        className="lpprofilefloating__trigger"
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
          className="lpprofilefloating__card"
          role="dialog"
          aria-label="Profile menu"
        >
          <div className="lpprofilefloating__identity">
            <Avatar
              src={currentUser.avatar}
              name={fullName}
              size="lg"
              status="online"
            />

            <div className="lpprofilefloating__identity-text">
              <p className="lpprofilefloating__username">
                {username}
              </p>

              <h3 className="lpprofilefloating__name">
                {fullName}
              </h3>

              {currentUser.email && (
                <p className="lpprofilefloating__email">
                  {currentUser.email}
                </p>
              )}
            </div>
          </div>

          <div className="lpprofilefloating__divider" />

          <button
            type="button"
            className="lpprofilefloating__action lpprofilefloating__action--logout"
            onClick={handleLogout}
          >
            <LogoutIcon size={18} />
            <span>Log out</span>
          </button>

          <div className="lpprofilefloating__divider" />

          <button
            type="button"
            className="lpprofilefloating__action lpprofilefloating__action--profile"
            onClick={handleProfileClick}
          >
            <span>View Full Profile</span>

            <span
              className="lpprofilefloating__arrow"
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

export default LpProfileFloating;