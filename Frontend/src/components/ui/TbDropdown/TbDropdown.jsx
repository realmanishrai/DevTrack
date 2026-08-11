import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDownIcon, CheckIcon } from '../../../assets/icons';
import './TbDropdown.css';

export const TbDropdown = ({
  options = [],
  value,
  onChange = () => {},
  placeholder = 'Select option...',
  label = null,
  id = null,
  disabled = false,
  size = 'md', // 'sm' | 'md'
  prefix = null,
  icon = null,
  fullWidth = false,
  className = '',
  ariaLabel = null
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [portalStyles, setPortalStyles] = useState({});
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const listRef = useRef(null);
  const triggerRef = useRef(null);

  // Normalize options array into { value, label, icon, badge, disabled }
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === 'object' && opt !== null) {
      return {
        value: opt.value,
        label: opt.label || String(opt.value),
        icon: opt.icon || null,
        badge: opt.badge || null,
        disabled: Boolean(opt.disabled)
      };
    }
    return {
      value: opt,
      label: String(opt),
      icon: null,
      badge: null,
      disabled: false
    };
  });

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // Accurate Viewport Positioning & Auto-Flip for React Portal
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const itemHeight = size === 'sm' ? 32 : 36;
    const estimatedMenuHeight = Math.min(260, normalizedOptions.length * itemHeight + 16);

    const vv = window.visualViewport;
    const viewportHeight = vv ? vv.height : window.innerHeight;
    const viewportWidth = vv ? vv.width : window.innerWidth;
    const viewportTop = vv ? vv.pageTop : 0;
    const viewportLeft = vv ? vv.pageLeft : 0;

    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;

    // Flip upward if space below is too small and space above is larger or sufficient
    const shouldFlip =
      (spaceBelow < estimatedMenuHeight && spaceAbove > spaceBelow) ||
      (spaceBelow < 160 && spaceAbove >= 130);

    setIsFlipped(shouldFlip);

    const menuWidth = fullWidth ? rect.width : Math.max(rect.width, 180);

    // Clamp horizontal position so menu stays strictly on screen
    let left = rect.left;
    if (left + menuWidth > viewportWidth - 8) {
      left = Math.max(8, viewportWidth - menuWidth - 8);
    }
    if (left < 8) left = 8;

    let computedMaxHeight;
    const styles = {
      position: 'fixed',
      left: `${left}px`,
      width: `${menuWidth}px`,
      zIndex: 99999
    };

    if (shouldFlip) {
      styles.bottom = `${viewportHeight - rect.top + 4}px`;
      styles.top = 'auto';
      computedMaxHeight = Math.min(260, Math.max(100, spaceAbove - 16));
    } else {
      styles.top = `${rect.bottom + 4}px`;
      styles.bottom = 'auto';
      computedMaxHeight = Math.min(260, Math.max(100, spaceBelow - 16));
    }

    styles.maxHeight = `${computedMaxHeight}px`;
    setPortalStyles(styles);
  }, [normalizedOptions.length, size, fullWidth]);

  const handleToggle = (e) => {
    e?.stopPropagation();
    if (disabled) return;
    if (!isOpen) {
      updatePosition();
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  // Recompute position on open, scroll, resize, or visualViewport changes
  useLayoutEffect(() => {
    if (isOpen) {
      updatePosition();
    }
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) return;

    const handleScrollOrResize = () => {
      updatePosition();
    };

    const handleClickOutside = (e) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        listRef.current && !listRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, true);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleScrollOrResize);
      window.visualViewport.addEventListener('scroll', handleScrollOrResize);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });

    return () => {
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleScrollOrResize);
        window.visualViewport.removeEventListener('scroll', handleScrollOrResize);
      }
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, updatePosition]);

  // Set initial highlighted index on open
  useEffect(() => {
    if (isOpen) {
      const selectedIdx = normalizedOptions.findIndex((opt) => opt.value === value);
      setHighlightedIndex(selectedIdx >= 0 ? selectedIdx : 0);
    }
  }, [isOpen, value, normalizedOptions]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (isOpen && listRef.current && highlightedIndex >= 0) {
      const listItems = listRef.current.querySelectorAll('.tb-dropdown__option');
      if (listItems[highlightedIndex]) {
        listItems[highlightedIndex].scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleSelect = useCallback((opt, e) => {
    e?.stopPropagation();
    if (opt.disabled) return;
    onChange(opt.value);
    setIsOpen(false);
    triggerRef.current?.focus();
  }, [onChange]);

  // Keyboard navigation handler
  const handleKeyDown = (e) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        updatePosition();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        setHighlightedIndex((prev) => {
          let next = prev + 1;
          while (next < normalizedOptions.length && normalizedOptions[next].disabled) {
            next++;
          }
          return next < normalizedOptions.length ? next : prev;
        });
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        setHighlightedIndex((prev) => {
          let next = prev - 1;
          while (next >= 0 && normalizedOptions[next].disabled) {
            next--;
          }
          return next >= 0 ? next : prev;
        });
        break;
      }
      case 'Enter':
      case ' ': {
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < normalizedOptions.length) {
          handleSelect(normalizedOptions[highlightedIndex], e);
        }
        break;
      }
      case 'Escape': {
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
        break;
      }
      case 'Tab': {
        setIsOpen(false);
        break;
      }
      default: {
        // Quick type-to-jump character search
        if (e.key.length === 1) {
          const char = e.key.toLowerCase();
          const matchIdx = normalizedOptions.findIndex((opt, idx) =>
            idx > highlightedIndex && !opt.disabled && opt.label.toLowerCase().startsWith(char)
          );
          if (matchIdx >= 0) {
            setHighlightedIndex(matchIdx);
          } else {
            const firstMatchIdx = normalizedOptions.findIndex((opt) =>
              !opt.disabled && opt.label.toLowerCase().startsWith(char)
            );
            if (firstMatchIdx >= 0) {
              setHighlightedIndex(firstMatchIdx);
            }
          }
        }
      }
    }
  };

  const containerClasses = [
    'tb-dropdown',
    `tb-dropdown--${size}`,
    fullWidth ? 'tb-dropdown--full' : '',
    isOpen ? 'tb-dropdown--open' : '',
    disabled ? 'tb-dropdown--disabled' : '',
    className
  ].filter(Boolean).join(' ');

  const menuClasses = [
    'tb-dropdown__menu',
    'tb-dropdown__menu--portal',
    isFlipped ? 'tb-dropdown__menu--flipped' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses} ref={dropdownRef}>
      {label && (
        <label className="tb-dropdown__label" htmlFor={id}>
          {label}
        </label>
      )}

      <div className="tb-dropdown__control-wrapper">
        <button
          ref={triggerRef}
          id={id}
          type="button"
          className="tb-dropdown__trigger"
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={ariaLabel || label || placeholder}
        >
          <div className="tb-dropdown__trigger-content">
            {icon && <span className="tb-dropdown__icon">{icon}</span>}
            {prefix && <span className="tb-dropdown__prefix">{prefix}</span>}
            <span className={`tb-dropdown__selected-text ${!selectedOption ? 'tb-dropdown__placeholder' : ''}`}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>

          <span className={`tb-dropdown__chevron ${isOpen ? 'tb-dropdown__chevron--rotated' : ''}`}>
            <ChevronDownIcon size={14} color="var(--text-secondary)" />
          </span>
        </button>

        {/* Portal-Based Floating Menu Panel */}
        {isOpen && createPortal(
          <div
            className={menuClasses}
            role="listbox"
            ref={listRef}
            style={portalStyles}
            onClick={(e) => e.stopPropagation()}
          >
            <ul className="tb-dropdown__list">
              {normalizedOptions.map((opt, index) => {
                const isSelected = opt.value === value;
                const isHighlighted = index === highlightedIndex;

                const optionClasses = [
                  'tb-dropdown__option',
                  isSelected ? 'tb-dropdown__option--selected' : '',
                  isHighlighted ? 'tb-dropdown__option--highlighted' : '',
                  opt.disabled ? 'tb-dropdown__option--disabled' : ''
                ].filter(Boolean).join(' ');

                return (
                  <li
                    key={`${opt.value}-${index}`}
                    className={optionClasses}
                    role="option"
                    aria-selected={isSelected}
                    onClick={(e) => handleSelect(opt, e)}
                    onMouseEnter={() => !opt.disabled && setHighlightedIndex(index)}
                  >
                    <div className="tb-dropdown__option-content">
                      {opt.icon && <span className="tb-dropdown__option-icon">{opt.icon}</span>}
                      <span className="tb-dropdown__option-label">{opt.label}</span>
                      {opt.badge && <span className="tb-dropdown__option-badge">{opt.badge}</span>}
                    </div>

                    {isSelected && (
                      <span className="tb-dropdown__checkmark" aria-hidden="true">
                        <CheckIcon size={14} color="var(--accent-primary)" />
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>,
          document.body
        )}
      </div>
    </div>
  );
};

export default TbDropdown;
