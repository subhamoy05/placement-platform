import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">

      {/* Navbar */}

      <nav className="home-navbar">
        <div className="home-logo">
          PlacementPrep
        </div>

        <div className="home-nav-links">
          <a href="#features">
            Features
          </a>

          <a href="#companies">
            Companies
          </a>

          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="nav-dashboard-button"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              className="nav-login-button"
            >
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* Hero */}

      <section className="home-hero">
        <div className="hero-content">

          <span className="hero-badge">
            🚀 Placement Preparation Platform
          </span>

          <h1>
            Prepare Smarter.
            <br />
            <span>
              Get Placement Ready.
            </span>
          </h1>

          <p>
            Practice DSA, SQL, coding assessments,
            mock interviews and company-specific
            preparation — all in one platform.
          </p>

          <div className="hero-actions">
            <Link
              to={
                isAuthenticated
                  ? "/dashboard"
                  : "/login"
              }
              className="hero-primary-button"
            >
              {isAuthenticated
                ? "Go to Dashboard"
                : "Start Preparing"}
            </Link>

            <a
              href="#features"
              className="hero-secondary-button"
            >
              Explore Features
            </a>
          </div>

        </div>

        <div className="hero-card">

          <div className="hero-card-header">
            <span>Placement Readiness</span>
            <strong>72%</strong>
          </div>

          <div className="hero-progress">
            <div
              className="hero-progress-fill"
              style={{
                width: "72%",
              }}
            />
          </div>

          <div className="hero-mini-stats">

            <div>
              <strong>120+</strong>
              <span>DSA Problems</span>
            </div>

            <div>
              <strong>80+</strong>
              <span>SQL Questions</span>
            </div>

            <div>
              <strong>30+</strong>
              <span>Companies</span>
            </div>

          </div>

        </div>
      </section>

      {/* Features */}

      <section
        id="features"
        className="home-section"
      >
        <div className="home-section-heading">
          <span>EVERYTHING YOU NEED</span>

          <h2>
            One Platform for Placement Preparation
          </h2>

          <p>
            Build the skills you need to perform
            confidently in technical and HR
            interviews.
          </p>
        </div>

        <div className="feature-grid">

          <div className="feature-card">
            <div className="feature-icon">
              DSA
            </div>

            <h3>DSA Practice</h3>

            <p>
              Solve data structures and algorithms
              problems with coding practice.
            </p>

            <Link to="/dsa">
              Practice DSA →
            </Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              SQL
            </div>

            <h3>SQL Practice</h3>

            <p>
              Write and execute SQL queries using
              real database-style problems.
            </p>

            <Link to="/sql">
              Practice SQL →
            </Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              TEST
            </div>

            <h3>Coding Assessments</h3>

            <p>
              Test your skills with timed
              placement-focused assessments.
            </p>

            <Link to="/assessments">
              Take Assessment →
            </Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              INT
            </div>

            <h3>Mock Interviews</h3>

            <p>
              Practice technical, HR and
              behavioral interview questions.
            </p>

            <Link to="/interview">
              Practice Interview →
            </Link>
          </div>

        </div>
      </section>

      {/* Companies */}

      <section
        id="companies"
        className="companies-home-section"
      >
        <div className="companies-home-content">

          <div>
            <span className="home-small-label">
              COMPANY PREPARATION
            </span>

            <h2>
              Prepare for the Companies
              You Want to Join
            </h2>

            <p>
              Explore company-specific interview
              rounds, important topics and
              recommended preparation areas.
            </p>

            <Link
              to={
                isAuthenticated
                  ? "/companies"
                  : "/login"
              }
              className="companies-home-button"
            >
              Explore Companies →
            </Link>
          </div>

          <div className="company-preview">

            <div className="company-preview-card">
              <span>T</span>

              <div>
                <strong>TCS</strong>
                <p>
                  Coding · Technical · HR
                </p>
              </div>
            </div>

            <div className="company-preview-card">
              <span>I</span>

              <div>
                <strong>Infosys</strong>
                <p>
                  Aptitude · Technical · HR
                </p>
              </div>
            </div>

            <div className="company-preview-card">
              <span>A</span>

              <div>
                <strong>Accenture</strong>
                <p>
                  Coding · Communication · HR
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* CTA */}

      <section className="home-cta">

        <h2>
          Ready to Start Your Placement Journey?
        </h2>

        <p>
          Practice consistently and build the
          confidence you need to crack your
          interviews.
        </p>

        <Link
          to={
            isAuthenticated
              ? "/dashboard"
              : "/login"
          }
          className="cta-button"
        >
          {isAuthenticated
            ? "Open Dashboard"
            : "Start Preparing"}
        </Link>

      </section>

      {/* Footer */}

      <footer className="home-footer">
        <div>
          <strong>
            PlacementPrep
          </strong>

          <span>
            Placement & Interview Preparation
            Platform
          </span>
        </div>

        <p>
          © 2026 PlacementPrep. Built for
          students.
        </p>
      </footer>

    </div>
  );
}

export default Home;