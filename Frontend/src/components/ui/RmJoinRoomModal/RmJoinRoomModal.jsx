import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DtButton from '../DtButton/DtButton';
import {
  CloseIcon,
  UserPlusIcon,
  CheckCircleIcon,
  AlertCircleIcon,
} from '../../../assets/icons';
import apiRequest from '../../../api';
import './RmJoinRoomModal.css';

/**
 * RmJoinRoomModal
 *
 * Props:
 *  isOpen          boolean
 *  onClose         () => void
 *  onJoinRequest   (roomCode: string) => void — optional callback after successful request
 */
const RmJoinRoomModal = ({ isOpen, onClose, onJoinRequest }) => {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setRoomCode('');
      setError('');
      setApiError('');
      setIsSubmitting(false);
      setSubmitted(false);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  // Close on ESC (only if not currently submitting)
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

  // Auto-close after showing success state
  useEffect(() => {
    if (!submitted) return;
    const timer = setTimeout(() => {
      onClose();
    }, 2000);
    return () => clearTimeout(timer);
  }, [submitted, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const trimmed = roomCode.trim().toUpperCase();
    if (!trimmed) {
      setError('Please enter a Room Code.');
      return;
    }
    if (trimmed.length < 3) {
      setError('Room Code must be at least 3 characters.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setApiError('');

    try {
      await apiRequest({
        url: `/join/${trimmed}`,
        method: 'POST',
      });

      setSubmitted(true);
      if (onJoinRequest) {
        onJoinRequest(trimmed);
      }
    } catch (err) {
      if (err?.status === 401) {
        navigate('/login');
        return;
      }

      if (err?.status === 404) {
        setApiError('No room found with that code. Double-check and try again.');
      } else if (err?.status === 409) {
        const detail = (err?.data?.detail || err?.message || '').toLowerCase();
        if (detail.includes('already sent') || detail.includes('request')) {
          setApiError(
            "You've already requested to join this room — waiting on approval."
          );
        } else if (
          detail.includes('already a member') ||
          detail.includes('member')
        ) {
          setApiError(
            "You're already a member of this room. Check your room list or refresh the page."
          );
        } else {
          setApiError(err?.message || 'A join conflict occurred for this room.');
        }
      } else {
        setApiError(
          err?.message ||
            'Failed to send join request. Please check your connection and try again.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="rm-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting && !submitted) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="rm-join-modal-title"
    >
      <div className="rm-modal">
        {!submitted ? (
          <>
            {/* Header */}
            <div className="rm-modal__header">
              <div className="rm-modal__title-group">
                <span className="rm-modal__title-icon">
                  <UserPlusIcon size={20} color="var(--accent-primary)" />
                </span>
                <h2 className="rm-modal__title" id="rm-join-modal-title">
                  Join a Room
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
              Enter the Room Code shared by your team lead. A join request will be
              sent to the room creator for approval.
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
                <label className="rm-modal__label" htmlFor="rm-join-room-code">
                  <span>Room Code</span>
                </label>
                <input
                  ref={inputRef}
                  id="rm-join-room-code"
                  type="text"
                  className={`rm-modal__input rm-modal__input--code ${
                    error ? 'rm-modal__input--error' : ''
                  }`}
                  placeholder="e.g. ABC123"
                  value={roomCode}
                  onChange={(e) => {
                    setRoomCode(e.target.value.toUpperCase());
                    setError('');
                    setApiError('');
                  }}
                  maxLength={20}
                  autoComplete="off"
                  spellCheck={false}
                  disabled={isSubmitting}
                />
                {error && <p className="rm-modal__error">{error}</p>}
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
                  icon={
                    isSubmitting ? (
                      <span className="rm-btn-spinner" aria-hidden="true" />
                    ) : (
                      <UserPlusIcon size={16} />
                    )
                  }
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Request'}
                </DtButton>
              </div>
            </form>
          </>
        ) : (
          /* Success confirmation state */
          <div className="rm-modal__success">
            <div className="rm-modal__success-icon">
              <CheckCircleIcon size={48} color="var(--accent-primary)" />
            </div>
            <h2 className="rm-modal__success-title">Request Sent!</h2>
            <p className="rm-modal__success-desc">
              Your join request for <strong>{roomCode.trim().toUpperCase()}</strong> has been sent.
              You'll be added once the room creator approves it.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RmJoinRoomModal;
