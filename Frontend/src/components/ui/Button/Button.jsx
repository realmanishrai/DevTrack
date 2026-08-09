import './Button.css';

function Button({
  variant = 'primary',
  size = 'md',
  icon = null,
  iconPosition = 'left',
  fullWidth = false,
  disabled = false,
  type = 'button',
  onClick,
  children,
  className = '',
  ...rest
}) {
  const classes = [
    'btn',
    `btn-${variant}`,
    size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '',
    fullWidth ? 'btn-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classes}
      disabled={disabled}
      type={type}
      onClick={onClick}
      {...rest}
    >
      {icon && iconPosition === 'left' && (
        <span className="btn__icon">{icon}</span>
      )}

      {children}

      {icon && iconPosition === 'right' && (
        <span className="btn__icon">{icon}</span>
      )}
    </button>
  );
}

export default Button;