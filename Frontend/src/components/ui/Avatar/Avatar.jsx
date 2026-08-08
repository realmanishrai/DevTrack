import React, { useState } from 'react';
import './Avatar.css';

export const Avatar = ({
  src = null,
  name = '',
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  status = null, // 'online' | 'offline' | 'busy' | null
  className = ''
}) => {
  const [imageError, setImageError] = useState(false);

  const getInitials = (str) => {
    if (!str) return 'U';
    const parts = str.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return str.substring(0, 2).toUpperCase();
  };

  const classNames = [
    'dt-avatar',
    `dt-avatar--${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames}>
      {src && !imageError ? (
        <img
          src={src}
          alt={name || 'User avatar'}
          className="dt-avatar__image"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="dt-avatar__fallback">
          {getInitials(name)}
        </div>
      )}
      {status && (
        <span className={`dt-avatar__status dt-avatar__status--${status}`} />
      )}
    </div>
  );
};

export default Avatar;
