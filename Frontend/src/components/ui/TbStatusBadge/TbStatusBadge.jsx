import React from 'react';
import { CheckCircleIcon, ClockIcon, AlertCircleIcon } from '../../../assets/icons';
import './TbStatusBadge.css';

export const TbStatusBadge = ({
  status = 'not_started', // 'not_started' | 'pending' | 'in_progress' | 'completed'
  size = 'md', // 'sm' | 'md'
  showIcon = true,
  className = ''
}) => {
  const normalizeStatus = (st) => {
    if (!st) return 'not_started';
    const s = st.toLowerCase().replace(/[\s-]/g, '_');
    if (s === 'pending') return 'not_started';
    if (s === 'in_progress' || s === 'inprogress' || s === 'progress') return 'in_progress';
    if (s === 'completed' || s === 'done') return 'completed';
    return 'not_started';
  };

  const currentStatus = normalizeStatus(status);

  const getStatusConfig = () => {
    switch (currentStatus) {
      case 'completed':
        return {
          label: 'Completed',
          icon: <CheckCircleIcon size={size === 'sm' ? 12 : 14} color="currentColor" />,
          variantClass: 'tb-status-badge--completed'
        };
      case 'in_progress':
        return {
          label: 'In Progress',
          icon: <ClockIcon size={size === 'sm' ? 12 : 14} color="currentColor" />,
          variantClass: 'tb-status-badge--in-progress'
        };
      case 'not_started':
      default:
        return {
          label: 'Not Started',
          icon: <AlertCircleIcon size={size === 'sm' ? 12 : 14} color="currentColor" />,
          variantClass: 'tb-status-badge--not-started'
        };
    }
  };

  const { label, icon, variantClass } = getStatusConfig();

  const classNames = [
    'tb-status-badge',
    variantClass,
    `tb-status-badge--${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={classNames}>
      {showIcon && <span className="tb-status-badge__icon">{icon}</span>}
      <span className="tb-status-badge__label">{label}</span>
    </span>
  );
};

export default TbStatusBadge;
