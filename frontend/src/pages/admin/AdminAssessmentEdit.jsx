import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import "./AdminAssessmentEdit.css";

function AdminAssessmentEdit() {
    const { id } = useParams();
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

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [assessmentResponse, companiesResponse] =
                    await Promise.all([
                        api.get(
                            `/admin/assessments/${id}`
                        ),
                        api.get("/admin/companies"),
                    ]);

                const assessment =
                    assessmentResponse.data.data;

                setFormData({
                    title: assessment.title || "",
                    description:
                        assessment.description || "",
                    duration:
                        assessment.duration || "",
                    totalMarks:
                        assessment.totalMarks ?? "",
                    difficulty:
                        assessment.difficulty || "Easy",
                    company:
                        assessment.company?._id || "",
                });

                setCompanies(
                    companiesResponse.data.data || []
                );
            } catch (error) {
                console.error(
                    "Failed to load assessment:",
                    error
                );

                setError(
                    "Failed to load assessment"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
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
            };

            const response = await api.put(
                `/admin/assessments/${id}`,
                assessmentData
            );

            setSuccess(
                response.data.message ||
                    "Assessment updated successfully."
            );

            setTimeout(() => {
                navigate(
                    `/admin/assessments/${id}`
                );
            }, 800);
        } catch (error) {
            console.error(
                "Failed to update assessment:",
                error
            );

            setError(
                error.response?.data?.message ||
                    "Failed to update assessment"
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="assessment-edit-loading">
                Loading assessment...
            </div>
        );
    }

    return (
        <div className="admin-assessment-edit">

            {/* Back */}
            <button
                className="assessment-edit-back"
                onClick={() =>
                    navigate(
                        `/admin/assessments/${id}`
                    )
                }
            >
                ← Back to Assessment
            </button>

            {/* Header */}
            <div className="assessment-edit-header">

                <span className="admin-badge">
                    EDIT ASSESSMENT
                </span>

                <h2>
                    Edit Assessment
                </h2>

                <p>
                    Update assessment information.
                </p>

            </div>

            {/* Card */}
            <div className="assessment-edit-card">

                {error && (
                    <div className="assessment-edit-error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="assessment-edit-success">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="assessment-edit-grid">

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
                                    required
                                />

                                <span>
                                    minutes
                                </span>

                            </div>
                        </div>

                        {/* Total Marks */}
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
                                    companies.length ===
                                    0
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
                        </div>

                    </div>

                    {/* Questions Notice */}
                    <div className="assessment-question-notice">

                        <strong>
                            Questions
                        </strong>

                        <p>
                            Existing questions are
                            preserved. Question
                            assignment will be
                            managed separately.
                        </p>

                    </div>

                    {/* Actions */}
                    <div className="assessment-edit-actions">

                        <button
                            type="button"
                            className="assessment-cancel-btn"
                            onClick={() =>
                                navigate(
                                    `/admin/assessments/${id}`
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
                                ? "Saving..."
                                : "Save Changes"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default AdminAssessmentEdit;