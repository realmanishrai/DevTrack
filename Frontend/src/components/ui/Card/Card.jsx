import React from 'react';
import './Card.css';

export const Card = ({
  children,
  className = '',
  hoverable = false,
  padding = 'normal', // 'none' | 'compact' | 'normal' | 'spacious'
  onClick,
  ...props
}) => {
  const classNames = [
    'dt-card',
    hoverable ? 'dt-card--hoverable' : '',
    `dt-card--padding-${padding}`,
    onClick ? 'dt-card--clickable' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames} onClick={onClick} {...props}>
      {children}
    </div>
  );
};

export default Card;
