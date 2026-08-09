import React from 'react';
import './Badge.css';

export const Badge = ({
  children,
  variant = 'info', // 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'secondary' | 'leader' | 'member'
  size = 'md', // 'sm' | 'md'
  icon = null,
  className = ''
}) => {
  const classNames = [
    'dt-badge',
    `dt-badge--${variant}`,
    `dt-badge--${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={classNames}>
      {icon && <span className="dt-badge__icon">{icon}</span>}
      <span className="dt-badge__text">{children}</span>
    </span>
  );
};

export default Badge;
