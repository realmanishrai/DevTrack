import './Button.css';

/**
 * Button
 * @param {string}   variant  - primary | secondary | outline | ghost | danger
 * @param {string}   size     - sm | md | lg
 * @param {boolean}  fullWidth
 * @param {boolean}  disabled
 * @param {string}   type     - button | submit | reset
 * @param {function} onClick
 * @param {ReactNode} children
 */
function Button({
  variant = 'primary',
  size = 'md',
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
      {children}
    </button>
  );
}

export default Button;
