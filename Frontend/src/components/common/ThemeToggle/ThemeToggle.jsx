import './ThemeToggle.css';

/**
 * ThemeToggle — switches dark/light mode on document root
 * @param {string}   theme    - 'dark' | 'light'
 * @param {function} onToggle - callback to flip the theme
 */
function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      className="theme-toggle"
      onClick={onToggle}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}

export default ThemeToggle;
