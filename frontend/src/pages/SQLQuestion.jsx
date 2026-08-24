import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function SQLQuestion() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await api.get(`/sql/${id}`);

        const fetchedQuestion =
          response.data.data.question;

        setQuestion(fetchedQuestion);

        setQuery(
          fetchedQuestion.starterQuery || ""
        );
      } catch (err) {
        console.error("SQL question error:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load SQL question"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [id]);

  const handleRunQuery = async () => {
    if (!query.trim()) {
      setError("Please write an SQL query first.");
      return;
    }

    setRunning(true);
    setError("");
    setResult(null);

    try {
      const response = await api.post(
        `/sql/${id}/submit`,
        {
          query: query.trim(),
        }
      );

      const data = response.data;

      if (!data.success) {
        setError(
          data.data?.error ||
            data.message ||
            "SQL query execution failed"
        );

        setResult(null);
        return;
      }

      setResult(data.data);
    } catch (err) {
      console.error(
        "SQL submission error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to execute SQL query"
      );
    } finally {
      setRunning(false);
    }
  };

  if (loading) {
    return (
      <div className="sql-question-page">
        <p>Loading question...</p>
      </div>
    );
  }

  if (error && !question) {
    return (
      <div className="sql-question-page">
        <button
          className="back-button"
          onClick={() => navigate("/sql")}
        >
          ← Back to SQL
        </button>

        <h1>Unable to load question</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="sql-question-page">
        <h1>Question not found</h1>

        <button
          className="back-button"
          onClick={() => navigate("/sql")}
        >
          ← Back to SQL
        </button>
      </div>
    );
  }

  return (
    <div className="sql-question-page">
      <button
        className="back-button"
        onClick={() => navigate("/sql")}
      >
        ← Back to SQL
      </button>

      <div className="question-header">
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

      <div className="sql-content">
        <section className="problem-section">
          <h2>Problem Description</h2>

          <p>{question.description}</p>
        </section>

        {question.schema && (
          <section className="problem-section">
            <h2>Database Schema</h2>

            <pre className="schema-block">
              {typeof question.schema === "string"
                ? question.schema
                : JSON.stringify(
                    question.schema,
                    null,
                    2
                  )}
            </pre>
          </section>
        )}

        {question.exampleQuery && (
          <section className="problem-section">
            <h2>Example Query</h2>

            <pre className="query-example">
              {question.exampleQuery}
            </pre>
          </section>
        )}

        <section className="editor-section">
          <div className="editor-header">
            <h2>SQL Editor</h2>

            <span>SQL</span>
          </div>

          <textarea
            className="code-editor sql-editor"
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            spellCheck="false"
            placeholder="Write your SQL query here..."
          />

          <button
            className="submit-code-button"
            onClick={handleRunQuery}
            disabled={running}
          >
            {running
              ? "Running..."
              : "Run Query"}
          </button>

          {error && (
            <div className="submission-error">
              {error}
            </div>
          )}

          {result && (
            <div className="submission-result">
              <h2>Query Result</h2>

              <div className="sql-result-summary">
                <p>
                  Status:{" "}
                  <strong>
                    {result.status}
                  </strong>
                </p>

                <p>
                  Result:{" "}
                  <strong>
                    {result.correct
                      ? "Correct"
                      : "Incorrect"}
                  </strong>
                </p>

                <p>
                  Score:{" "}
                  <strong>
                    {result.score}%
                  </strong>
                </p>

                <p>
                  Execution Time:{" "}
                  <strong>
                    {result.executionTime ?? 0}s
                  </strong>
                </p>

                <p>{result.message}</p>
              </div>

              {result.columns?.length > 0 && (
                <div className="result-table-wrapper">
                  <table className="result-table">
                    <thead>
                      <tr>
                        {result.columns.map(
                          (column) => (
                            <th key={column}>
                              {column}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      {result.rows?.map(
                        (row, rowIndex) => (
                          <tr key={rowIndex}>
                            {result.columns.map(
                              (column, columnIndex) => (
                                <td
                                  key={`${rowIndex}-${columnIndex}`}
                                >
                                  {Array.isArray(row)
                                    ? String(
                                        row[columnIndex] ??
                                          ""
                                      )
                                    : String(
                                        row[column] ??
                                          ""
                                      )}
                                </td>
                              )
                            )}
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default SQLQuestion;