import React, { useEffect, useRef } from 'react';
import './MbMemberActionsMenu.css';

export const MbMemberActionsMenu = ({ onChangeRole, onRemove, onClose }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose && onClose();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose && onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="mb-member-actions-menu" ref={menuRef} role="menu">
      <button
        type="button"
        className="mb-member-actions-menu__item"
        onClick={() => {
          onChangeRole && onChangeRole();
        }}
        role="menuitem"
      >
        Change Role
      </button>
      <button
        type="button"
        className="mb-member-actions-menu__item mb-member-actions-menu__item--danger"
        onClick={() => {
          onRemove && onRemove();
        }}
        role="menuitem"
      >
        Remove Member
      </button>
    </div>
  );
};

export default MbMemberActionsMenu;
