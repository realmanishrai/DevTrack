import React, { useState } from 'react';
import { mockMembers, mockPendingRequests, mockCurrentUser } from '../../utils/mbMockData';
import MbTeamOverview from '../../components/mb/MbTeamOverview/MbTeamOverview';
import MbJoinRequests from '../../components/mb/MbJoinRequests/MbJoinRequests';
import './Members.css';

const Members = () => {
  const [members, setMembers] = useState(mockMembers);
  const [pendingRequests, setPendingRequests] = useState(mockPendingRequests);
  const [currentUser] = useState(mockCurrentUser);

  const handleAcceptRequest = (requestId) => {
    const request = pendingRequests.find(r => r.id === requestId);
    if (!request) return;
    setMembers(prev => [...prev, { id: request.id, name: request.name, username: request.username, avatar: request.avatar, role: request.requestedRole, joinedOn: new Date().toISOString().split('T')[0], status: 'active' }]);
    setPendingRequests(prev => prev.filter(r => r.id !== requestId));
  };

  const handleRejectRequest = (requestId) => {
    setPendingRequests(prev => prev.filter(r => r.id !== requestId));
  };

  return (
    <div className="mb-members-page">
      <header className="mb-members-page__header">
        <h1 className="mb-members-page__title">Team Members</h1>
        <p className="mb-members-page__subtitle">
          Manage roles, permissions, and team access
        </p>
      </header>

      <div className="mb-members-page__content">
        <MbTeamOverview members={members} pendingRequests={pendingRequests} />
        {pendingRequests.length > 0 && currentUser.isAdmin && (
          <MbJoinRequests requests={pendingRequests} onAccept={handleAcceptRequest} onReject={handleRejectRequest} />
        )}
        {/* MbMemberTable will be added here in a later step */}
      </div>
    </div>
  );
};

export default Members;
