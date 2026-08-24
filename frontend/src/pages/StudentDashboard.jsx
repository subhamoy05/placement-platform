import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const StudentDashboard = () => {
  const navigate = useNavigate();

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
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-error">
          <h2>Unable to load dashboard</h2>
          <p>{error}</p>

          <button
            className="primary-button"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="dashboard-page">
        <div className="empty-state">
          <p>No dashboard data available.</p>
        </div>
      </div>
    );
  }

  const {
    user = {},
    recentSubmissions = [],
    recentAssessments = [],
    statistics = {},
  } = dashboard;

  const dsaSolved = statistics.dsaSolved || 0;
  const sqlSolved = statistics.sqlSolved || 0;
  const assessmentsCompleted =
    statistics.assessmentsCompleted || 0;
  const averageScore =
    statistics.averageScore || 0;
  const readinessScore =
    statistics.readinessScore || 0;

  return (
    <div className="dashboard-page">

      {/* Header */}
      <div className="dashboard-header">
        <div>
          <span className="dashboard-eyebrow">
            PLACEMENT PREPARATION
          </span>

          <h1>
            Welcome, {user.name || "Student"} 👋
          </h1>

          <p>
            Track your preparation and stay
            ready for your next opportunity.
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="stats-grid">

        <div className="stat-card">
          <span className="stat-label">
            DSA Problems
          </span>

          <strong>{dsaSolved}</strong>

          <small>Problems solved</small>
        </div>

        <div className="stat-card">
          <span className="stat-label">
            SQL Problems
          </span>

          <strong>{sqlSolved}</strong>

          <small>Queries solved</small>
        </div>

        <div className="stat-card">
          <span className="stat-label">
            Assessments
          </span>

          <strong>
            {assessmentsCompleted}
          </strong>

          <small>Completed</small>
        </div>

        <div className="stat-card">
          <span className="stat-label">
            Average Score
          </span>

          <strong>{averageScore}%</strong>

          <small>Assessment performance</small>
        </div>

      </div>

      {/* Readiness */}
      <section className="dashboard-readiness">

        <div className="readiness-top">

          <div>
            <span className="dashboard-eyebrow">
              PREPARATION STATUS
            </span>

            <h2>Placement Readiness</h2>

            <p>
              Your overall preparation score.
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
                Math.max(readinessScore, 0),
                100
              )}%`,
            }}
          />
        </div>

        <p className="readiness-text">
          {readinessScore >= 80
            ? "Excellent preparation. Keep practicing."
            : readinessScore >= 60
              ? "Good progress. Focus on your weaker areas."
              : readinessScore >= 40
                ? "You're making progress. Stay consistent."
                : "Start practicing DSA, SQL and assessments regularly."}
        </p>

      </section>

      {/* Quick Practice */}
      <section className="dashboard-section">

        <div className="section-header">
          <div>
            <h2>Quick Practice</h2>

            <p>
              Continue improving your placement skills.
            </p>
          </div>
        </div>

        <div className="quick-practice-grid">

          <button
            className="quick-practice-card"
            onClick={() => navigate("/dsa")}
          >
            <strong>DSA</strong>
            <span>
              Practice coding problems →
            </span>
          </button>

          <button
            className="quick-practice-card"
            onClick={() => navigate("/sql")}
          >
            <strong>SQL</strong>
            <span>
              Practice database queries →
            </span>
          </button>

          <button
            className="quick-practice-card"
            onClick={() =>
              navigate("/assessments")
            }
          >
            <strong>Assessments</strong>
            <span>
              Test your skills →
            </span>
          </button>

          <button
            className="quick-practice-card"
            onClick={() =>
              navigate("/interview")
            }
          >
            <strong>Interview</strong>
            <span>
              Practice interviews →
            </span>
          </button>

        </div>

      </section>

      {/* Recent Submissions */}
      <section className="dashboard-section">

        <div className="section-header">
          <div>
            <h2>Recent Submissions</h2>

            <p>
              Your latest practice activity.
            </p>
          </div>

          <button
            className="section-link"
            onClick={() => navigate("/progress")}
          >
            View Progress →
          </button>
        </div>

        {recentSubmissions.length === 0 ? (
          <div className="dashboard-empty">
            <p>No submissions yet.</p>

            <button
              className="primary-button"
              onClick={() => navigate("/dsa")}
            >
              Start Practicing
            </button>
          </div>
        ) : (
          <div className="submission-list">

            {recentSubmissions.map(
              (submission) => (
                <div
                  className="submission-card"
                  key={submission._id}
                >
                  <div>
                    <h3>
                      {submission.question?.title ||
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

                  <div className="submission-result">

                    <strong>
                      {submission.score ?? 0}%
                    </strong>

                    <span
                      className={
                        submission.status ===
                        "accepted"
                          ? "status-success"
                          : "status-failed"
                      }
                    >
                      {submission.status}
                    </span>

                  </div>
                </div>
              )
            )}

          </div>
        )}

      </section>

      {/* Recent Assessments */}
      <section className="dashboard-section">

        <div className="section-header">
          <div>
            <h2>Recent Assessments</h2>

            <p>
              Your latest assessment performance.
            </p>
          </div>

          <button
            className="section-link"
            onClick={() =>
              navigate("/assessments")
            }
          >
            All Assessments →
          </button>
        </div>

        {recentAssessments.length === 0 ? (
          <div className="dashboard-empty">
            <p>
              No assessments completed yet.
            </p>

            <button
              className="primary-button"
              onClick={() =>
                navigate("/assessments")
              }
            >
              Take Assessment
            </button>
          </div>
        ) : (
          <div className="assessment-list">

            {recentAssessments.map(
              (result) => (
                <div
                  className="assessment-card"
                  key={result._id}
                >
                  <div>
                    <h3>
                      {result.assessment?.title ||
                        "Assessment"}
                    </h3>

                    <p>
                      {result.assessment?.difficulty ||
                        "Placement Assessment"}
                    </p>
                  </div>

                  <div className="assessment-result">
                    <strong>
                      {result.percentage ??
                        result.score ??
                        0}
                      %
                    </strong>

                    <span>
                      {result.score ?? 0}/
                      {result.totalMarks ?? 0}
                    </span>
                  </div>
                </div>
              )
            )}

          </div>
        )}

      </section>

    </div>
  );
};

export default StudentDashboard;