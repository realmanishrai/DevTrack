import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar/Navbar';
import LandingPage from './pages/LandingPage/LandingPage';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import './index.css';


function Layout({ theme, onToggleTheme }) {
  const { pathname } = useLocation();
  const showNavbar = pathname === '/';

  return (
    <>
      {showNavbar && <Navbar theme={theme} onToggleTheme={onToggleTheme} />}
      <Routes>
        <Route path="/"         element={<LandingPage />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

/**
 * App root — manages theme state and provides router.
 */
function App() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('devtrack-theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('devtrack-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <BrowserRouter>
      <Layout theme={theme} onToggleTheme={toggleTheme} />
    </BrowserRouter>
  );
}

export default App;
