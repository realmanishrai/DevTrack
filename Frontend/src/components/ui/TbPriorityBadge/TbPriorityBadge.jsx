import React from 'react';
import './TbPriorityBadge.css';

export const TbPriorityBadge = ({
  priority = 'medium', // 'low' | 'medium' | 'high'
  size = 'md', // 'sm' | 'md'
  showDot = true,
  className = ''
}) => {
  const normalizePriority = (pr) => {
    if (!pr) return 'medium';
    const p = pr.toLowerCase().trim();
    if (p === 'high' || p === 'urgent') return 'high';
    if (p === 'medium' || p === 'med' || p === 'normal') return 'medium';
    if (p === 'low') return 'low';
    return 'medium';
  };

  const currentPriority = normalizePriority(priority);

  const getPriorityLabel = () => {
    switch (currentPriority) {
      case 'high': return 'High';
      case 'medium': return 'Medium';
      case 'low': return 'Low';
      default: return 'Medium';
    }
  };

  const classNames = [
    'tb-priority-badge',
    `tb-priority-badge--${currentPriority}`,
    `tb-priority-badge--${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={classNames}>
      {showDot && <span className="tb-priority-badge__dot" aria-hidden="true" />}
      <span className="tb-priority-badge__label">{getPriorityLabel()}</span>
    </span>
  );
};

export default TbPriorityBadge;
