import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/dashboard");

        setDashboard(response.data.data);
      } catch (err) {
        console.error("Dashboard error:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-page">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <h1>Student Dashboard</h1>

        <div className="dashboard-error">
          {error}
        </div>
      </div>
    );
  }

  const statistics =
    dashboard?.statistics || {};

  const recentSubmissions =
    dashboard?.recentSubmissions || [];

  const dsaSolved =
    statistics.dsaSolved || 0;

  const sqlSolved =
    statistics.sqlSolved || 0;

  const assessmentsCompleted =
    statistics.assessmentsCompleted || 0;

  const averageScore =
    statistics.averageScore || 0;

  const readinessScore =
    statistics.readinessScore || 0;

  return (
    <div className="dashboard-page">

      {/* Welcome */}

      <section className="dashboard-welcome">
        <div>
          <p className="dashboard-label">
            STUDENT DASHBOARD
          </p>

          <h1>
            Welcome back,{" "}
            {user?.name || "Student"} 👋
          </h1>

          <p>
            Continue your placement preparation
            and keep improving your skills.
          </p>
        </div>

        <div className="dashboard-readiness">
          <span>Readiness</span>

          <strong>
            {readinessScore}%
          </strong>
        </div>
      </section>

      {/* Statistics */}

      <section className="dashboard-stats">

        <div className="dashboard-stat-card">
          <span>DSA Problems</span>

          <strong>{dsaSolved}</strong>

          <small>
            Problems solved
          </small>
        </div>

        <div className="dashboard-stat-card">
          <span>SQL Problems</span>

          <strong>{sqlSolved}</strong>

          <small>
            Queries solved
          </small>
        </div>

        <div className="dashboard-stat-card">
          <span>Assessments</span>

          <strong>
            {assessmentsCompleted}
          </strong>

          <small>
            Completed
          </small>
        </div>

        <div className="dashboard-stat-card">
          <span>Average Score</span>

          <strong>
            {averageScore}%
          </strong>

          <small>
            Assessment performance
          </small>
        </div>

      </section>

      {/* Continue Practice */}

      <section className="dashboard-section">

        <div className="dashboard-section-header">
          <div>
            <h2>Continue Practice</h2>

            <p>
              Choose what you want to practice
              today.
            </p>
          </div>
        </div>

        <div className="practice-grid">

          <Link
            to="/dsa"
            className="practice-card"
          >
            <div className="practice-icon">
              D
            </div>

            <div>
              <h3>DSA Practice</h3>

              <p>
                Improve your problem-solving
                and algorithm skills.
              </p>
            </div>

            <span>→</span>
          </Link>

          <Link
            to="/sql"
            className="practice-card"
          >
            <div className="practice-icon">
              S
            </div>

            <div>
              <h3>SQL Practice</h3>

              <p>
                Practice queries and database
                concepts.
              </p>
            </div>

            <span>→</span>
          </Link>

          <Link
            to="/assessments"
            className="practice-card"
          >
            <div className="practice-icon">
              A
            </div>

            <div>
              <h3>Assessments</h3>

              <p>
                Test your skills under
                placement conditions.
              </p>
            </div>

            <span>→</span>
          </Link>

          <Link
            to="/interview"
            className="practice-card"
          >
            <div className="practice-icon">
              I
            </div>

            <div>
              <h3>Mock Interview</h3>

              <p>
                Practice technical and HR
                interview questions.
              </p>
            </div>

            <span>→</span>
          </Link>

        </div>
      </section>

      {/* Readiness */}

      <section className="dashboard-section">

        <div className="readiness-dashboard-card">

          <div className="readiness-dashboard-header">
            <div>
              <h2>
                Placement Readiness
              </h2>

              <p>
                Your overall preparation
                progress.
              </p>
            </div>

            <strong>
              {readinessScore}%
            </strong>
          </div>

          <div className="dashboard-progress-bar">
            <div
              className="dashboard-progress-fill"
              style={{
                width: `${Math.min(
                  Math.max(
                    readinessScore,
                    0
                  ),
                  100
                )}%`,
              }}
            />
          </div>

          <p className="readiness-text">
            {readinessScore >= 80
              ? "Excellent preparation. Keep maintaining your consistency."
              : readinessScore >= 60
                ? "Good progress. Focus on your weaker areas."
                : "Keep practicing DSA, SQL, assessments and interview questions regularly."}
          </p>

        </div>
      </section>

      {/* Recent Activity */}

      <section className="dashboard-section">

        <div className="dashboard-section-header">
          <div>
            <h2>
              Recent Activity
            </h2>

            <p>
              Your latest practice activity.
            </p>
          </div>

          <Link
            to="/progress"
            className="view-progress-link"
          >
            View Progress →
          </Link>
        </div>

        {recentSubmissions.length === 0 ? (
          <div className="dashboard-empty">
            <p>
              No recent submissions yet.
            </p>

            <Link to="/dsa">
              Start practicing →
            </Link>
          </div>
        ) : (
          <div className="dashboard-activity-list">

            {recentSubmissions
              .slice(0, 5)
              .map((submission) => (
                <div
                  className="dashboard-activity"
                  key={submission._id}
                >
                  <div>
                    <h3>
                      {submission.question
                        ?.title ||
                        "Practice Question"}
                    </h3>

                    <p>
                      {submission.questionType ||
                        "Coding"}{" "}
                      ·{" "}
                      {submission.language ||
                        "N/A"}
                    </p>
                  </div>

                  <div>
                    <strong>
                      {submission.score ??
                        0}
                      %
                    </strong>

                    <span
                      className={
                        submission.status ===
                        "accepted"
                          ? "activity-success"
                          : "activity-failed"
                      }
                    >
                      {submission.status}
                    </span>
                  </div>
                </div>
              ))}

          </div>
        )}

      </section>

    </div>
  );
}

export default Dashboard;