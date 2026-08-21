import React, { useState } from 'react';
import DtCard from '../../ui/DtCard/DtCard';
import TbSearchBar from '../../ui/TbSearchBar/TbSearchBar';
import TbDropdown from '../../ui/TbDropdown/TbDropdown';
import { ROLE_OPTIONS } from '../../../utils/mbMockData';
import MbMemberRow from '../MbMemberRow/MbMemberRow';
import './MbMemberTable.css';

export const MbMemberTable = ({
  members = [],
  isAdmin = false,
  currentUserId,
  onChangeRole,
  onRemove,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');

  const roleDropdownOptions = ['All Roles', ...ROLE_OPTIONS];

  const filteredMembers = members.filter((member) => {
    const memberName = member.name || '';
    const memberUsername = member.username || '';

    const matchesSearch =
      !searchQuery ||
      memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memberUsername.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      !selectedRole ||
      selectedRole === 'All Roles' ||
      member.role === selectedRole;

    return matchesSearch && matchesRole;
  });

  return (
    <DtCard className="mb-member-table-container">
      <div className="mb-member-table__header-section">
        <div>
          <h2 className="mb-member-table__title">
            Team Members ({members.length})
          </h2>

          <p className="mb-member-table__subtitle">
            Manage roles, permissions, and team access
          </p>
        </div>
      </div>

      <div className="mb-member-table__controls">
        <div className="mb-member-table__filters">
          <TbSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
            placeholder="Search members..."
            className="mb-member-table__search"
          />

          <TbDropdown
            options={roleDropdownOptions}
            value={selectedRole}
            onChange={setSelectedRole}
            placeholder="Filter by role"
            className="mb-member-table__dropdown"
          />
        </div>
      </div>

      <div className="mb-member-table__wrapper">
        <table className="mb-member-table">
          <thead className="mb-member-table__head">
            <tr>
              <th className="mb-member-table__th">Member</th>

              <th className="mb-member-table__th">Role</th>

              <th className="mb-member-table__th">Joined On</th>

              <th className="mb-member-table__th">Last Seen</th>

              {isAdmin && (
                <th className="mb-member-table__th mb-member-table__th--actions">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="mb-member-table__body">
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <MbMemberRow
                  key={member.id}
                  member={member}
                  isAdmin={isAdmin}
                  isSelf={member.id === currentUserId}
                  onChangeRole={onChangeRole}
                  onRemove={onRemove}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={isAdmin ? 5 : 4}
                  className="mb-member-table__empty"
                >
                  No members found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DtCard>
  );
};

export default MbMemberTable;