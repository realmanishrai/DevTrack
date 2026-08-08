import React from 'react';
import './Button.css';

export const Button = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon = null,
  iconPosition = 'left', // 'left' | 'right'
  fullWidth = false,
  className = '',
  onClick,
  disabled = false,
  type = 'button',
  ...props
}) => {
  const classNames = [
    'dt-button',
    `dt-button--${variant}`,
    `dt-button--${size}`,
    fullWidth ? 'dt-button--full' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classNames}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="dt-button__icon">{icon}</span>}
      <span className="dt-button__label">{children}</span>
      {icon && iconPosition === 'right' && <span className="dt-button__icon">{icon}</span>}
    </button>
  );
};

export default Button;
