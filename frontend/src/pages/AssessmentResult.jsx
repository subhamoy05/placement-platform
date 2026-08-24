import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function AssessmentResult() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await api.get(
          `/assessment-results/${id}/latest`
        );

        setResult(response.data.data);
      } catch (err) {
        console.error(
          "Assessment result error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to load assessment result"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  if (loading) {
    return (
      <div className="assessment-result-page">
        <p>Loading result...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="assessment-result-page">
        <h1>Assessment Result</h1>

        <div className="empty-state">
          <p>{error}</p>

          <button
            className="primary-button"
            onClick={() =>
              navigate("/assessments")
            }
          >
            Back to Assessments
          </button>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="assessment-result-page">
        <h1>No Result Found</h1>

        <button
          className="primary-button"
          onClick={() =>
            navigate("/assessments")
          }
        >
          Back to Assessments
        </button>
      </div>
    );
  }

  const percentage =
    result.percentage ??
    result.scorePercentage ??
    0;

  const passed =
    result.passed ??
    percentage >= 50;

  return (
    <div className="assessment-result-page">
      <div className="result-header">
        <h1>Assessment Completed 🎉</h1>

        <p>
          Here is your latest assessment result.
        </p>
      </div>

      <div className="result-score-card">
        <div className="score-circle">
          <strong>{percentage}%</strong>
          <span>Score</span>
        </div>

        <div className="result-status">
          <h2>
            {passed
              ? "Assessment Passed"
              : "Keep Practicing"}
          </h2>

          <p>
            {result.message ||
              (passed
                ? "Great work! Keep preparing for your placement."
                : "Review your weak areas and try again.")}
          </p>
        </div>
      </div>

      <div className="result-stats-grid">
        <div className="result-stat">
          <span>Score</span>
          <strong>
            {result.score ?? 0}
          </strong>
        </div>

        <div className="result-stat">
          <span>Total Marks</span>
          <strong>
            {result.totalMarks ?? 0}
          </strong>
        </div>

        <div className="result-stat">
          <span>Percentage</span>
          <strong>
            {percentage}%
          </strong>
        </div>

        <div className="result-stat">
          <span>Time Taken</span>
          <strong>
            {result.timeTaken ?? 0}s
          </strong>
        </div>
      </div>

      {result.answers?.length > 0 && (
        <div className="answer-review">
          <h2>Answer Review</h2>

          {result.answers.map(
            (answer, index) => (
              <div
                className="answer-review-card"
                key={
                  answer.questionId ||
                  index
                }
              >
                <div>
                  <strong>
                    Question {index + 1}
                  </strong>

                  <p>
                    {answer.questionTitle ||
                      "Assessment Question"}
                  </p>
                </div>

                <span
                  className={
                    answer.correct
                      ? "answer-correct"
                      : "answer-wrong"
                  }
                >
                  {answer.correct
                    ? "Correct"
                    : "Incorrect"}
                </span>
              </div>
            )
          )}
        </div>
      )}

      <div className="result-actions">
        <button
          className="secondary-button"
          onClick={() =>
            navigate("/assessments")
          }
        >
          ← All Assessments
        </button>

        <button
          className="primary-button"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}

export default AssessmentResult;