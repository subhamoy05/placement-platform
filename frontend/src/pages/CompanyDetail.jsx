import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function CompanyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await api.get(
          `/companies/${id}`
        );

        setCompany(
          response.data.data.company
        );
      } catch (err) {
        console.error(
          "Company detail error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to load company"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  if (loading) {
    return (
      <div className="company-detail-page">
        <p>Loading company...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="company-detail-page">
        <button
          className="back-button"
          onClick={() =>
            navigate("/companies")
          }
        >
          ← Back to Companies
        </button>

        <div className="empty-state">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="company-detail-page">
        <h1>Company not found</h1>

        <button
          className="back-button"
          onClick={() =>
            navigate("/companies")
          }
        >
          ← Back to Companies
        </button>
      </div>
    );
  }

  const topics =
    Array.isArray(company.topics)
      ? company.topics
      : [];

  const skills =
    Array.isArray(company.skills)
      ? company.skills
      : [];

  const rounds =
    Array.isArray(company.rounds)
      ? company.rounds
      : [];

  return (
    <div className="company-detail-page">
      <button
        className="back-button"
        onClick={() =>
          navigate("/companies")
        }
      >
        ← Back to Companies
      </button>

      <header className="company-detail-header">
        <div className="company-detail-logo">
          {(company.name || "C")
            .charAt(0)
            .toUpperCase()}
        </div>

        <div>
          <h1>{company.name}</h1>

          {company.description && (
            <p>{company.description}</p>
          )}
        </div>
      </header>

      <div className="company-detail-grid">
        <section className="company-detail-card">
          <h2>Company Information</h2>

          {company.role && (
            <div className="company-detail-row">
              <span>Role</span>
              <strong>
                {company.role}
              </strong>
            </div>
          )}

          {company.location && (
            <div className="company-detail-row">
              <span>Location</span>
              <strong>
                {company.location}
              </strong>
            </div>
          )}

          {company.package && (
            <div className="company-detail-row">
              <span>Package</span>
              <strong>
                {company.package}
              </strong>
            </div>
          )}
        </section>

        <section className="company-detail-card">
          <h2>Selection Rounds</h2>

          {rounds.length === 0 ? (
            <p className="company-muted">
              Round information not available.
            </p>
          ) : (
            <ol className="round-list">
              {rounds.map(
                (round, index) => (
                  <li key={index}>
                    {typeof round ===
                    "string"
                      ? round
                      : round.name ||
                        `Round ${index + 1}`}
                  </li>
                )
              )}
            </ol>
          )}
        </section>
      </div>

      <section className="company-detail-card">
        <h2>Important Topics</h2>

        {topics.length === 0 ? (
          <p className="company-muted">
            No topics available.
          </p>
        ) : (
          <div className="company-tags">
            {topics.map(
              (topic, index) => (
                <span
                  key={index}
                  className="company-tag"
                >
                  {topic}
                </span>
              )
            )}
          </div>
        )}
      </section>

      <section className="company-detail-card">
        <h2>Recommended Skills</h2>

        {skills.length === 0 ? (
          <p className="company-muted">
            No skill information available.
          </p>
        ) : (
          <div className="company-tags">
            {skills.map(
              (skill, index) => (
                <span
                  key={index}
                  className="company-tag"
                >
                  {skill}
                </span>
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default CompanyDetail;