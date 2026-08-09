import React from 'react';
import DtCard from '../../ui/DtCard/DtCard';
import Avatar from '../../ui/Avatar/Avatar';
import Badge from '../../ui/Badge/Badge';
import ProgressBar from '../../ui/ProgressBar/ProgressBar';
import { getProgressColor } from '../../../utils/colorUtils';
import './MemberCard.css';

export const MemberCard = ({
  member,
  className = ''
}) => {
  const {
    name = 'Team Member',
    avatar = null,
    role = 'member',
    assignedCount = 0,
    completedCount = 0,
    progressPercentage = 0
  } = member || {};

  const progressColor = getProgressColor(progressPercentage);

  return (
    <DtCard className={`dt-member-card ${className}`} hoverable>
      <div className="dt-member-card__header">
        <Avatar src={avatar} name={name} size="md" status="online" />
        <div className="dt-member-card__info">
          <h4 className="dt-member-card__name">{name}</h4>
          <Badge variant={role === 'leader' ? 'leader' : 'member'} size="sm">
            {role === 'leader' ? 'Leader' : 'Member'}
          </Badge>
        </div>
      </div>

      <div className="dt-member-card__stats">
        <div className="dt-member-card__stat-item">
          <span className="dt-member-card__stat-label">Assigned</span>
          <span className="dt-member-card__stat-value">{assignedCount}</span>
        </div>
        <div className="dt-member-card__stat-divider" />
        <div className="dt-member-card__stat-item">
          <span className="dt-member-card__stat-label">Completed</span>
          <span
            className="dt-member-card__stat-value"
            style={{ color: progressColor }}
          >
            {completedCount}
          </span>
        </div>
      </div>

      <div className="dt-member-card__progress">
        <ProgressBar
          progress={progressPercentage}
          height={6}
          showLabel
          labelText="Task Completion"
        />
      </div>
    </DtCard>
  );
};

export default MemberCard;
