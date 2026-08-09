import React from 'react';
import './IconButton.css';

export const IconButton = ({
  icon,
  onClick,
  title = '',
  variant = 'ghost', // 'ghost' | 'outline' | 'surface' | 'primary'
  size = 'md', // 'sm' | 'md' | 'lg'
  disabled = false,
  className = '',
  ...props
}) => {
  const classNames = [
    'dt-icon-button',
    `dt-icon-button--${variant}`,
    `dt-icon-button--${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      className={classNames}
      onClick={onClick}
      title={title}
      aria-label={title}
      disabled={disabled}
      {...props}
    >
      {icon}
    </button>
  );
};

export default IconButton;
