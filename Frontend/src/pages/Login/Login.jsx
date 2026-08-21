import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';
import { loginLpUser } from '../../loginAuth/lpAuthApi';
import './Login.css';

const panelFeatures = [
  { text: 'Real-time project progress tracking' },
  { text: 'Team collaboration built-in' },
  { text: 'Live activity feed across your rooms' },
  { text: 'Hit your development goals consistently' },
];

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    password: '',
  });

  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Clear form when user is redirected after logout
  useEffect(() => {
    if (sessionStorage.getItem('justLoggedOut')) {
      setForm({ username: '', password: '' });
      setRemember(false);
      setErrors({});
      setLoginError('');
      sessionStorage.removeItem('justLoggedOut');
    }
  }, []);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }

    if (loginError) {
      setLoginError('');
    }
  };

  const validate = () => {
    const errs = {};

    if (!form.username.trim()) {
      errs.username = 'Username is required.';
    }

    if (!form.password) {
      errs.password = 'Password is required.';
    }

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoginError('');

    const errs = validate();

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      await loginLpUser(
        form.username.trim(),
        form.password
      );

      navigate('/rooms');
    } catch (error) {
      setLoginError(
        error?.message || 'Login failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
      // Clear form fields after login attempt (success or failure)
      setForm({ username: '', password: '' });
    }
  };

  return (
    <div className="login-page">
      {/* ── Left visual panel ── */}
      <aside className="login-panel-left" aria-hidden="true">
        <div className="login-panel-brand">
          <div className="login-logo-icon">DT</div>
          <span className="login-brand-name">DevTrack</span>
        </div>

        <div className="login-panel-headline">
          <h2>Welcome back to your dev dashboard</h2>
          <p>
            Your projects, your team, and your progress — all in one place.
            Pick up right where you left off.
          </p>
        </div>

        <div className="login-panel-features">
          {panelFeatures.map(({ text }) => (
            <div key={text} className="login-feature-item">
              <span className="login-feature-bullet" aria-hidden="true">                
                •
              </span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* ── Right form panel ── */}
      <main className="login-panel-right">
        <div className="login-form-card">
          <div className="login-form-header">
            <h1>Log In</h1>
            <p>Sign in to your DevTrack account.</p>
          </div>

          <form
            className="login-form"
            onSubmit={handleSubmit}
            noValidate
          >
            <Input
              id="login-username"
              label="Username"
              type="text"
              placeholder="Enter your username"
              value={form.username}
              onChange={handleChange('username')}
              error={errors.username}
              autoComplete="username"
            />

            <Input
              id="login-password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange('password')}
              error={errors.password}
              autoComplete="current-password"
            />

            <div className="login-form-extras">
              <label className="login-remember">
                <input
                  type="checkbox"
                  id="login-remember"
                  checked={remember}
                  onChange={() => setRemember((value) => !value)}
                />
                <span className="login-remember-label">
                  Remember me
                </span>
              </label>

              <a
                href="#"
                className="login-forgot"
                onClick={(e) => e.preventDefault()}
              >
                Forgot password?
              </a>
            </div>

            {loginError && (
              <p
                className="login-error-message"
                role="alert"
              >
                {loginError}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </Button>
          </form>

          <div className="login-divider">or</div>

          <p className="login-register-prompt">
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              className="login-register-link"
            >
              Create one — it&apos;s free
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Login;