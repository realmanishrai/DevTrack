import './Card.css';

/**
 * Card
 * @param {string}   variant   - default | highlight | flat
 * @param {string}   className - extra classes
 * @param {ReactNode} children
 */
function Card({ variant = 'default', className = '', children, ...rest }) {
  const classes = [
    'card',
    variant === 'highlight' ? 'card-highlight' : '',
    variant === 'flat'      ? 'card-flat'      : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}

export default Card;
