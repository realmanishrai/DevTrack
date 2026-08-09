import React from 'react';
import IconButton from '../../ui/IconButton/IconButton';
import {
  DashboardIcon,
  TasksIcon,
  MembersIcon,
  ActivityIcon,
  SettingsIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon
} from '../../../assets/icons';
import './Sidebar.css';

export const Sidebar = ({
  activeRoute = 'dashboard',
  onNavigate = () => {},
  isCollapsed = false,
  onToggleCollapse = () => {},
  isMobileOpen = false,
  onCloseMobile = () => {},
  className = ''
}) => {
  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon size={20} /> },
    { id: 'tasks', label: 'Tasks', icon: <TasksIcon size={20} /> },
    { id: 'members', label: 'Members', icon: <MembersIcon size={20} /> },
    { id: 'activity', label: 'Activity Log', icon: <ActivityIcon size={20} /> },
  ];

  const handleNavClick = (routeId) => {
    onNavigate(routeId);
    if (isMobileOpen) {
      onCloseMobile();
    }
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    onNavigate('landing');
    if (isMobileOpen) {
      onCloseMobile();
    }
  };

  const sidebarClassNames = [
    'dt-sidebar',
    isCollapsed ? 'dt-sidebar--collapsed' : '',
    isMobileOpen ? 'dt-sidebar--mobile-open' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <>
      {/* Mobile Overlay Background */}
      {isMobileOpen && (
        <div className="dt-sidebar-mobile-overlay" onClick={onCloseMobile} />
      )}

      <aside className={sidebarClassNames}>
        {/* Top Header: Simple DevTrack Logo Wordmark & Collapse Control */}
        <div className="dt-sidebar__header">
          <a
            href="/"
            className="dt-sidebar__logo-link"
            onClick={handleLogoClick}
            title="DevTrack Home"
          >
            {!isCollapsed ? (
              <span className="dt-sidebar__logo-text">DevTrack</span>
            ) : (
              <span className="dt-sidebar__logo-icon">DT</span>
            )}
          </a>

          {/* Desktop Collapse Toggle */}
          <div className="dt-sidebar__collapse-toggle">
            <IconButton
              icon={isCollapsed ? <ChevronRightIcon size={18} /> : <ChevronLeftIcon size={18} />}
              onClick={onToggleCollapse}
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              variant="ghost"
              size="sm"
            />
          </div>

          {/* Mobile Close Button */}
          <div className="dt-sidebar__mobile-close">
            <IconButton
              icon={<CloseIcon size={20} />}
              onClick={onCloseMobile}
              title="Close Menu"
              variant="ghost"
              size="sm"
            />
          </div>
        </div>

        {/* Main Navigation Items List */}
        <nav className="dt-sidebar__nav">
          <ul className="dt-sidebar__menu">
            {mainNavItems.map((item) => {
              const isActive = activeRoute === item.id;
              return (
                <li key={item.id} className="dt-sidebar__menu-item">
                  <button
                    type="button"
                    className={`dt-sidebar__link ${isActive ? 'dt-sidebar__link--active' : ''}`}
                    onClick={() => handleNavClick(item.id)}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <span className="dt-sidebar__link-icon">{item.icon}</span>
                    {!isCollapsed && <span className="dt-sidebar__link-label">{item.label}</span>}
                    {isActive && <span className="dt-sidebar__active-indicator" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Pinned Bottom Section: Divider + Settings Link */}
        <div className="dt-sidebar__footer">
          <div className="dt-sidebar__divider" />
          <button
            type="button"
            className={`dt-sidebar__link ${activeRoute === 'settings' ? 'dt-sidebar__link--active' : ''}`}
            onClick={() => handleNavClick('settings')}
            title={isCollapsed ? 'Settings' : undefined}
          >
            <span className="dt-sidebar__link-icon">
              <SettingsIcon size={20} />
            </span>
            {!isCollapsed && <span className="dt-sidebar__link-label">Settings</span>}
            {activeRoute === 'settings' && <span className="dt-sidebar__active-indicator" />}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
