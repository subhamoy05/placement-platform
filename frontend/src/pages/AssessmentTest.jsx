import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function AssessmentTest() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const response = await api.get(
          `/assessments/${id}`
        );

        const data = response.data.data.assessment;

        setAssessment(data);

        setTimeLeft(
          (data.duration || 30) * 60
        );
      } catch (err) {
        console.error(
          "Assessment error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to load assessment"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [id]);

  useEffect(() => {
    if (!assessment || timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previous) =>
        previous > 0 ? previous - 1 : 0
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [assessment, timeLeft]);

  useEffect(() => {
    if (
      assessment &&
      timeLeft === 0 &&
      !submitting
    ) {
      handleSubmit(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(remainingSeconds).padStart(
      2,
      "0"
    )}`;
  };

  const questions = assessment?.questions || [];

  const question = questions[currentQuestion];

  const handleAnswerChange = (value) => {
    if (!question) return;

    setAnswers((previous) => ({
      ...previous,
      [question._id]: value,
    }));
  };

  const handleSubmit = async (
    autoSubmit = false
  ) => {
    if (submitting) return;

    setSubmitting(true);
    setError("");

    try {
      const formattedAnswers = questions.map(
        (questionItem) => ({
          questionId: questionItem._id,
          code:
            answers[questionItem._id] || "",
        })
      );

      const timeTaken = Math.floor(
        ((assessment.duration || 30) * 60 -
          timeLeft)
      );

      await api.post(
        `/assessment-results/${id}/submit`,
        {
          timeTaken,
          answers: formattedAnswers,
        }
      );

      navigate(
        `/assessments/${id}/result`
      );
    } catch (err) {
      console.error(
        "Assessment submission error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to submit assessment"
      );

      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="assessment-test-page">
        <p>Loading assessment...</p>
      </div>
    );
  }

  if (error && !assessment) {
    return (
      <div className="assessment-test-page">
        <button
          className="back-button"
          onClick={() =>
            navigate("/assessments")
          }
        >
          ← Back to Assessments
        </button>

        <h1>Unable to load assessment</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="assessment-test-page">
        <h1>Assessment not found</h1>
      </div>
    );
  }

  return (
    <div className="assessment-test-page">
      <header className="assessment-test-header">
        <div>
          <h1>{assessment.title}</h1>

          <p>
            {questions.length} Questions ·{" "}
            {assessment.totalMarks} Marks
          </p>
        </div>

        <div
          className={`assessment-timer ${
            timeLeft <= 60
              ? "timer-danger"
              : ""
          }`}
        >
          ⏱ {formatTime(timeLeft)}
        </div>
      </header>

      {error && (
        <div className="submission-error">
          {error}
        </div>
      )}

      <div className="assessment-test-layout">
        <aside className="question-navigation">
          <h3>Questions</h3>

          <div className="question-number-grid">
            {questions.map(
              (questionItem, index) => (
                <button
                  key={questionItem._id}
                  className={
                    currentQuestion === index
                      ? "active-question"
                      : answers[
                            questionItem._id
                          ]
                        ? "answered-question"
                        : ""
                  }
                  onClick={() =>
                    setCurrentQuestion(index)
                  }
                >
                  {index + 1}
                </button>
              )
            )}
          </div>
        </aside>

        <main className="assessment-question-area">
          {question && (
            <>
              <div className="assessment-question-card">
                <div className="assessment-question-top">
                  <span>
                    Question{" "}
                    {currentQuestion + 1} of{" "}
                    {questions.length}
                  </span>

                  {question.marks && (
                    <span>
                      {question.marks} Marks
                    </span>
                  )}
                </div>

                <h2>
                  {question.title}
                </h2>

                {question.description && (
                  <p>
                    {question.description}
                  </p>
                )}

                {question.examples?.length >
                  0 && (
                  <div className="assessment-examples">
                    <h3>Examples</h3>

                    {question.examples.map(
                      (example, index) => (
                        <div
                          key={index}
                          className="example-card"
                        >
                          <p>
                            <strong>
                              Input:
                            </strong>{" "}
                            {example.input}
                          </p>

                          <p>
                            <strong>
                              Output:
                            </strong>{" "}
                            {example.output}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                )}

                <textarea
                  className="assessment-code-editor"
                  value={
                    answers[
                      question._id
                    ] || ""
                  }
                  onChange={(event) =>
                    handleAnswerChange(
                      event.target.value
                    )
                  }
                  placeholder="Write your Python solution here..."
                  spellCheck="false"
                />
              </div>

              <div className="assessment-navigation-buttons">
                <button
                  className="secondary-button"
                  disabled={
                    currentQuestion === 0
                  }
                  onClick={() =>
                    setCurrentQuestion(
                      (previous) =>
                        previous - 1
                    )
                  }
                >
                  ← Previous
                </button>

                {currentQuestion <
                questions.length - 1 ? (
                  <button
                    className="primary-button"
                    onClick={() =>
                      setCurrentQuestion(
                        (previous) =>
                          previous + 1
                      )
                    }
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    className="submit-assessment-button"
                    onClick={() =>
                      handleSubmit(false)
                    }
                    disabled={submitting}
                  >
                    {submitting
                      ? "Submitting..."
                      : "Submit Assessment"}
                  </button>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default AssessmentTest;