import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import ProfileMenu from '../ProfileMenu/ProfileMenu';
import IconButton from '../../ui/IconButton/IconButton';
import { MenuIcon, SunIcon, MoonIcon } from '../../../assets/icons';
import './PageContainer.css';

export const PageContainer = ({
  children,
  activeRoute = 'dashboard',
  onNavigate = () => {},
  pageTitle = 'Dashboard',
  currentUser = { name: 'Alex Rivera', role: 'leader' },
  theme = 'dark',
  onToggleTheme = () => {},
  className = ''
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const containerClassNames = [
    'dt-page-container',
    isSidebarCollapsed ? 'dt-page-container--sidebar-collapsed' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClassNames} data-theme={theme}>
      <Sidebar
        activeRoute={activeRoute}
        onNavigate={onNavigate}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <div className="dt-page-main">
        <header className="dt-page-header">
          <div className="dt-page-header__left">
            <div className="dt-page-header__mobile-menu">
              <IconButton
                icon={<MenuIcon size={22} />}
                onClick={() => setIsMobileSidebarOpen(true)}
                title="Open Navigation Menu"
                variant="outline"
                size="md"
              />
            </div>

            <div className="dt-page-header__title-group">
              <h1 className="dt-page-header__title">{pageTitle}</h1>
            </div>
          </div>

          <div className="dt-page-header__right">
            <IconButton
              icon={
                theme === 'dark'
                  ? <SunIcon size={20} color="var(--warning)" />
                  : <MoonIcon size={20} color="var(--info)" />
              }
              onClick={onToggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              variant="outline"
              size="md"
            />

            <ProfileMenu
              currentUser={currentUser}
              onNavigate={onNavigate}
            />
          </div>
        </header>

        <main className="dt-page-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PageContainer;