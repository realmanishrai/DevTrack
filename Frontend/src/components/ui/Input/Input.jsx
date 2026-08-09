import { useState } from 'react';
import './Input.css';

/**
 * Input
 * @param {string}   label       - visible label text
 * @param {string}   id          - required for a11y
 * @param {string}   type        - text | email | password | ...
 * @param {string}   placeholder
 * @param {string}   value
 * @param {function} onChange
 * @param {string}   error       - error message string
 * @param {boolean}  disabled
 * @param {boolean}  showToggle  - show/hide password toggle (only for type="password")
 */
function Input({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  showToggle = false,
  className = '',
  ...rest
}) {
  const [visible, setVisible] = useState(false);
  const inputType = type === 'password' && showToggle ? (visible ? 'text' : 'password') : type;

  const fieldClasses = [
    'input-field',
    showToggle ? 'has-suffix' : '',
    error ? 'input-error' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`input-wrapper ${className}`}>
      {label && (
        <label className="input-label" htmlFor={id}>
          {label}
        </label>
      )}
      <div className="input-field-wrap">
        <input
          id={id}
          type={inputType}
          className={fieldClasses}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={error ? 'true' : undefined}
          {...rest}
        />
        {type === 'password' && showToggle && (
          <button
            type="button"
            className="input-suffix"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Hide password' : 'Show password'}
            tabIndex={0}
          >
            {visible ? '🙈' : '👁️'}
          </button>
        )}
      </div>
      {error && (
        <span id={`${id}-error`} className="input-error-msg" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

export default Input;
