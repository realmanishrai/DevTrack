import { useEffect, useState } from 'react';
import { Link ,  useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button/Button';
import Card from '../../components/ui/Card/Card';

import { getCurrentUser } from '../../api';
import heroTeamImg from '../../assets/hero-team.png';
import './LandingPage.css';

const whyCards = [
  {
    icon: '📊',
    title: 'Track Progress',
    body: 'Visualise exactly where your project stands with real-time progress boards and milestone tracking.',
  },
  {
    icon: '🤝',
    title: 'Collaborate',
    body: 'Invite teammates, share progress, leave feedback, and stay aligned across every sprint.',
  },
  {
    icon: '🎯',
    title: 'Stay Consistent',
    body: 'Daily goals, streaks, and habit tracking keep every developer accountable and on track.',
  },
  {
    icon: '🚀',
    title: 'Grow Together',
    body: 'Shared dashboards and analytics reveal team strengths and surface opportunities to improve.',
  },
];

const features = [
  {
    icon: '📈',
    title: 'Progress Tracking',
    body: 'Track tasks, commits, and milestones in a single unified developer timeline.',
  },
  {
    icon: '🏠',
    title: 'Development Rooms',
    body: 'Create focused rooms for each project or team — private spaces for collaboration.',
  },
  {
    icon: '👥',
    title: 'Team Collaboration',
    body: 'Comment, review, and coordinate with teammates without leaving your workflow.',
  },
  {
    icon: '⚡',
    title: 'Activity Monitor',
    body: 'A live activity feed gives leaders and members a pulse on all project actions.',
  },
  {
    icon: '📉',
    title: 'Statistics & Insights',
    body: 'Beautiful charts and reports that show velocity, completion rates, and trends.',
  },
  {
    icon: '🧑‍💻',
    title: 'Developer Profiles',
    body: 'Each developer builds a rich profile showcasing skills, contributions, and goals.',
  },
];

const stats = [
  { value: '10K+', label: 'Developers' },
  { value: '500+', label: 'Development Rooms' },
  { value: '25K+', label: 'Tasks Tracked' },
  { value: '95%', label: 'Active Teams' },
];

const howSteps = [
  {
    number: '01',
    title: 'Create Your Profile',
    desc: 'Sign up in seconds. Set your skills, goals, and timezone to personalise your DevTrack experience.',
  },
  {
    number: '02',
    title: 'Join or Create a Room',
    desc: 'Start a new development room for your project or accept an invite from your team.',
  },
  {
    number: '03',
    title: 'Track & Collaborate',
    desc: 'Log progress, monitor teammates, review activity, and hit your milestones together.',
  },
];

/* ── Hero Image ──────────────────────────────────── */
function HeroImage() {
  return (
    <div className="hero-img-wrap">
      <img
        src={heroTeamImg}
        alt="Team of developers collaborating around a table with project dashboards"
        className="hero-img"
        loading="eager"
        draggable="false"
      />
    </div>
  );
}

/* ── LandingPage ─────────────────────────────────────────── */
function LandingPage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
 

  useEffect(() => {
    let isMounted = true;

    const loadCurrentUser = async () => {
      try {
        const userData = await getCurrentUser();

        if (!isMounted || !userData) {
          return;
        }

        setCurrentUser(userData);
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

  return (
    <main>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-content">
            <h1 className="hero-headline">
              Turn GitHub activity into
              <span className="hero-headline-accent">
                {' '}
                team momentum.
              </span>
            </h1>

            <p className="hero-subtext">
              DevTrack brings tasks, teammates, progress, and project activity
              into one focused workspace.
            </p>

            <div className="hero-actions">
              {currentUser ? (
                <>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() =>
                      navigate('/rooms', {

                        state: { openModal: 'create' },
                      })
                    }
                  >
                    Create Room
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() =>
                      navigate('/rooms', {
                        state: { openModal: 'join' },
                      })
                    }
                  >
                    Join Room
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/register">
                    <Button variant="primary" size="lg">
                      Create Room
                    </Button>
                  </Link>

                  <Link to="/login">
                    <Button variant="outline" size="lg">
                      Join Room
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="hero-visual">
            <HeroImage />
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section
        id="features"
        className="features-section section"
        aria-labelledby="features-title"
      >
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Features</span>

            <h2 id="features-title" className="section-title">
              Powerful tools built for developers
            </h2>

            <p className="section-subtitle">
              From solo hackers to enterprise teams — DevTrack scales with how
              you work.
            </p>
          </div>

          <div className="features-grid">
            {features.map(({ icon, title, body }) => (
              <Card key={title}>
                <div className="card-icon" aria-hidden="true">
                  {icon}
                </div>

                <h3 className="card-title">{title}</h3>

                <p className="card-body">{body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATISTICS ── */}
      <section
        id="statistics"
        className="stats-section section"
        aria-labelledby="stats-title"
      >
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Statistics</span>

            <h2 id="stats-title" className="section-title">
              Developers trust DevTrack to deliver
            </h2>
          </div>

          <div className="stats-grid">
            {stats.map(({ value, label }) => (
              <div key={label} className="stat-card">
                <div className="stat-number">{value}</div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section
        id="how-it-works"
        className="how-section section"
        aria-labelledby="how-title"
      >
        <div className="container">
          <div className="section-header">
            <span className="section-tag">How It Works</span>

            <h2 id="how-title" className="section-title">
              Up and running in minutes
            </h2>

            <p className="section-subtitle">
              No lengthy setup. No onboarding calls. Just sign up and start
              building together.
            </p>
          </div>

          <div className="how-steps">
            {howSteps.map(({ number, title, desc }) => (
              <div key={number} className="how-step">
                <div className="how-step-number" aria-hidden="true">
                  {number}
                </div>

                <h3 className="how-step-title">{title}</h3>

                <p className="how-step-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section
        className="cta-section section"
        aria-labelledby="cta-title"
      >
        <div className="container">
          <div className="cta-inner">
            <h2 id="cta-title" className="cta-title">
              Ready to build better, together?
            </h2>

            <p className="cta-subtitle">
              Join thousands of developers already using DevTrack to stay
              consistent, collaborate efficiently, and ship with confidence.
            </p>

            <Link to="/register">
              <Button variant="primary" size="lg">
                Get Started — It&apos;s Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <h2>DevTrack</h2>
            <p>Build together. Track progress. Ship faster.</p>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h3>Product</h3>

              <a href="#features">Features</a>
              <a href="#statistics">Statistics</a>
              <a href="#how-it-works">How It Works</a>
            </div>

            <div className="footer-column">
              <h3>Company</h3>

              <a href="#">About</a>
              <a href="#">Contact</a>
            </div>

            <div className="footer-column">
              <h3>Legal</h3>

              <a href="#">Privacy</a>
              <a href="#">Policy</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 DevTrack. All rights reserved.</p>

          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </footer>

    </main>
  );
}

export default LandingPage;