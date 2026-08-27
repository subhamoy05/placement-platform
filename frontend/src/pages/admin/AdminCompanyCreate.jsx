import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./AdminCompanyCreate.css";

function AdminCompanyCreate() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        package: "",
        difficulty: "Easy",
        eligibility: "",
        rounds: "",
        topics: "",
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const companyData = {
                name: formData.name.trim(),
                description:
                    formData.description.trim(),
                package: formData.package.trim(),
                difficulty: formData.difficulty,

                eligibility: formData.eligibility
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),

                rounds: formData.rounds
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),

                topics: formData.topics
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),

                questions: [],
            };

            const response = await api.post(
                "/admin/companies",
                companyData
            );

            setSuccess(
                response.data.message ||
                    "Company created successfully."
            );

            setTimeout(() => {
                navigate("/admin/companies");
            }, 800);
        } catch (error) {
            console.error(
                "Failed to create company:",
                error
            );

            setError(
                error.response?.data?.message ||
                    "Failed to create company"
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="admin-company-create">

            {/* Back */}
            <button
                className="company-create-back"
                onClick={() =>
                    navigate("/admin/companies")
                }
            >
                ← Back to Companies
            </button>

            {/* Header */}
            <div className="company-create-header">
                <span className="admin-badge">
                    ADD COMPANY
                </span>

                <h2>
                    Create New Company
                </h2>

                <p>
                    Add a new placement company
                    to the platform.
                </p>
            </div>

            {/* Form Card */}
            <div className="company-create-card">

                {error && (
                    <div className="company-create-error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="company-create-success">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="company-create-grid">

                        {/* Name */}
                        <div className="company-form-group">
                            <label>
                                Company Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. TCS"
                                required
                            />
                        </div>

                        {/* Package */}
                        <div className="company-form-group">
                            <label>
                                Package
                            </label>

                            <input
                                type="text"
                                name="package"
                                value={formData.package}
                                onChange={handleChange}
                                placeholder="e.g. 6 LPA"
                            />
                        </div>

                        {/* Difficulty */}
                        <div className="company-form-group">
                            <label>
                                Difficulty
                            </label>

                            <select
                                name="difficulty"
                                value={
                                    formData.difficulty
                                }
                                onChange={handleChange}
                            >
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
                        </div>

                        {/* Eligibility */}
                        <div className="company-form-group">
                            <label>
                                Eligibility
                            </label>

                            <input
                                type="text"
                                name="eligibility"
                                value={
                                    formData.eligibility
                                }
                                onChange={handleChange}
                                placeholder="B.Tech, 60%+, No backlogs"
                            />

                            <small>
                                Separate items with commas.
                            </small>
                        </div>

                        {/* Description */}
                        <div className="company-form-group full-width">
                            <label>
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={
                                    formData.description
                                }
                                onChange={handleChange}
                                placeholder="Describe the company and placement opportunity..."
                                rows="5"
                                required
                            />
                        </div>

                        {/* Rounds */}
                        <div className="company-form-group full-width">
                            <label>
                                Interview Rounds
                            </label>

                            <input
                                type="text"
                                name="rounds"
                                value={
                                    formData.rounds
                                }
                                onChange={handleChange}
                                placeholder="Online Assessment, Technical Interview, HR"
                            />

                            <small>
                                Separate rounds with commas.
                            </small>
                        </div>

                        {/* Topics */}
                        <div className="company-form-group full-width">
                            <label>
                                Topics
                            </label>

                            <input
                                type="text"
                                name="topics"
                                value={
                                    formData.topics
                                }
                                onChange={handleChange}
                                placeholder="DSA, SQL, OOP, DBMS"
                            />

                            <small>
                                Separate topics with commas.
                            </small>
                        </div>

                    </div>

                    {/* Actions */}
                    <div className="company-create-actions">

                        <button
                            type="button"
                            className="company-cancel-btn"
                            onClick={() =>
                                navigate(
                                    "/admin/companies"
                                )
                            }
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="company-save-btn"
                            disabled={saving}
                        >
                            {saving
                                ? "Creating..."
                                : "Create Company"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default AdminCompanyCreate;