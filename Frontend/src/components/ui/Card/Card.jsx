import './Card.css';

/**
 * Card
 *
 * Supports both landing-page and dashboard card APIs.
 *
 * @param {string} variant   - default | highlight | flat
 * @param {string} className - extra classes
 * @param {boolean} hoverable - enables dashboard hover styling
 * @param {string} padding   - none | compact | normal | spacious
 * @param {function} onClick - optional click handler
 * @param {ReactNode} children
 */
export const Card = ({
  variant = 'default',
  className = '',
  hoverable = false,
  padding = 'normal',
  onClick,
  children,
  ...props
}) => {
  const classNames = [
    'card',
    variant === 'highlight' ? 'card-highlight' : '',
    variant === 'flat' ? 'card-flat' : '',
    'dt-card',
    hoverable ? 'dt-card--hoverable' : '',
    `dt-card--padding-${padding}`,
    onClick ? 'dt-card--clickable' : '',
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames} onClick={onClick} {...props}>
      {children}
    </div>
  );
};

export default Card;