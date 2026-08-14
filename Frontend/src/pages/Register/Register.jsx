import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';
import { registerLpUser } from '../../loginAuth/lpAuthApi';
import './Register.css';

const onboardingSteps = [
  {
    num: '1',
    title: 'Create your profile',
    desc: 'Set up your developer identity in under a minute.',
  },
  {
    num: '2',
    title: 'Join or create a room',
    desc: 'Connect with your team or start a new project room.',
  },
  {
    num: '3',
    title: 'Track & collaborate',
    desc: 'Log progress, review activity, and ship faster together.',
  },
];

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [registerError, setRegisterError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

    if (registerError) {
      setRegisterError('');
    }
  };

  const validate = () => {
    const errs = {};

    if (!form.firstName.trim()) {
      errs.firstName = 'First name is required.';
    }

    if (!form.lastName.trim()) {
      errs.lastName = 'Last name is required.';
    }

    if (!form.username.trim()) {
      errs.username = 'Username is required.';
    }

    if (!form.email.trim()) {
      errs.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errs.email = 'Enter a valid email.';
    }

    if (!form.password) {
      errs.password = 'Password is required.';
    } else if (form.password.length < 8) {
      errs.password = 'Password must be at least 8 characters.';
    }

    if (!form.confirmPassword) {
      errs.confirmPassword = 'Please confirm your password.';
    } else if (form.password !== form.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    if (!terms) {
      errs.terms = 'You must accept the terms to continue.';
    }

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setRegisterError('');

    const errs = validate();

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      await registerLpUser({
        firstname: form.firstName.trim(),
        lasttname: form.lastName.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      navigate('/login');
    } catch (error) {
      setRegisterError(
        error?.message || 'Registration failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      {/* ── Left panel ── */}
      <aside className="register-panel-left" aria-hidden="true">
        <div className="register-panel-brand">
          <div className="register-logo-icon">DT</div>
          <span className="register-brand-name">DevTrack</span>
        </div>

        <div className="register-panel-headline">
          <h2>Start building better, together</h2>
          <p>
            Create your free account and bring your team's development workflow
            into one focused platform.
          </p>
        </div>

        <div className="register-steps">
          {onboardingSteps.map(({ num, title, desc }) => (
            <div key={num} className="register-step">
              <div className="register-step-num">{num}</div>
              <div className="register-step-text">
                <span className="register-step-title">{title}</span>
                <span className="register-step-desc">{desc}</span>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* ── Right form panel ── */}
      <main className="register-panel-right">
        <div className="register-form-card">
          <div className="register-form-header">
            <h1>Create Account</h1>
            <p>Join DevTrack — free forever for small teams.</p>
          </div>

          <form className="register-form" onSubmit={handleSubmit} noValidate>
            {/* Name row */}
            <div className="register-name-row">
              <Input
                id="register-first-name"
                label="First Name"
                type="text"
                placeholder="Alex"
                value={form.firstName}
                onChange={handleChange('firstName')}
                error={errors.firstName}
                autoComplete="given-name"
              />

              <Input
                id="register-last-name"
                label="Last Name"
                type="text"
                placeholder="Johnson"
                value={form.lastName}
                onChange={handleChange('lastName')}
                error={errors.lastName}
                autoComplete="family-name"
              />
            </div>

            <Input
              id="register-username"
              label="Username"
              type="text"
              placeholder="Enter your username"
              value={form.username}
              onChange={handleChange('username')}
              error={errors.username}
              autoComplete="username"
            />

            <Input
              id="register-email"
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange('email')}
              error={errors.email}
              autoComplete="email"
            />

            <Input
              id="register-password"
              label="Password"
              type="password"
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={handleChange('password')}
              error={errors.password}
              autoComplete="new-password"
            />

            <Input
              id="register-confirm-password"
              label="Confirm Password"
              type="password"
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              onChange={handleChange('confirmPassword')}
              error={errors.confirmPassword}
              autoComplete="new-password"
            />

            {/* Terms */}
            <div className="register-terms">
              <input
                type="checkbox"
                id="register-terms"
                checked={terms}
                onChange={() => {
                  setTerms((v) => !v);

                  if (errors.terms) {
                    setErrors((prev) => ({
                      ...prev,
                      terms: '',
                    }));
                  }
                }}
              />

              <label
                htmlFor="register-terms"
                className="register-terms-label"
              >
                I agree to the{' '}
                <a
                  href="#"
                  className="register-terms-link"
                  onClick={(e) => e.preventDefault()}
                >
                  Terms of Service
                </a>{' '}
                and{' '}
                <a
                  href="#"
                  className="register-terms-link"
                  onClick={(e) => e.preventDefault()}
                >
                  Privacy Policy
                </a>
                .

                {errors.terms && (
                  <span
                    role="alert"
                    style={{
                      display: 'block',
                      color: 'var(--danger)',
                      fontSize: 'var(--text-tiny)',
                      marginTop: '4px',
                    }}
                  >
                    {errors.terms}
                  </span>
                )}
              </label>
            </div>

            {registerError && (
              <p className="register-error-message" role="alert">
                {registerError}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="register-divider">or</div>

          <p className="register-login-prompt">
            Already have an account?{' '}
            <Link to="/login" className="register-login-link">
              Log In
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Register;