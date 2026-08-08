import React from 'react';
import Avatar from '../../ui/Avatar/Avatar';
import { CheckCircleIcon, PlusIcon, UserPlusIcon, ActivityIcon } from '../../../assets/icons';
import './ActivityItem.css';

export const ActivityItem = ({
  activity,
  className = ''
}) => {
  const {
    title = '',
    user = null,
    timestamp = '',
    type = 'default'
  } = activity || {};

  const getActivityIcon = () => {
    switch (type) {
      case 'task_completed':
        return <CheckCircleIcon size={16} color="var(--success)" />;
      case 'member_joined':
        return <UserPlusIcon size={16} color="var(--accent-primary)" />;
      case 'task_assigned':
        return <PlusIcon size={16} color="var(--info)" />;
      default:
        return <ActivityIcon size={16} color="var(--warning)" />;
    }
  };

  return (
    <div className={`dt-activity-item ${className}`}>
      <div className="dt-activity-item__icon-box">
        {getActivityIcon()}
      </div>

      <div className="dt-activity-item__content">
        <div className="dt-activity-item__header">
          <span className="dt-activity-item__title">{title}</span>
          <span className="dt-activity-item__timestamp">{timestamp}</span>
        </div>

        {user && (
          <div className="dt-activity-item__user">
            <Avatar src={user.avatar} name={user.name} size="sm" />
            <span className="dt-activity-item__user-name">{user.name}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityItem;
