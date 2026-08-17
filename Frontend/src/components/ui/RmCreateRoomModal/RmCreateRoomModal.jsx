import React, { useState, useEffect, useRef } from 'react';
import DtButton from '../DtButton/DtButton';
import { CloseIcon, PlusIcon, AlertCircleIcon } from '../../../assets/icons';
import apiRequest from '../../../api';
import './RmCreateRoomModal.css';

/**
 * RmCreateRoomModal
 *
 * Props:
 *  isOpen          boolean
 *  onClose         () => void
 *  onSuccess       (roomName: string) => void — called when room creation succeeds
 */
const RmCreateRoomModal = ({ isOpen, onClose, onSuccess }) => {
  const [roomName, setRoomName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef(null);

  const MAX_DESC_LENGTH = 500;

  // Focus input when modal opens; clear state when it closes
  useEffect(() => {
    if (isOpen) {
      setRoomName('');
      setDescription('');
      setError('');
      setApiError('');
      setIsSubmitting(false);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  // Close on ESC key (only if not currently submitting)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isSubmitting]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const trimmed = roomName.trim();
    if (!trimmed) {
      setError('Room name is required.');
      return;
    }
    if (trimmed.length < 3) {
      setError('Room name must be at least 3 characters.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setApiError('');

    try {
      await apiRequest({
        url: '/createroom',
        method: 'POST',
        body: {
          room_name: trimmed,
          description: description.trim(),
        },
      });

      onClose();
      if (onSuccess) {
        onSuccess(trimmed);
      }
    } catch (err) {
      setApiError(
        err?.message || 'Failed to create room. Please check your connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="rm-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="rm-create-modal-title"
    >
      <div className="rm-modal">
        {/* Header */}
        <div className="rm-modal__header">
          <div className="rm-modal__title-group">
            <span className="rm-modal__title-icon">
              <PlusIcon size={20} color="var(--accent-primary)" />
            </span>
            <h2 className="rm-modal__title" id="rm-create-modal-title">
              Create a Room
            </h2>
          </div>
          <button
            type="button"
            className="rm-modal__close"
            onClick={onClose}
            aria-label="Close modal"
            disabled={isSubmitting}
          >
            <CloseIcon size={20} />
          </button>
        </div>

        <p className="rm-modal__description">
          Give your new room a name and optional description. A unique Room Code will be generated automatically.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="rm-modal__form" noValidate>
          {apiError && (
            <div className="rm-modal__api-error" role="alert">
              <AlertCircleIcon size={16} />
              <span>{apiError}</span>
            </div>
          )}

          <div className="rm-modal__field">
            <label className="rm-modal__label" htmlFor="rm-create-room-name">
              <span>Room Name</span>
            </label>
            <input
              ref={inputRef}
              id="rm-create-room-name"
              type="text"
              className={`rm-modal__input ${error ? 'rm-modal__input--error' : ''}`}
              placeholder="e.g. Frontend Sprint Q3"
              value={roomName}
              onChange={(e) => {
                setRoomName(e.target.value);
                setError('');
                setApiError('');
              }}
              maxLength={60}
              autoComplete="off"
              disabled={isSubmitting}
            />
            {error && <p className="rm-modal__error">{error}</p>}
          </div>

          <div className="rm-modal__field">
            <label className="rm-modal__label" htmlFor="rm-create-room-desc">
              <span>Description</span>
              <span className="rm-modal__optional">Optional</span>
            </label>
            <div className="rm-modal__textarea-wrapper">
              <textarea
                id="rm-create-room-desc"
                className="rm-modal__textarea"
                placeholder="What is this room for? (e.g. Sprint planning and frontend collaboration)"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setApiError('');
                }}
                maxLength={MAX_DESC_LENGTH}
                rows={3}
                disabled={isSubmitting}
              />
              {/* Live character counter — only shown once user starts typing */}
              {description.length > 0 && (
                <div
                  className={`rm-modal__char-counter ${
                    MAX_DESC_LENGTH - description.length <= 30
                      ? 'rm-modal__char-counter--warning'
                      : ''
                  }`}
                  aria-live="polite"
                >
                  {description.length} / {MAX_DESC_LENGTH}
                </div>
              )}
            </div>
          </div>

          <div className="rm-modal__footer">
            <DtButton
              type="button"
              variant="ghost"
              size="md"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </DtButton>
            <DtButton
              type="submit"
              variant="primary"
              size="md"
              icon={isSubmitting ? <span className="rm-btn-spinner" aria-hidden="true" /> : <PlusIcon size={16} />}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Room'}
            </DtButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RmCreateRoomModal;
