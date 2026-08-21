import React from 'react';
import DtCard from '../../ui/DtCard/DtCard';
import './MbTeamOverview.css';

export const MbTeamOverview = ({ members = [], pendingRequests = [] }) => {
  const totalMembers = members.length;
  const projectAdmins = members.filter((m) => m.role === 'Project Admin').length;
  const developers = members.filter((m) => m.role && m.role.includes('Developer')).length;
  const pendingCount = pendingRequests.length;

  const statTiles = [
    {
      id: 'total-members',
      label: 'Total Members',
      value: totalMembers,
      variant: 'info',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      id: 'project-admins',
      label: 'Project Admin',
      value: projectAdmins,
      variant: 'success',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
    {
      id: 'developers',
      label: 'Developers',
      value: developers,
      variant: 'info',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      ),
    },
    {
      id: 'pending-requests',
      label: 'Pending Requests',
      value: pendingCount,
      variant: 'warning',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <line x1="20" y1="8" x2="20" y2="14" />
          <line x1="17" y1="11" x2="23" y2="11" />
        </svg>
      ),
    },
  ];

  return (
    <DtCard className="mb-team-overview">
      <div className="mb-team-overview__grid">
        {statTiles.map((tile) => (
          <div key={tile.id} className="mb-team-overview__tile">
            <div className="mb-team-overview__tile-header">
              <span className="mb-team-overview__label">{tile.label}</span>
              <div className={`mb-team-overview__icon-circle mb-team-overview__icon-circle--${tile.variant}`}>
                {tile.icon}
              </div>
            </div>
            <div className="mb-team-overview__value">{tile.value}</div>
          </div>
        ))}
      </div>
    </DtCard>
  );
};

export default MbTeamOverview;
