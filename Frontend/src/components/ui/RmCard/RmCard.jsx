import React, { useState, useRef } from 'react';
import DtButton from '../DtButton/DtButton';
import RmPopover from '../RmPopover/RmPopover';
import {
  ArrowRightIcon,
  LogoutIcon,
  TrashIcon,
  AlertCircleIcon,
  CopyIcon,
  CheckIcon,
  InfoIcon,
} from '../../../assets/icons';
import './RmCard.css';

/**
 * RmCard — Horizontal room row for the Rooms page list.
 * Layout:
 *   [icon] [Name + [copy] Code + [Info] (left)] ————— [Open Room (top right)]
 *                                                     [Leave] [Delete] (bottom right)
 *
 * Props:
 *  room            { id, roomCode, name, description, createdByUserId }
 *  currentUserId   number | string — compared against room.createdByUserId to show Delete
 *  onOpenRoom      (roomCode) => void
 *  onLeaveRoom     (roomCode) => Promise<{ success: boolean, error?: string }>
 *  onDeleteRoom    (roomCode) => Promise<{ success: boolean, error?: string }>
 */
const RmCard = ({
  room,
  currentUserId,
  onOpenRoom,
  onLeaveRoom,
  onDeleteRoom,
}) => {
  const [confirmState, setConfirmState] = useState(null); // null | 'leave' | 'delete'
  const [actionError, setActionError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showDescPopover, setShowDescPopover] = useState(false);

  const infoBtnRef = useRef(null);

  // Delete button is only visible if the current logged-in user created this room
  const isCreator = Boolean(
    currentUserId && Number(room.createdByUserId) === Number(currentUserId)
  );

  const handleCopyCode = async (e) => {
    e.stopPropagation();
    if (!room.roomCode) return;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(room.roomCode);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = room.roomCode;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy room code:', err);
    }
  };

  const handleLeaveClick = () => {
    setConfirmState('leave');
    setActionError('');
    setIsSubmitting(false);
  };

  const handleDeleteClick = () => {
    setConfirmState('delete');
    setActionError('');
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    setConfirmState(null);
    setActionError('');
    setIsSubmitting(false);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setActionError('');

    if (confirmState === 'leave') {
      const result = await onLeaveRoom(room.roomCode);
      if (result && !result.success) {
        setActionError(result.error || 'Failed to leave room.');
        setIsSubmitting(false);
        return;
      }
    } else if (confirmState === 'delete') {
      const result = await onDeleteRoom(room.roomCode);
      if (result && !result.success) {
        setActionError(result.error || 'Failed to delete room.');
        setIsSubmitting(false);
        return;
      }
    }

    setIsSubmitting(false);
    setConfirmState(null);
  };

  const hasDescription = Boolean(room.description && room.description.trim());

  return (
    <div className="rm-card">
      {/* ── Main row ── */}
      <div className="rm-card__body">
        {/* Left: folder icon + name + code + info icon */}
        <div className="rm-card__left">
          {/* Folder icon */}
          <div className="rm-card__icon-wrapper">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </div>

          {/* Left info: name + code stacked */}
          <div className="rm-card__info">
            <h3 className="rm-card__name">{room.name}</h3>
            <div className="rm-card__code-wrapper">
              <span className="rm-card__code-label">Room Code</span>
              <div className="rm-card__code-pill" title="Click icon to copy room code">
                <button
                  type="button"
                  className={`rm-card__copy-btn ${copied ? 'rm-card__copy-btn--copied' : ''}`}
                  onClick={handleCopyCode}
                  title={copied ? 'Copied to clipboard!' : 'Copy room code'}
                  aria-label={`Copy room code ${room.roomCode}`}
                >
                  {copied ? (
                    <CheckIcon size={12} color="var(--accent-primary)" />
                  ) : (
                    <CopyIcon size={12} />
                  )}
                </button>
                <span className="rm-card__code">{room.roomCode}</span>
                {copied && <span className="rm-card__copied-badge">Copied!</span>}
              </div>

              {/* Info / Description button placed on the right side of the room code */}
              {hasDescription && (
                <>
                  <button
                    ref={infoBtnRef}
                    type="button"
                    className={`rm-card__info-btn ${
                      showDescPopover ? 'rm-card__info-btn--active' : ''
                    }`}
                    onClick={() => setShowDescPopover((prev) => !prev)}
                    title="View room description"
                    aria-label="View room description"
                    aria-expanded={showDescPopover}
                  >
                    <InfoIcon size={16} />
                  </button>

                  <RmPopover
                    isOpen={showDescPopover}
                    onClose={() => setShowDescPopover(false)}
                    triggerRef={infoBtnRef}
                    align="start"
                    offset={8}
                    className="rm-card__desc-popover"
                  >
                    <div className="rm-card__desc-panel">
                      <div className="rm-card__desc-header">
                        <span className="rm-card__desc-title">Description</span>
                      </div>
                      <p className="rm-card__desc-body">{room.description}</p>
                    </div>
                  </RmPopover>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: action buttons — Open Room on top right, Leave & Delete stacked below */}
        {!confirmState && (
          <div className="rm-card__actions">
            {/* Open Room — primary CTA sitting at top right edge */}
            <DtButton
              variant="primary"
              size="sm"
              icon={<ArrowRightIcon size={14} />}
              iconPosition="right"
              onClick={() => onOpenRoom(room.roomCode)}
              className="rm-card__btn-open"
            >
              Open Room
            </DtButton>

            {/* Sub-actions (Leave, Delete) stacked directly under Open Room */}
            <div className="rm-card__sub-actions">
              {/* Leave — always visible */}
              <button
                type="button"
                className="rm-card__icon-btn rm-card__icon-btn--leave"
                onClick={handleLeaveClick}
                title="Leave Room"
              >
                <LogoutIcon size={13} />
                <span>Leave</span>
              </button>

              {/* Delete — creator only */}
              {isCreator && (
                <button
                  type="button"
                  className="rm-card__icon-btn rm-card__icon-btn--delete"
                  onClick={handleDeleteClick}
                  title="Delete Room"
                >
                  <TrashIcon size={13} />
                  <span>Delete</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Inline confirmation strip ── */}
      {confirmState && (
        <div className="rm-card__confirm">
          {actionError ? (
            <div className="rm-card__confirm-error" role="alert">
              <AlertCircleIcon size={16} />
              <span>{actionError}</span>
            </div>
          ) : (
            <p className="rm-card__confirm-text">
              {confirmState === 'leave'
                ? 'Are you sure you want to leave this room?'
                : 'Are you sure you want to permanently delete this room?'}
            </p>
          )}

          <div className="rm-card__confirm-actions">
            <DtButton
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              {actionError ? 'Dismiss' : 'Cancel'}
            </DtButton>
            {!actionError && (
              <DtButton
                variant="danger"
                size="sm"
                onClick={handleConfirm}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? confirmState === 'leave'
                    ? 'Leaving...'
                    : 'Deleting...'
                  : confirmState === 'leave'
                  ? 'Leave'
                  : 'Delete'}
              </DtButton>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RmCard;
