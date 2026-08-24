import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Companies() {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await api.get("/companies");

        setCompanies(
          response.data.data.companies || []
        );
      } catch (err) {
        console.error(
          "Companies error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to load companies"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  if (loading) {
    return (
      <div className="companies-page">
        <h1>Companies</h1>
        <p>Loading companies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="companies-page">
        <h1>Companies</h1>

        <div className="empty-state">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="companies-page">
      <div className="companies-header">
        <div>
          <h1>Companies</h1>

          <p>
            Prepare for company-specific
            placement opportunities.
          </p>
        </div>

        <div className="company-count">
          {companies.length} Companies
        </div>
      </div>

      {companies.length === 0 ? (
        <div className="empty-state">
          <p>No companies available.</p>
        </div>
      ) : (
        <div className="companies-grid">
          {companies.map((company) => (
            <div
              className="company-card"
              key={company._id}
            >
              <div className="company-logo">
                {(
                  company.name || "C"
                )
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="company-card-content">
                <h2>{company.name}</h2>

                {company.description && (
                  <p>
                    {company.description}
                  </p>
                )}

                <div className="company-meta">
                  {company.role && (
                    <span>
                      Role: {company.role}
                    </span>
                  )}

                  {company.location && (
                    <span>
                      📍 {company.location}
                    </span>
                  )}

                  {company.package && (
                    <span>
                      Package:{" "}
                      {company.package}
                    </span>
                  )}
                </div>

                <button
                  className="company-button"
                  onClick={() =>
                    navigate(
                      `/companies/${company._id}`
                    )
                  }
                >
                  View Preparation
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Companies;