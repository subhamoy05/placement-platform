import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./AdminAssessmentCreate.css";

function AdminAssessmentCreate() {
    const navigate = useNavigate();

    const [companies, setCompanies] = useState([]);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        duration: "",
        totalMarks: "",
        difficulty: "Easy",
        company: "",
    });

    const [loadingCompanies, setLoadingCompanies] =
        useState(true);

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await api.get(
                    "/admin/companies"
                );

                setCompanies(
                    response.data.data || []
                );
            } catch (error) {
                console.error(
                    "Failed to load companies:",
                    error
                );
            } finally {
                setLoadingCompanies(false);
            }
        };

        fetchCompanies();
    }, []);

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
            const assessmentData = {
                title: formData.title.trim(),

                description:
                    formData.description.trim(),

                duration:
                    Number(formData.duration),

                totalMarks:
                    Number(formData.totalMarks),

                difficulty:
                    formData.difficulty,

                company:
                    formData.company || null,

                questions: [],
            };

            const response = await api.post(
                "/admin/assessments",
                assessmentData
            );

            setSuccess(
                response.data.message ||
                    "Assessment created successfully."
            );

            setTimeout(() => {
                navigate("/admin/assessments");
            }, 800);
        } catch (error) {
            console.error(
                "Failed to create assessment:",
                error
            );

            setError(
                error.response?.data?.message ||
                    "Failed to create assessment"
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="admin-assessment-create">

            {/* Back */}
            <button
                className="assessment-create-back"
                onClick={() =>
                    navigate(
                        "/admin/assessments"
                    )
                }
            >
                ← Back to Assessments
            </button>

            {/* Header */}
            <div className="assessment-create-header">

                <span className="admin-badge">
                    ADD ASSESSMENT
                </span>

                <h2>
                    Create New Assessment
                </h2>

                <p>
                    Create an assessment for
                    placement preparation.
                </p>

            </div>

            {/* Form Card */}
            <div className="assessment-create-card">

                {error && (
                    <div className="assessment-create-error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="assessment-create-success">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="assessment-create-grid">

                        {/* Title */}
                        <div className="assessment-form-group full-width">
                            <label>
                                Assessment Title
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={
                                    formData.title
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="e.g. TCS DSA Assessment"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="assessment-form-group full-width">
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
                                placeholder="Describe the assessment..."
                                rows="5"
                                required
                            />
                        </div>

                        {/* Duration */}
                        <div className="assessment-form-group">
                            <label>
                                Duration
                            </label>

                            <div className="assessment-input-with-unit">

                                <input
                                    type="number"
                                    name="duration"
                                    value={
                                        formData.duration
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min="1"
                                    placeholder="60"
                                    required
                                />

                                <span>
                                    minutes
                                </span>

                            </div>
                        </div>

                        {/* Marks */}
                        <div className="assessment-form-group">
                            <label>
                                Total Marks
                            </label>

                            <input
                                type="number"
                                name="totalMarks"
                                value={
                                    formData.totalMarks
                                }
                                onChange={
                                    handleChange
                                }
                                min="0"
                                placeholder="100"
                                required
                            />
                        </div>

                        {/* Difficulty */}
                        <div className="assessment-form-group">
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

                        {/* Company */}
                        <div className="assessment-form-group">
                            <label>
                                Company
                            </label>

                            <select
                                name="company"
                                value={
                                    formData.company
                                }
                                onChange={
                                    handleChange
                                }
                                disabled={
                                    loadingCompanies
                                }
                            >
                                <option value="">
                                    General Assessment
                                </option>

                                {companies.map(
                                    (company) => (
                                        <option
                                            key={
                                                company._id
                                            }
                                            value={
                                                company._id
                                            }
                                        >
                                            {
                                                company.name
                                            }
                                        </option>
                                    )
                                )}
                            </select>

                            <small>
                                Optional. Link this
                                assessment to a
                                company.
                            </small>
                        </div>

                    </div>

                    {/* Question Notice */}
                    <div className="assessment-question-notice">

                        <strong>
                            Questions
                        </strong>

                        <p>
                            Questions can be assigned
                            after creating the assessment.
                        </p>

                    </div>

                    {/* Actions */}
                    <div className="assessment-create-actions">

                        <button
                            type="button"
                            className="assessment-cancel-btn"
                            onClick={() =>
                                navigate(
                                    "/admin/assessments"
                                )
                            }
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="assessment-save-btn"
                            disabled={saving}
                        >
                            {saving
                                ? "Creating..."
                                : "Create Assessment"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default AdminAssessmentCreate;