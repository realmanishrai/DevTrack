import React, { useState } from 'react';
import DtButton from '../../ui/DtButton/DtButton';
import { CopyIcon, CheckIcon, ShareIcon } from '../../../assets/icons';
import './RoomCodeDisplay.css';

export const RoomCodeDisplay = ({
  code = 'DEV-0000',
  onInviteClick = null,
  className = ''
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = code;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error('Failed to copy room code:', err);
    }
  };

  return (
    <div className={`dt-room-code-display ${className}`}>
      <div className="dt-room-code-pill" title="Room Invitation Code">
        <span className="dt-room-code-label">CODE:</span>
        <span className="dt-room-code-value">{code}</span>
      </div>

      <div className="dt-room-code-actions">
        <DtButton
          variant={copied ? 'secondary' : 'outline'}
          size="sm"
          icon={copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
          onClick={handleCopyCode}
        >
          {copied ? 'Copied!' : 'Copy Code'}
        </DtButton>

        <DtButton
          variant="outline"
          size="sm"
          icon={<ShareIcon size={16} />}
          onClick={onInviteClick || (() => alert(`Invite link for Room Code: ${code} copied to share!`))}
        >
          Share
        </DtButton>
      </div>
    </div>
  );
};

export default RoomCodeDisplay;
