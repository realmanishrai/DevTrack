import React, { useState, useRef, useEffect } from 'react';
import Avatar from '../../ui/Avatar/Avatar';
import Badge from '../../ui/Badge/Badge';
import { LogoutIcon } from '../../../assets/icons';
import './ProfileMenu.css';

export const ProfileMenu = ({
  currentUser = { name: 'Alex Rivera', role: 'leader' },
  onNavigate = () => {},
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on click outside
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

  const handleAction = (routeId) => {
    setIsOpen(false);
    onNavigate(routeId);
  };

  return (
    <div className={`dt-profile-menu-container ${className}`} ref={menuRef}>
      {/* Small circular avatar-only button */}
      <button
        type="button"
        className="dt-profile-menu__trigger"
        onClick={() => setIsOpen(!isOpen)}
        title={currentUser?.name || 'User Profile'}
        aria-label="User Profile Menu"
        aria-expanded={isOpen}
      >
        <Avatar
          src={currentUser?.avatar}
          name={currentUser?.name}
          size="md"
          status="online"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="dt-profile-menu__dropdown">
          {/* User Details Header */}
          <div className="dt-profile-menu__header">
            <span className="dt-profile-menu__name">{currentUser?.name || 'User'}</span>
            <div className="dt-profile-menu__role-wrapper">
              <Badge variant={currentUser?.role === 'leader' ? 'leader' : 'member'} size="sm">
                {currentUser?.role === 'leader' ? 'Leader' : 'Member'}
              </Badge>
            </div>
          </div>

          <div className="dt-profile-menu__divider" />

          {/* Menu Items: Logout Action Only */}
          <ul className="dt-profile-menu__list">
            <li>
              <button
                type="button"
                className="dt-profile-menu__item dt-profile-menu__item--danger"
                onClick={() => handleAction('logout')}
              >
                <LogoutIcon size={18} />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
