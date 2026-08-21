import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from '../../common/ThemeToggle/ThemeToggle';
import Button from '../../ui/Button/Button';
import LpProfileFloating from '../lpprofilefloating/lpprofilefloating';
import { getCurrentUser, logoutUser } from '../../../api';
import { clearLpAuthTokens } from '../../../loginAuth/lpAuthStorage';
import './Navbar.css';

function Navbar({ theme, onToggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const loadCurrentUser = async () => {
      try {
        const userData = await getCurrentUser();

        if (!isMounted || !userData) {
          return;
        }

        setCurrentUser({
          id: userData.id,
          name:
            `${userData.firstname || ''} ${userData.lastname || ''}`.trim() ||
            userData.username,
          username: userData.username,
          email: userData.email,
        });
      } catch (error) {
        if (isMounted) {
          setCurrentUser(null);
        }
      }
    };

    loadCurrentUser();

    return () => {
      isMounted = false;
    };
  }, []);

  // Listen for logout events
  useEffect(() => {
    const handleStorageChange = () => {
      if (sessionStorage.getItem('justLoggedOut')) {
        setCurrentUser(null);
        sessionStorage.removeItem('justLoggedOut');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearLpAuthTokens();
      sessionStorage.setItem('justLoggedOut', 'true');
      setCurrentUser(null);
      navigate('/');
    }
  };

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

          <button className="navbar-link" onClick={() => scrollTo('features')}>
            Features
          </button>
          <button className="navbar-link" onClick={() => scrollTo('statistics')}>
            Statistics
          </button>
          <button className="navbar-link" onClick={() => scrollTo('how-it-works')}>
            How It Works
          </button>
        </div>

        {/* RIGHT — Theme toggle + Log In / Profile */}
        <div className="navbar-actions navbar-desktop-actions">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />

          {currentUser ? (
            <LpProfileFloating
              currentUser={currentUser}
              onLogout={handleLogout}
            />
          ) : (
            <Link to="/login">
              <Button variant="primary" size="sm">LOG IN</Button>
            </Link>
          )}
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
          <button className="navbar-mobile-link" onClick={() => scrollTo('how-it-works')}>
            How It Works
          </button>
          <button className="navbar-mobile-link" onClick={() => scrollTo('features')}>
            Features
          </button>
          <button className="navbar-mobile-link" onClick={() => scrollTo('statistics')}>
            Statistics
          </button>

          <div className="navbar-mobile-actions">
            {currentUser ? (
              <button
                type="button"
                className="navbar-mobile-link"
                onClick={() => navigate('/profile')}
              >
                Profile
              </button>
            ) : (
              <Link to="/login" onClick={closeMenu} style={{ flex: 1 }}>
                <Button variant="primary" fullWidth>LOG IN</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;