import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import "./AdminCompanyEdit.css";

function AdminCompanyEdit() {
    const { id } = useParams();
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

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const response = await api.get(
                    `/admin/companies/${id}`
                );

                const company =
                    response.data.data;

                setFormData({
                    name: company.name || "",
                    description:
                        company.description || "",
                    package:
                        company.package || "",
                    difficulty:
                        company.difficulty || "Easy",
                    eligibility:
                        company.eligibility?.join(
                            ", "
                        ) || "",
                    rounds:
                        company.rounds?.join(
                            ", "
                        ) || "",
                    topics:
                        company.topics?.join(
                            ", "
                        ) || "",
                });
            } catch (error) {
                console.error(
                    "Failed to load company:",
                    error
                );

                setError(
                    "Failed to load company"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCompany();
    }, [id]);

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

                package:
                    formData.package.trim(),

                difficulty:
                    formData.difficulty,

                eligibility:
                    formData.eligibility
                        .split(",")
                        .map((item) =>
                            item.trim()
                        )
                        .filter(Boolean),

                rounds:
                    formData.rounds
                        .split(",")
                        .map((item) =>
                            item.trim()
                        )
                        .filter(Boolean),

                topics:
                    formData.topics
                        .split(",")
                        .map((item) =>
                            item.trim()
                        )
                        .filter(Boolean),
            };

            const response = await api.put(
                `/admin/companies/${id}`,
                companyData
            );

            setSuccess(
                response.data.message ||
                    "Company updated successfully."
            );

            setTimeout(() => {
                navigate(
                    `/admin/companies/${id}`
                );
            }, 800);
        } catch (error) {
            console.error(
                "Failed to update company:",
                error
            );

            setError(
                error.response?.data?.message ||
                    "Failed to update company"
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="company-edit-loading">
                Loading company...
            </div>
        );
    }

    return (
        <div className="admin-company-edit">

            {/* Back */}
            <button
                className="company-edit-back"
                onClick={() =>
                    navigate(
                        `/admin/companies/${id}`
                    )
                }
            >
                ← Back to Company
            </button>

            {/* Header */}
            <div className="company-edit-header">
                <span className="admin-badge">
                    EDIT COMPANY
                </span>

                <h2>
                    Edit Company
                </h2>

                <p>
                    Update company and placement
                    information.
                </p>
            </div>

            {/* Card */}
            <div className="company-edit-card">

                {error && (
                    <div className="company-edit-error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="company-edit-success">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="company-edit-grid">

                        {/* Name */}
                        <div className="company-form-group">
                            <label>
                                Company Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={
                                    handleChange
                                }
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
                                value={
                                    formData.package
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="e.g. 8 LPA"
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
                                onChange={
                                    handleChange
                                }
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
                                onChange={
                                    handleChange
                                }
                                placeholder="B.Tech, 60%+, No backlogs"
                            />

                            <small>
                                Separate items with
                                commas.
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
                                onChange={
                                    handleChange
                                }
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
                                onChange={
                                    handleChange
                                }
                                placeholder="Online Assessment, Technical Interview, HR"
                            />

                            <small>
                                Separate rounds with
                                commas.
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
                                onChange={
                                    handleChange
                                }
                                placeholder="DSA, SQL, OOP"
                            />

                            <small>
                                Separate topics with
                                commas.
                            </small>
                        </div>

                    </div>

                    {/* Actions */}
                    <div className="company-edit-actions">

                        <button
                            type="button"
                            className="company-cancel-btn"
                            onClick={() =>
                                navigate(
                                    `/admin/companies/${id}`
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
                                ? "Saving..."
                                : "Save Changes"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default AdminCompanyEdit;