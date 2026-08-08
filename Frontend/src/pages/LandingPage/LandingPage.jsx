import Navbar from '../../components/layout/Navbar'
import './landing-page.css'

function LandingPage() {
  return (
    <div className="landing-page" data-theme="dark">
      <Navbar />

      <main id="top">
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">Built for student teams and developers</p>

            <h1 className="hero-title" id="hero-title">
              Turn GitHub activity into
              <span> team momentum.</span>
            </h1>

            <p className="hero-description">
              DevTrack brings tasks, teammates, progress, and project activity
              into one focused workspace.
            </p>

            <div className="hero-actions">
              <button className="button button--primary">
                Create Room
              </button>

              <button className="button button--ghost">
                Join Room
              </button>
            </div>

            <p className="hero-note">
              Clear tasks. Visible progress. Better collaboration.
            </p>
          </div>

          <div className="mascot-panel">
            <div className="mascot-copy">
              <p className="mascot-label">Your project home base</p>

              <h2>Welcome to DevTrack.</h2>

              <p>
                Bring your team, tasks, and progress together—then focus on
                what comes next.
              </p>
            </div>

            <div className="mascot-scene" aria-hidden="true">
              <span className="mascot-spark mascot-spark--one"></span>
              <span className="mascot-spark mascot-spark--two"></span>
              <span className="mascot-spark mascot-spark--three"></span>

              <div className="mascot">
                <span className="mascot-antenna"></span>

                <div className="mascot-head">
                  <span className="mascot-eye"></span>
                  <span className="mascot-eye"></span>
                  <span className="mascot-smile"></span>
                </div>

                <div className="mascot-body">
                  <span className="mascot-badge">DT</span>
                </div>
              </div>
            </div>
          </div>
        </section>
     
              {/* Why DevTrack Section */}
      <section className="why-section" id="why-devtrack">
        <div className="why-container">
          <div className="why-content">
            <p className="section-tag">Why DevTrack</p>

            <h2 className="section-title">
              Everything your team needs,
              <span> without the chaos.</span>
            </h2>

            <p className="section-description">
              Stop juggling GitHub tabs, spreadsheets, and chat messages. DevTrack
              keeps repositories, tasks, contributors, and project progress in one
              streamlined workspace.
            </p>

            <div className="why-points">
              <div className="why-point">
                <span className="point-icon">✓</span>
                <div>
                  <h3>Centralized project tracking</h3>
                  <p>
                    View repositories, issues, pull requests, and team activity from
                    a single dashboard.
                  </p>
                </div>
              </div>

              <div className="why-point">
                <span className="point-icon">✓</span>
                <div>
                  <h3>Built for collaboration</h3>
                  <p>
                    Assign tasks, monitor progress, and keep every contributor aligned
                    with the project goals.
                  </p>
                </div>
              </div>

              <div className="why-point">
                <span className="point-icon">✓</span>
                <div>
                  <h3>Actionable insights</h3>
                  <p>
                    Understand contribution trends, sprint progress, and repository
                    health at a glance.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="why-preview" aria-hidden="true">
            <div className="preview-window">
              <div className="preview-header">
                <div className="preview-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <p>Sprint Overview</p>
              </div>

              <div className="preview-body">
                <div className="preview-card">
                  <div className="card-top">
                    <span className="card-badge">Repository</span>
                    <span className="card-status active">Active</span>
                  </div>

                  <h4>GitTracker</h4>
                  <p>Frontend Dashboard</p>

                  <div className="progress-block">
                    <div className="progress-info">
                      <span>Sprint Progress</span>
                      <strong>78%</strong>
                    </div>
                    <div className="progress-bar">
                      <span style={{ width: "78%" }}></span>
                    </div>
                  </div>
                </div>

                <div className="stats-grid">
                  <div className="stat-item">
                    <strong>24</strong>
                    <span>Tasks</span>
                  </div>
                  <div className="stat-item">
                    <strong>18</strong>
                    <span>Merged PRs</span>
                  </div>
                  <div className="stat-item">
                    <strong>7</strong>
                    <span>Contributors</span>
                  </div>
                  <div className="stat-item">
                    <strong>95%</strong>
                    <span>On Track</span>
                  </div>
                </div>

                <div className="activity-list">
                  <div className="activity-item">
                    <div className="activity-avatar">SM</div>
                    <div>
                      <strong>Landing page updated</strong>
                      <p>2 minutes ago</p>
                    </div>
                  </div>

                  <div className="activity-item">
                    <div className="activity-avatar">AK</div>
                    <div>
                      <strong>Dashboard components merged</strong>
                      <p>15 minutes ago</p>
                    </div>
                  </div>

                  <div className="activity-item">
                    <div className="activity-avatar">RP</div>
                    <div>
                      <strong>New issue assigned</strong>
                      <p>32 minutes ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      </main>
    </div>
  )
}

export default LandingPage