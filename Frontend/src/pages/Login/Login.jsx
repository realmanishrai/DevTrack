import { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';
import './Login.css';

const panelFeatures = [
  { text: 'Real-time project progress tracking' },
  {  text: 'Team collaboration built-in' },
  {  text: 'Live activity feed across your rooms' },
  {  text: 'Hit your development goals consistently' },
];

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    // clear error on change
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.email.trim())          errs.email    = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email address.';
    if (!form.password)              errs.password = 'Password is required.';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    // No real auth — prototype only
    alert('Login prototype: no backend connected.');
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
          {panelFeatures.map(({ icon, text }) => (
            <div key={text} className="login-feature-item">
              <div className="login-feature-icon">{icon}</div>
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

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <Input
              id="login-email"
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange('email')}
              error={errors.email}
              autoComplete="email"
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
                  onChange={() => setRemember((v) => !v)}
                />
                <span className="login-remember-label">Remember me</span>
              </label>
              <a href="#" className="login-forgot" onClick={(e) => e.preventDefault()}>
                Forgot password?
              </a>
            </div>

            <Button type="submit" variant="primary" size="lg" fullWidth>
              Log In
            </Button>
          </form>

          <div className="login-divider">or</div>

          <p className="login-register-prompt">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="login-register-link">
              Create one — it&apos;s free
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Login;
