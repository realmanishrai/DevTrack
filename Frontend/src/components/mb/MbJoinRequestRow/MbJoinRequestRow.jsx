import React from 'react';
import Avatar from '../../ui/Avatar/Avatar';
import DtButton from '../../ui/DtButton/DtButton';
import './MbJoinRequestRow.css';

const getRelativeTime = (timestamp) => {
  if (!timestamp) return '';
  const now = new Date();
  const date = new Date(timestamp);
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (isNaN(diffInSeconds) || diffInSeconds < 0) return '';
  if (diffInSeconds < 60) return 'Just now';

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths}mo ago`;

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears}y ago`;
};

export const MbJoinRequestRow = ({ request, onAccept, onReject }) => {
  if (!request) return null;

  const { id, name, username, avatar, requestedRole, requestedAt } = request;
  const timeAgo = getRelativeTime(requestedAt);

  return (
    <div className="mb-join-request-row">
      <div className="mb-join-request-row__user-info">
        <Avatar src={avatar} name={name} size="md" />
        <div className="mb-join-request-row__details">
          <div className="mb-join-request-row__name-group">
            <span className="mb-join-request-row__name">{name}</span>
            <span className="mb-join-request-row__username">@{username}</span>
          </div>
          <div className="mb-join-request-row__meta">
            <span>Requested role: <strong className="mb-join-request-row__role">{requestedRole}</strong></span>
            {timeAgo && <span className="mb-join-request-row__time">• {timeAgo}</span>}
          </div>
        </div>
      </div>

      <div className="mb-join-request-row__actions">
        <DtButton
          variant="primary"
          size="sm"
          className="mb-join-request-row__accept-btn"
          onClick={() => onAccept && onAccept(id)}
        >
          Accept
        </DtButton>
        <DtButton
          variant="danger"
          size="sm"
          className="mb-join-request-row__reject-btn"
          onClick={() => onReject && onReject(id)}
        >
          Reject
        </DtButton>
      </div>
    </div>
  );
};

export default MbJoinRequestRow;
