import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function DSAQuestion() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await api.get(`/dsa/${id}`);

        const fetchedQuestion =
          response.data.data.question;

        setQuestion(fetchedQuestion);

        setCode(
          fetchedQuestion.starterCode ||
            "# Write your Python solution here"
        );
      } catch (err) {
        console.error("Question error:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load question"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [id]);

  const handleSubmit = async () => {
    if (!code.trim()) {
      setError("Please write your Python code first.");
      return;
    }

    setSubmitting(true);
    setError("");
    setResult(null);

    try {
      const response = await api.post(
        `/dsa/${id}/submit`,
        {
          code,
        }
      );

      setResult(response.data.data);
    } catch (err) {
      console.error(
        "Code submission error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to submit code"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="dsa-question-page">
        <p>Loading question...</p>
      </div>
    );
  }

  if (error && !question) {
    return (
      <div className="dsa-question-page">
        <button
          className="back-button"
          onClick={() => navigate("/dsa")}
        >
          ← Back to DSA
        </button>

        <h1>Unable to load question</h1>

        <p>{error}</p>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="dsa-question-page">
        <h1>Question not found</h1>

        <button
          className="back-button"
          onClick={() => navigate("/dsa")}
        >
          ← Back to DSA
        </button>
      </div>
    );
  }

  return (
    <div className="dsa-question-page">
      <button
        className="back-button"
        onClick={() => navigate("/dsa")}
      >
        ← Back to DSA
      </button>

      <div className="question-header">
        <div>
          <span
            className={`difficulty ${String(
              question.difficulty || ""
            ).toLowerCase()}`}
          >
            {question.difficulty}
          </span>

          <h1>{question.title}</h1>

          <p>
            Topic: {question.topic}
          </p>
        </div>
      </div>

      <div className="question-content">
        <section className="problem-section">
          <h2>Problem Description</h2>

          <p>{question.description}</p>
        </section>

        {question.examples?.length > 0 && (
          <section className="problem-section">
            <h2>Examples</h2>

            {question.examples.map(
              (example, index) => (
                <div
                  className="example-card"
                  key={index}
                >
                  <h3>
                    Example {index + 1}
                  </h3>

                  <p>
                    <strong>Input:</strong>{" "}
                    {example.input}
                  </p>

                  <p>
                    <strong>Output:</strong>{" "}
                    {example.output}
                  </p>

                  {example.explanation && (
                    <p>
                      <strong>
                        Explanation:
                      </strong>{" "}
                      {example.explanation}
                    </p>
                  )}
                </div>
              )
            )}
          </section>
        )}

        {question.constraints?.length > 0 && (
          <section className="problem-section">
            <h2>Constraints</h2>

            <ul>
              {question.constraints.map(
                (constraint, index) => (
                  <li key={index}>
                    {constraint}
                  </li>
                )
              )}
            </ul>
          </section>
        )}

        <section className="editor-section">
          <div className="editor-header">
            <h2>Python Solution</h2>

            <span>Python 3</span>
          </div>

          <textarea
            className="code-editor"
            value={code}
            onChange={(event) =>
              setCode(event.target.value)
            }
            spellCheck="false"
          />

          <button
            className="submit-code-button"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting
              ? "Running..."
              : "Submit Code"}
          </button>

          {error && (
            <div className="submission-error">
              {error}
            </div>
          )}

          {result && (
            <div className="submission-result">
              <h2>Submission Result</h2>

              <p>
                Status:{" "}
                <strong>
                  {result.status}
                </strong>
              </p>

              <p>
                Score:{" "}
                <strong>
                  {result.score}%
                </strong>
              </p>

              <p>
                Tests Passed:{" "}
                <strong>
                  {result.passedTests}/
                  {result.totalTests}
                </strong>
              </p>

              {result.results?.length > 0 && (
                <div>
                  <h3>Test Cases</h3>

                  {result.results.map(
                    (test, index) => (
                      <div
                        className="test-result"
                        key={index}
                      >
                        <p>
                          Test Case {index + 1}:{" "}
                          <strong>
                            {test.status}
                          </strong>
                        </p>

                        <p>
                          Expected:{" "}
                          {test.expectedOutput}
                        </p>

                        <p>
                          Output:{" "}
                          {test.actualOutput}
                        </p>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default DSAQuestion;