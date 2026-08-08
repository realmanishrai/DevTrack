import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from '../../common/ThemeToggle/ThemeToggle';
import Button from '../../ui/Button/Button';
import './Navbar.css';

function Navbar({ theme, onToggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const closeMenu = () => setMenuOpen(false);

  const scrollTo = (id) => {
    closeMenu();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="container navbar-inner">

        {/* LEFT — Brand text only, no icon */}
        <Link to="/" className="navbar-brand" aria-label="DevTrack home">
          <span className="navbar-brand-name">DevTrack</span>
        </Link>

        {/* CENTER — Desktop nav links, widely spaced */}
        <div className="navbar-links" aria-label="Site sections">
          <button className="navbar-link" onClick={() => scrollTo('why-devtrack')}>
            Why DevTrack
          </button>
          <button className="navbar-link" onClick={() => scrollTo('features')}>
            Features
          </button>
          <button className="navbar-link" onClick={() => scrollTo('statistics')}>
            Statistics
          </button>
        </div>

        {/* RIGHT — Theme toggle + Log In (desktop) */}
        <div className="navbar-actions navbar-desktop-actions">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <Link to="/login">
            <Button variant="primary" size="sm">LOG IN</Button>
          </Link>
        </div>

        {/* Mobile — theme toggle + hamburger */}
        <div className="navbar-mobile-right">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button
            className={`navbar-hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>

      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div id="mobile-menu" className="navbar-mobile-menu" role="menu">
          <button className="navbar-mobile-link" onClick={() => scrollTo('why-devtrack')}>
            Why DevTrack
          </button>
          <button className="navbar-mobile-link" onClick={() => scrollTo('features')}>
            Features
          </button>
          <button className="navbar-mobile-link" onClick={() => scrollTo('statistics')}>
            Statistics
          </button>
          <div className="navbar-mobile-actions">
            <Link to="/login" onClick={closeMenu} style={{ flex: 1 }}>
              <Button variant="primary" fullWidth>LOG IN</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
