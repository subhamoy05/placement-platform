import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Assessments() {
  const navigate = useNavigate();

  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [company, setCompany] = useState("All");

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await api.get(
          "/assessments"
        );

        setAssessments(
          response.data.data.assessments || []
        );
      } catch (err) {
        console.error(
          "Assessments error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to load assessments"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  const companies = useMemo(() => {
    const names = assessments
      .map((assessment) => {
        if (!assessment.company) {
          return null;
        }

        if (
          typeof assessment.company ===
          "string"
        ) {
          return assessment.company;
        }

        return assessment.company.name;
      })
      .filter(Boolean);

    return [...new Set(names)].sort();
  }, [assessments]);

  const filteredAssessments = useMemo(() => {
    return assessments.filter((assessment) => {
      const title = String(
        assessment.title || ""
      ).toLowerCase();

      const description = String(
        assessment.description || ""
      ).toLowerCase();

      const searchText =
        search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        title.includes(searchText) ||
        description.includes(searchText);

      const matchesDifficulty =
        difficulty === "All" ||
        String(assessment.difficulty || "")
          .toLowerCase() ===
          difficulty.toLowerCase();

      let companyName = "";

      if (assessment.company) {
        companyName =
          typeof assessment.company ===
          "string"
            ? assessment.company
            : assessment.company.name || "";
      }

      const matchesCompany =
        company === "All" ||
        companyName === company;

      return (
        matchesSearch &&
        matchesDifficulty &&
        matchesCompany
      );
    });
  }, [
    assessments,
    search,
    difficulty,
    company,
  ]);

  if (loading) {
    return (
      <div className="assessments-page">
        <div className="assessments-header">
          <div>
            <h1>Assessments</h1>
            <p>
              Test your coding skills with
              placement-focused assessments.
            </p>
          </div>
        </div>

        <div className="empty-state">
          <p>Loading assessments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="assessments-page">
        <div className="assessments-header">
          <div>
            <h1>Assessments</h1>
          </div>
        </div>

        <div className="empty-state">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="assessments-page">

      {/* Header */}

      <div className="assessments-header">
        <div>
          <span className="assessment-label">
            PLACEMENT TESTING
          </span>

          <h1>Assessments</h1>

          <p>
            Test your coding skills with
            placement-focused assessments.
          </p>
        </div>

        <div className="assessment-count">
          {filteredAssessments.length} /{" "}
          {assessments.length}
        </div>
      </div>

      {/* Filters */}

      <div className="assessment-filters">

        <div className="assessment-search">
          <input
            type="text"
            placeholder="Search assessments..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
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
          value={company}
          onChange={(event) =>
            setCompany(event.target.value)
          }
        >
          <option value="All">
            All Companies
          </option>

          {companies.map((name) => (
            <option
              key={name}
              value={name}
            >
              {name}
            </option>
          ))}
        </select>

        {(search ||
          difficulty !== "All" ||
          company !== "All") && (
          <button
            className="clear-filter-button"
            onClick={() => {
              setSearch("");
              setDifficulty("All");
              setCompany("All");
            }}
          >
            Clear
          </button>
        )}

      </div>

      {/* Assessment Cards */}

      {filteredAssessments.length === 0 ? (
        <div className="empty-state">
          <h3>
            No assessments found
          </h3>

          <p>
            Try changing your search or
            filters.
          </p>
        </div>
      ) : (
        <div className="assessments-grid">

          {filteredAssessments.map(
            (assessment, index) => {

              let companyName = "";

              if (assessment.company) {
                companyName =
                  typeof assessment.company ===
                  "string"
                    ? assessment.company
                    : assessment.company.name ||
                      "";
              }

              return (
                <div
                  className="assessment-card"
                  key={assessment._id}
                >

                  <div className="assessment-card-top">

                    <span className="question-number">
                      #{index + 1}
                    </span>

                    <span
                      className={`difficulty ${String(
                        assessment.difficulty ||
                          ""
                      ).toLowerCase()}`}
                    >
                      {assessment.difficulty ||
                        "Unknown"}
                    </span>

                  </div>

                  <h2>
                    {assessment.title}
                  </h2>

                  <p className="question-description">
                    {assessment.description}
                  </p>

                  <div className="assessment-meta">

                    <span>
                      ⏱{" "}
                      {assessment.duration ??
                        0}{" "}
                      min
                    </span>

                    <span>
                      ⭐{" "}
                      {assessment.totalMarks ??
                        0} marks
                    </span>

                  </div>

                  {companyName && (
                    <div className="assessment-company">
                      Company:{" "}
                      <strong>
                        {companyName}
                      </strong>
                    </div>
                  )}

                  <button
                    className="solve-button"
                    onClick={() =>
                      navigate(
                        `/assessments/${assessment._id}`
                      )
                    }
                  >
                    Start Assessment →
                  </button>

                </div>
              );
            }
          )}

        </div>
      )}

    </div>
  );
}

export default Assessments;