import React, { useState, useRef } from 'react';
import Avatar from '../../ui/Avatar/Avatar';
import Badge from '../../ui/Badge/Badge';
import IconButton from '../../ui/IconButton/IconButton';
import { MoreVerticalIcon } from '../../../assets/icons';
import MbMemberActionsMenu from '../MbMemberActionsMenu/MbMemberActionsMenu';
import './MbMemberRow.css';

const getRoleBadgeVariant = (role) => {
  switch (role) {
    case 'Project Admin':
      return 'primary';
    case 'Frontend Developer':
      return 'info';
    case 'Backend Developer':
      return 'success';
    case 'Full Stack Developer':
      return 'leader';
    case 'UI/UX Designer':
      return 'warning';
    case 'QA / Tester':
      return 'danger';
    case 'Member':
    default:
      return 'secondary';
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const MbMemberRow = ({ member, isAdmin, isSelf, onChangeRole, onRemove }) => {
  const [showMenu, setShowMenu] = useState(false);
  const actionsRef = useRef(null);

  if (!member) return null;

  const { name, username, avatar, role, joinedOn, status } = member;

  const handleToggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu((prev) => !prev);
  };

  const handleCloseMenu = () => {
    setShowMenu(false);
  };

  return (
    <tr className="mb-member-row">
      <td className="mb-member-row__cell mb-member-row__cell--member">
        <div className="mb-member-row__user-info">
          <Avatar src={avatar} name={name} size="md" />
          <div className="mb-member-row__details">
            <span className="mb-member-row__name">
              {name} {isSelf && <span className="mb-member-row__you-badge">(You)</span>}
            </span>
            <span className="mb-member-row__username">@{username}</span>
          </div>
        </div>
      </td>

      <td className="mb-member-row__cell mb-member-row__cell--role">
        <Badge variant={getRoleBadgeVariant(role)} size="md">
          {role}
        </Badge>
      </td>

      <td className="mb-member-row__cell mb-member-row__cell--joined">
        {formatDate(joinedOn)}
      </td>

      <td className="mb-member-row__cell mb-member-row__cell--status">
        <div className="mb-member-row__status-indicator">
          <span className={`mb-member-row__status-dot mb-member-row__status-dot--${status || 'active'}`} />
          <span className="mb-member-row__status-text">
            {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Active'}
          </span>
        </div>
      </td>

      <td className="mb-member-row__cell mb-member-row__cell--actions" ref={actionsRef}>
        {isAdmin && !isSelf ? (
          <div className="mb-member-row__actions-wrapper">
            <IconButton
              icon={<MoreVerticalIcon size={18} />}
              title="Member actions"
              aria-label="Member actions"
              variant="ghost"
              size="sm"
              onClick={handleToggleMenu}
            />
            {showMenu && (
              <MbMemberActionsMenu
                onChangeRole={() => {
                  handleCloseMenu();
                  onChangeRole && onChangeRole(member);
                }}
                onRemove={() => {
                  handleCloseMenu();
                  onRemove && onRemove(member);
                }}
                onClose={handleCloseMenu}
              />
            )}
          </div>
        ) : null}
      </td>
    </tr>
  );
};

export default MbMemberRow;
