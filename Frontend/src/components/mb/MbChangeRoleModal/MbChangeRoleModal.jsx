import React, { useState, useEffect } from 'react';
import DtButton from '../../ui/DtButton/DtButton';
import { ROLE_OPTIONS } from '../../../utils/mbMockData';
import { CloseIcon } from '../../../assets/icons';
import './MbChangeRoleModal.css';

export const MbChangeRoleModal = ({ member, onSave, onClose }) => {
  const [selectedRole, setSelectedRole] = useState(member?.role || ROLE_OPTIONS[0]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose && onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!member) return null;

  const handleSave = () => {
    onSave && onSave(member.id, selectedRole);
    onClose && onClose();
  };

  return (
    <div className="mb-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="mb-modal" onClick={(e) => e.stopPropagation()}>
        <div className="mb-modal__header">
          <div className="mb-modal__title-group">
            <h2 className="mb-modal__title">Change Member Role</h2>
            <p className="mb-modal__subtitle">
              Select a new project role for <strong>{member.name}</strong> (@{member.username}).
            </p>
          </div>
          <button
            type="button"
            className="mb-modal__close-btn"
            onClick={onClose}
            title="Close modal"
            aria-label="Close modal"
          >
            <CloseIcon size={20} color="var(--text-secondary)" />
          </button>
        </div>

        <div className="mb-modal__body">
          <div className="mb-change-role__options">
            {ROLE_OPTIONS.map((role) => (
              <label
                key={role}
                className={`mb-change-role__option ${
                  selectedRole === role ? 'mb-change-role__option--selected' : ''
                }`}
              >
                <input
                  type="radio"
                  name="roleOption"
                  value={role}
                  checked={selectedRole === role}
                  onChange={() => setSelectedRole(role)}
                  className="mb-change-role__radio"
                />
                <span className="mb-change-role__label">{role}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-modal__footer">
          <DtButton variant="outline" size="md" onClick={onClose}>
            Cancel
          </DtButton>
          <DtButton variant="primary" size="md" onClick={handleSave}>
            Save Changes
          </DtButton>
        </div>
      </div>
    </div>
  );
};

export default MbChangeRoleModal;
