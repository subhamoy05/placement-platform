import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function SQL() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [topic, setTopic] = useState("All");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await api.get("/sql");

        setQuestions(
          response.data.data.questions || []
        );
      } catch (err) {
        console.error(
          "SQL questions error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to load SQL questions"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const topics = useMemo(() => {
    const uniqueTopics = [
      ...new Set(
        questions
          .map((question) => question.topic)
          .filter(Boolean)
      ),
    ];

    return uniqueTopics.sort();
  }, [questions]);

  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      const title = String(
        question.title || ""
      ).toLowerCase();

      const description = String(
        question.description || ""
      ).toLowerCase();

      const searchText =
        search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        title.includes(searchText) ||
        description.includes(searchText);

      const matchesDifficulty =
        difficulty === "All" ||
        String(question.difficulty)
          .toLowerCase() ===
          difficulty.toLowerCase();

      const matchesTopic =
        topic === "All" ||
        question.topic === topic;

      return (
        matchesSearch &&
        matchesDifficulty &&
        matchesTopic
      );
    });
  }, [
    questions,
    search,
    difficulty,
    topic,
  ]);

  if (loading) {
    return (
      <div className="sql-page">
        <div className="sql-header">
          <div>
            <h1>SQL Practice</h1>
            <p>
              Practice SQL questions and improve
              your database skills.
            </p>
          </div>
        </div>

        <div className="empty-state">
          <p>Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sql-page">
        <div className="sql-header">
          <div>
            <h1>SQL Practice</h1>
            <p>
              Practice SQL questions and improve
              your database skills.
            </p>
          </div>
        </div>

        <div className="empty-state">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sql-page">
      {/* Header */}

      <div className="sql-header">
        <div>
          <h1>SQL Practice</h1>

          <p>
            Practice SQL questions and improve
            your database skills.
          </p>
        </div>

        <div className="sql-count">
          {filteredQuestions.length} /{" "}
          {questions.length} Questions
        </div>
      </div>

      {/* Filters */}

      <div className="sql-filters">
        <div className="sql-search">
          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search SQL questions..."
          />
        </div>

        <select
          value={difficulty}
          onChange={(event) =>
            setDifficulty(event.target.value)
          }
        >
          <option value="All">
            All Difficulties
          </option>

          <option value="Easy">
            Easy
          </option>

          <option value="Medium">
            Medium
          </option>

          <option value="Hard">
            Hard
          </option>
        </select>

        <select
          value={topic}
          onChange={(event) =>
            setTopic(event.target.value)
          }
        >
          <option value="All">
            All Topics
          </option>

          {topics.map((item) => (
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          ))}
        </select>

        {(search ||
          difficulty !== "All" ||
          topic !== "All") && (
          <button
            className="clear-filter-button"
            onClick={() => {
              setSearch("");
              setDifficulty("All");
              setTopic("All");
            }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Questions */}

      {filteredQuestions.length === 0 ? (
        <div className="empty-state">
          <h3>No questions found</h3>

          <p>
            Try changing your search or filters.
          </p>
        </div>
      ) : (
        <div className="sql-grid">
          {filteredQuestions.map(
            (question, index) => (
              <div
                className="sql-card"
                key={question._id}
              >
                <div className="sql-card-top">
                  <span className="question-number">
                    #{index + 1}
                  </span>

                  <span
                    className={`difficulty ${String(
                      question.difficulty || ""
                    ).toLowerCase()}`}
                  >
                    {question.difficulty ||
                      "Unknown"}
                  </span>
                </div>

                <h2>{question.title}</h2>

                <p className="question-description">
                  {question.description}
                </p>

                <div className="question-meta">
                  <span>
                    Topic:{" "}
                    {question.topic ||
                      "General"}
                  </span>
                </div>

                <button
                  className="solve-button"
                  onClick={() =>
                    navigate(
                      `/sql/${question._id}`
                    )
                  }
                >
                  Solve
                </button>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default SQL;