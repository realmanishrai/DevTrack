import React, { useEffect } from 'react';
import DtButton from '../../ui/DtButton/DtButton';
import { CloseIcon } from '../../../assets/icons';
import './MbRemoveMemberModal.css';

export const MbRemoveMemberModal = ({ member, onConfirm, onClose }) => {
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

  const handleConfirm = () => {
    onConfirm && onConfirm(member.id);
    onClose && onClose();
  };

  return (
    <div className="mb-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="mb-modal mb-remove-member-modal" onClick={(e) => e.stopPropagation()}>
        <div className="mb-modal__header">
          <div className="mb-modal__title-group">
            <h2 className="mb-modal__title mb-remove-member-modal__title">Remove Member?</h2>
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
          <p className="mb-remove-member-modal__body-text">
            Are you sure you want to remove <strong>{member.name}</strong> from this project?
          </p>
        </div>

        <div className="mb-modal__footer">
          <DtButton variant="outline" size="md" onClick={onClose}>
            Cancel
          </DtButton>
          <DtButton variant="danger" size="md" onClick={handleConfirm}>
            Remove Member
          </DtButton>
        </div>
      </div>
    </div>
  );
};

export default MbRemoveMemberModal;
