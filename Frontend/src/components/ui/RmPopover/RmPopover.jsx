import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import './RmPopover.css';

/**
 * RmPopover — Portalled popover with smart positioning, edge clamping, and flipping.
 * Follows the Rm prefix convention for the Rooms page.
 */
export const RmPopover = ({
  isOpen = false,
  onClose = () => {},
  triggerRef,
  children,
  align = 'center', // 'start' | 'end' | 'center'
  offset = 8,
  estimatedHeight = 120,
  className = '',
  zIndex = 99999,
  ariaRole = 'tooltip',
  ariaLabel = 'Room Description',
}) => {
  const popoverRef = useRef(null);
  const [positionStyles, setPositionStyles] = useState({
    position: 'fixed',
    top: '0px',
    left: '0px',
    zIndex: zIndex + 1,
    visibility: 'hidden',
  });
  const [isFlipped, setIsFlipped] = useState(false);

  const calculatePosition = useCallback(() => {
    if (!triggerRef?.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const popoverEl = popoverRef.current;
    const contentWidth =
      popoverEl && popoverEl.offsetWidth > 0 ? popoverEl.offsetWidth : 280;
    const contentHeight =
      popoverEl && popoverEl.offsetHeight > 0
        ? popoverEl.offsetHeight
        : estimatedHeight;

    const spaceBelow = viewportHeight - triggerRect.bottom - offset;
    const spaceAbove = triggerRect.top - offset;

    // Flip upwards if inadequate space below and more space above
    const shouldFlip = spaceBelow < contentHeight && spaceAbove > spaceBelow;
    setIsFlipped(shouldFlip);

    // Horizontal calculation
    let left = triggerRect.left;
    if (align === 'end') {
      left = triggerRect.right - contentWidth;
    } else if (align === 'center') {
      left = triggerRect.left + (triggerRect.width - contentWidth) / 2;
    }

    // Clamp horizontally to stay inside viewport with an 12px gutter
    left = Math.max(12, Math.min(left, viewportWidth - contentWidth - 12));

    const styles = {
      position: 'fixed',
      left: `${Math.round(left)}px`,
      zIndex: zIndex + 1,
      visibility: 'visible',
    };

    if (shouldFlip) {
      styles.bottom = `${Math.round(viewportHeight - triggerRect.top + offset)}px`;
      styles.top = 'auto';
      styles.maxHeight = `${Math.max(100, Math.floor(spaceAbove - 8))}px`;
    } else {
      styles.top = `${Math.round(triggerRect.bottom + offset)}px`;
      styles.bottom = 'auto';
      styles.maxHeight = `${Math.max(100, Math.floor(spaceBelow - 8))}px`;
    }

    setPositionStyles(styles);
  }, [triggerRef, align, offset, estimatedHeight, zIndex]);

  useLayoutEffect(() => {
    if (isOpen) {
      calculatePosition();
    }
  }, [isOpen, calculatePosition]);

  useEffect(() => {
    if (!isOpen) return;

    const handleUpdate = () => {
      calculatePosition();
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('resize', handleUpdate);
    window.addEventListener('scroll', handleUpdate, true);
    window.addEventListener('keydown', handleKeyDown);

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleUpdate);
      window.visualViewport.addEventListener('scroll', handleUpdate);
    }

    return () => {
      window.removeEventListener('resize', handleUpdate);
      window.removeEventListener('scroll', handleUpdate, true);
      window.removeEventListener('keydown', handleKeyDown);

      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleUpdate);
        window.visualViewport.removeEventListener('scroll', handleUpdate);
      }
    };
  }, [isOpen, calculatePosition, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Invisible backdrop for outside click detection */}
      <div
        className="rm-popover__backdrop"
        style={{ zIndex }}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        onTouchStart={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />

      {/* Floating Popover Container */}
      <div
        ref={popoverRef}
        className={`rm-popover__content ${
          isFlipped ? 'rm-popover__content--flipped' : ''
        } ${className}`}
        style={positionStyles}
        role={ariaRole}
        aria-label={ariaLabel}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </>,
    document.body
  );
};

export default RmPopover;
