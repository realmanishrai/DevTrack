import React, { useState, useRef, useEffect, useMemo } from 'react';
import TbPopover from '../TbPopover/TbPopover';
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon
} from '../../../assets/icons';
import './TbDatePicker.css';

export const TbDatePicker = ({
  value = '',
  onChange = () => { },
  placeholder = 'Select due date...',
  label = null,
  id = null,
  disabled = false,
  error = null,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);

  // Parse initial selected date or default to current date view
  const parsedValueDate = useMemo(() => {
    if (!value) return null;
    try {
      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        const [y, m, d] = value.split('-').map(Number);
        return new Date(y, m - 1, d);
      }
      const d = new Date(value);
      return isNaN(d.getTime()) ? null : d;
    } catch {
      return null;
    }
  }, [value]);

  // Calendar view navigation state (current visible month/year)
  const [viewDate, setViewDate] = useState(() => {
    return parsedValueDate || new Date();
  });

  // Sync view date if value changes
  useEffect(() => {
    if (parsedValueDate) {
      setViewDate(parsedValueDate);
    }
  }, [parsedValueDate]);

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
  };
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Format date display for trigger input (e.g. "Aug 25, 2026")
  const formattedDisplay = useMemo(() => {
    if (!parsedValueDate) return '';
    return parsedValueDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }, [parsedValueDate]);

  // Calendar Grid Calculation
  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth(); // 0-indexed

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayHeaders = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const days = [];

    // Previous month padding days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const dateObj = new Date(currentYear, currentMonth - 1, dayNum);
      days.push({
        date: dateObj,
        dayNum,
        isCurrentMonth: false,
        isPrevMonth: true
      });
    }

    // Current month days
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      const dateObj = new Date(currentYear, currentMonth, d);
      days.push({
        date: dateObj,
        dayNum: d,
        isCurrentMonth: true
      });
    }

    // Next month padding days to complete 42 cells (6 rows)
    const remainingDays = 42 - days.length;
    for (let d = 1; d <= remainingDays; d++) {
      const dateObj = new Date(currentYear, currentMonth + 1, d);
      days.push({
        date: dateObj,
        dayNum: d,
        isCurrentMonth: false,
        isNextMonth: true
      });
    }

    return days;
  }, [currentYear, currentMonth]);

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleDaySelect = (dayObj) => {
    const y = dayObj.date.getFullYear();
    const m = String(dayObj.date.getMonth() + 1).padStart(2, '0');
    const d = String(dayObj.date.getDate()).padStart(2, '0');
    const isoDateStr = `${y}-${m}-${d}`;
    onChange(isoDateStr);
    setIsOpen(false);
  };

  const handleSelectToday = (e) => {
    e.stopPropagation();
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    onChange(`${y}-${m}-${d}`);
    setViewDate(today);
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    setIsOpen(false);
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date) => {
    if (!parsedValueDate) return false;
    return (
      date.getDate() === parsedValueDate.getDate() &&
      date.getMonth() === parsedValueDate.getMonth() &&
      date.getFullYear() === parsedValueDate.getFullYear()
    );
  };

  return (
    <div className={`tb-date-picker ${className}`}>
      {label && (
        <label className="tb-date-picker__label" htmlFor={id}>
          {label}
        </label>
      )}

      <div className="tb-date-picker__control-wrapper">
        <button
          ref={triggerRef}
          id={id}
          type="button"
          className={`tb-date-picker__trigger ${isOpen ? 'tb-date-picker__trigger--open' : ''} ${error ? 'tb-date-picker__trigger--error' : ''}`}
          onClick={handleToggle}
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
        >
          <span className="tb-date-picker__icon" aria-hidden="true">
            <CalendarIcon size={16} color="var(--text-secondary)" />
          </span>

          <span className={`tb-date-picker__text ${!formattedDisplay ? 'tb-date-picker__placeholder' : ''}`}>
            {formattedDisplay || placeholder}
          </span>

          {formattedDisplay && !disabled && (
            <span
              className="tb-date-picker__clear-btn"
              onClick={handleClear}
              title="Clear date"
              aria-label="Clear date"
              role="button"
              tabIndex={0}
            >
              <CloseIcon size={13} color="var(--text-muted)" />
            </span>
          )}
        </button>

        {/* Custom Calendar Dropdown Panel rendered via TbPopover Portal */}
        <TbPopover
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          triggerRef={triggerRef}
          align="start"
          offset={4}
          estimatedHeight={340}
          zIndex={100001}
          ariaRole="dialog"
          ariaLabel="Calendar date picker"
        >
          <div className="tb-date-picker__popup" role="dialog" aria-label="Calendar date picker">
            {/* Header: Month / Year Navigation */}
            <div className="tb-date-picker__header">
              <button
                type="button"
                className="tb-date-picker__nav-btn"
                onClick={handlePrevMonth}
                title="Previous Month"
                aria-label="Previous Month"
              >
                <ChevronLeftIcon size={16} color="var(--text-secondary)" />
              </button>

              <span className="tb-date-picker__month-year">
                {monthNames[currentMonth]} {currentYear}
              </span>

              <button
                type="button"
                className="tb-date-picker__nav-btn"
                onClick={handleNextMonth}
                title="Next Month"
                aria-label="Next Month"
              >
                <ChevronRightIcon size={16} color="var(--text-secondary)" />
              </button>
            </div>

            {/* Weekdays Header */}
            <div className="tb-date-picker__weekdays">
              {dayHeaders.map((day) => (
                <span key={day} className="tb-date-picker__weekday">
                  {day}
                </span>
              ))}
            </div>

            {/* Day Grid */}
            <div className="tb-date-picker__days-grid">
              {calendarDays.map((dayObj, index) => {
                const isDaySelected = isSelected(dayObj.date);
                const isDayToday = isToday(dayObj.date);

                const dayClasses = [
                  'tb-date-picker__day',
                  !dayObj.isCurrentMonth ? 'tb-date-picker__day--outside' : '',
                  isDayToday ? 'tb-date-picker__day--today' : '',
                  isDaySelected ? 'tb-date-picker__day--selected' : ''
                ].filter(Boolean).join(' ');

                return (
                  <button
                    key={`${dayObj.date.toISOString()}-${index}`}
                    type="button"
                    className={dayClasses}
                    onClick={() => handleDaySelect(dayObj)}
                    aria-selected={isDaySelected}
                    title={dayObj.date.toDateString()}
                  >
                    {dayObj.dayNum}
                  </button>
                );
              })}
            </div>

            {/* Footer Shortcuts */}
            <div className="tb-date-picker__footer">
              <button
                type="button"
                className="tb-date-picker__shortcut-btn"
                onClick={handleSelectToday}
              >
                Today
              </button>
              {formattedDisplay && (
                <button
                  type="button"
                  className="tb-date-picker__shortcut-btn tb-date-picker__shortcut-btn--clear"
                  onClick={handleClear}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </TbPopover>
      </div>

      {error && <span className="tb-date-picker__error-msg">{error}</span>}
    </div>
  );
};

export default TbDatePicker;
