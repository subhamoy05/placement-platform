import { useEffect, useState } from "react";
import api from "../services/api";

function Progress() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await api.get("/dashboard");

        setDashboard(response.data.data);
      } catch (err) {
        console.error(
          "Progress error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to load progress"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (loading) {
    return (
      <div className="progress-page">
        <h1>Progress</h1>
        <p>Loading your progress...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="progress-page">
        <h1>Progress</h1>

        <div className="empty-state">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const statistics = dashboard?.statistics || {};
  const recentSubmissions =
    dashboard?.recentSubmissions || [];
  const recentAssessments =
    dashboard?.recentAssessments || [];

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
    <div className="progress-page">
      <div className="progress-header">
        <div>
          <h1>Your Progress</h1>

          <p>
            Track your placement preparation
            progress and performance.
          </p>
        </div>
      </div>

      {/* Statistics */}

      <div className="progress-stats-grid">
        <div className="progress-stat-card">
          <span>DSA Problems</span>

          <strong>{dsaSolved}</strong>

          <small>
            Problems solved
          </small>
        </div>

        <div className="progress-stat-card">
          <span>SQL Problems</span>

          <strong>{sqlSolved}</strong>

          <small>
            Queries solved
          </small>
        </div>

        <div className="progress-stat-card">
          <span>Assessments</span>

          <strong>
            {assessmentsCompleted}
          </strong>

          <small>
            Completed
          </small>
        </div>

        <div className="progress-stat-card">
          <span>Average Score</span>

          <strong>
            {averageScore}%
          </strong>

          <small>
            Assessment performance
          </small>
        </div>
      </div>

      {/* Readiness */}

      <section className="readiness-card">
        <div className="readiness-header">
          <div>
            <h2>Placement Readiness</h2>

            <p>
              Your overall preparation score.
            </p>
          </div>

          <strong>
            {readinessScore}%
          </strong>
        </div>

        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{
              width: `${Math.min(
                Math.max(readinessScore, 0),
                100
              )}%`,
            }}
          />
        </div>

        <p className="readiness-message">
          {readinessScore >= 80
            ? "Excellent preparation. Keep practicing."
            : readinessScore >= 60
              ? "Good progress. Focus on your weaker areas."
              : readinessScore >= 40
                ? "You're making progress. Increase your practice consistency."
                : "Start building your preparation with regular DSA, SQL and assessments."}
        </p>
      </section>

      {/* Recent Submissions */}

      <section className="progress-section">
        <div className="section-header">
          <h2>Recent Submissions</h2>
        </div>

        {recentSubmissions.length === 0 ? (
          <div className="empty-progress">
            <p>
              No submissions yet.
            </p>
          </div>
        ) : (
          <div className="activity-list">
            {recentSubmissions.map(
              (submission) => (
                <div
                  className="activity-card"
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

                  <div className="activity-result">
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

      <section className="progress-section">
        <div className="section-header">
          <h2>Recent Assessments</h2>
        </div>

        {recentAssessments.length === 0 ? (
          <div className="empty-progress">
            <p>
              No assessments completed yet.
            </p>
          </div>
        ) : (
          <div className="activity-list">
            {recentAssessments.map(
              (assessment) => (
                <div
                  className="activity-card"
                  key={assessment._id}
                >
                  <div>
                    <h3>
                      {assessment.assessment
                        ?.title ||
                        "Assessment"}
                    </h3>

                    <p>
                      Assessment attempt
                    </p>
                  </div>

                  <div className="activity-result">
                    <strong>
                      {assessment.percentage ??
                        assessment.score ??
                        0}
                      %
                    </strong>

                    <span className="status-success">
                      Completed
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
}

export default Progress;