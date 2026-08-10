import React from 'react';
import { SearchIcon, CloseIcon } from '../../../assets/icons';
import './TbSearchBar.css';

export const TbSearchBar = ({
  value = '',
  onChange = () => {},
  onClear = () => {},
  placeholder = 'Search tasks by name or description...',
  className = '',
  disabled = false,
  autoFocus = false
}) => {
  const handleInputChange = (e) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onClear();
    onChange('');
  };

  return (
    <div className={`tb-search-bar ${className}`}>
      <span className="tb-search-bar__icon" aria-hidden="true">
        <SearchIcon size={18} color="var(--text-muted)" />
      </span>

      <input
        type="text"
        className="tb-search-bar__input"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        aria-label="Search tasks"
      />

      {value && !disabled && (
        <button
          type="button"
          className="tb-search-bar__clear-btn"
          onClick={handleClear}
          title="Clear search"
          aria-label="Clear search"
        >
          <CloseIcon size={14} color="var(--text-secondary)" />
        </button>
      )}
    </div>
  );
};

export default TbSearchBar;
