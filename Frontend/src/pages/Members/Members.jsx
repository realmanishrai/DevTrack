import React, { useState } from 'react';
import { mockMembers, mockPendingRequests, mockCurrentUser } from '../../utils/mbMockData';
import MbTeamOverview from '../../components/mb/MbTeamOverview/MbTeamOverview';
import MbJoinRequests from '../../components/mb/MbJoinRequests/MbJoinRequests';
import MbMemberTable from '../../components/mb/MbMemberTable/MbMemberTable';
import MbChangeRoleModal from '../../components/mb/MbChangeRoleModal/MbChangeRoleModal';
import MbRemoveMemberModal from '../../components/mb/MbRemoveMemberModal/MbRemoveMemberModal';
import './Members.css';

const Members = () => {
  const [members, setMembers] = useState(mockMembers);
  const [pendingRequests, setPendingRequests] = useState(mockPendingRequests);
  const [currentUser] = useState(mockCurrentUser);
  const [modalState, setModalState] = useState(null); // { type: 'changeRole' | 'remove', member } | null

  const handleAcceptRequest = (requestId) => {
    const request = pendingRequests.find(r => r.id === requestId);
    if (!request) return;
    setMembers(prev => [...prev, { id: request.id, name: request.name, username: request.username, avatar: request.avatar, role: request.requestedRole, joinedOn: new Date().toISOString().split('T')[0], status: 'active' }]);
    setPendingRequests(prev => prev.filter(r => r.id !== requestId));
  };

  const handleRejectRequest = (requestId) => {
    setPendingRequests(prev => prev.filter(r => r.id !== requestId));
  };

  const openChangeRoleModal = (member) => setModalState({ type: 'changeRole', member });
  const openRemoveModal = (member) => setModalState({ type: 'remove', member });
  const closeModal = () => setModalState(null);

  const handleSaveRole = (memberId, newRole) => {
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, role: newRole } : m));
  };

  const handleConfirmRemove = (memberId) => {
    setMembers(prev => prev.filter(m => m.id !== memberId));
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
        <MbMemberTable
          members={members}
          isAdmin={currentUser.isAdmin}
          currentUserId={currentUser.id}
          onChangeRole={openChangeRoleModal}
          onRemove={openRemoveModal}
        />
        {modalState?.type === 'changeRole' && (
          <MbChangeRoleModal member={modalState.member} onSave={handleSaveRole} onClose={closeModal} />
        )}
        {modalState?.type === 'remove' && (
          <MbRemoveMemberModal member={modalState.member} onConfirm={handleConfirmRemove} onClose={closeModal} />
        )}
      </div>
    </div>
  );
};

export default Members;
