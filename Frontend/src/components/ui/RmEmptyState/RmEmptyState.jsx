import React from 'react';
import DtButton from '../DtButton/DtButton';
import { PlusIcon, UserPlusIcon } from '../../../assets/icons';
import './RmEmptyState.css';

/**
 * RmEmptyState — shown when the rooms list is empty.
 *
 * Props:
 *  onCreateRoom  () => void — opens the Create Room modal
 *  onJoinRoom    () => void — opens the Join Room modal
 */
const RmEmptyState = ({ onCreateRoom, onJoinRoom }) => {
  return (
    <div className="rm-empty-state">
      {/* Illustration */}
      <div className="rm-empty-state__illustration">
        <svg
          width="72"
          height="72"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="rm-empty-state__icon"
        >
          {/* Folder with a plus */}
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          <line x1="12" y1="11" x2="12" y2="17" />
          <line x1="9" y1="14" x2="15" y2="14" />
        </svg>
      </div>

      <div className="rm-empty-state__content">
        <h2 className="rm-empty-state__title">No rooms yet</h2>
        <p className="rm-empty-state__description">
          Create a new room to start collaborating, or join an existing room
          using a code shared by your team lead.
        </p>
      </div>

      <div className="rm-empty-state__actions">
        <DtButton
          variant="primary"
          size="md"
          icon={<PlusIcon size={16} />}
          onClick={onCreateRoom}
          id="rm-empty-create-btn"
        >
          Create Room
        </DtButton>
        <DtButton
          variant="outline"
          size="md"
          icon={<UserPlusIcon size={16} />}
          onClick={onJoinRoom}
          id="rm-empty-join-btn"
        >
          Join Room
        </DtButton>
      </div>
    </div>
  );
};

export default RmEmptyState;
