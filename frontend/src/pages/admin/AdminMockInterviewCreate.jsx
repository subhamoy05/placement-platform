import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./AdminMockInterviewCreate.css";

function AdminMockInterviewCreate() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "Technical",
        difficulty: "Medium",
        duration: 30,
        instructions: "",
        isPublished: false,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            setError("Please enter an interview title.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            await api.post(
                "/admin/mock-interviews",
                formData
            );

            navigate("/admin/mock-interviews");
        } catch (err) {
            console.error(
                "Failed to create mock interview:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to create mock interview."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-mock-create">

            {/* =================================
                HEADER
            ================================= */}

            <section className="mock-create-header">
                <div>
                    <span className="mock-create-badge">
                        MOCK INTERVIEWS
                    </span>

                    <h1>
                        Create Mock Interview
                    </h1>

                    <p>
                        Create a new interview for
                        students to practice.
                    </p>
                </div>

                <button
                    type="button"
                    className="back-btn"
                    onClick={() =>
                        navigate(
                            "/admin/mock-interviews"
                        )
                    }
                >
                    ← Back
                </button>
            </section>


            {/* =================================
                FORM
            ================================= */}

            <section className="mock-create-card">

                <form onSubmit={handleSubmit}>

                    {error && (
                        <div className="create-error">
                            {error}
                        </div>
                    )}

                    {/* Title */}

                    <div className="form-group">
                        <label htmlFor="title">
                            Interview Title
                        </label>

                        <input
                            id="title"
                            name="title"
                            type="text"
                            placeholder="e.g. Frontend Developer Mock Interview"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>


                    {/* Description */}

                    <div className="form-group">
                        <label htmlFor="description">
                            Description
                        </label>

                        <textarea
                            id="description"
                            name="description"
                            rows="4"
                            placeholder="Describe this mock interview..."
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>


                    {/* Grid */}

                    <div className="form-row">

                        {/* Category */}

                        <div className="form-group">
                            <label htmlFor="category">
                                Category
                            </label>

                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                            >
                                <option value="Technical">
                                    Technical
                                </option>

                                <option value="HR">
                                    HR
                                </option>

                                <option value="Behavioral">
                                    Behavioral
                                </option>

                                <option value="Mixed">
                                    Mixed
                                </option>
                            </select>
                        </div>


                        {/* Difficulty */}

                        <div className="form-group">
                            <label htmlFor="difficulty">
                                Difficulty
                            </label>

                            <select
                                id="difficulty"
                                name="difficulty"
                                value={formData.difficulty}
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


                        {/* Duration */}

                        <div className="form-group">
                            <label htmlFor="duration">
                                Duration (minutes)
                            </label>

                            <input
                                id="duration"
                                name="duration"
                                type="number"
                                min="5"
                                max="180"
                                value={formData.duration}
                                onChange={handleChange}
                            />
                        </div>

                    </div>


                    {/* Instructions */}

                    <div className="form-group">
                        <label htmlFor="instructions">
                            Interview Instructions
                        </label>

                        <textarea
                            id="instructions"
                            name="instructions"
                            rows="5"
                            placeholder="Enter instructions for students..."
                            value={formData.instructions}
                            onChange={handleChange}
                        />
                    </div>


                    {/* Publish */}

                    <div className="publish-box">

                        <div>
                            <strong>
                                Publish Interview
                            </strong>

                            <small>
                                Published interviews
                                will be available to
                                students.
                            </small>
                        </div>

                        <label className="switch">
                            <input
                                type="checkbox"
                                name="isPublished"
                                checked={
                                    formData.isPublished
                                }
                                onChange={handleChange}
                            />

                            <span className="slider"></span>
                        </label>

                    </div>


                    {/* Actions */}

                    <div className="form-actions">

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() =>
                                navigate(
                                    "/admin/mock-interviews"
                                )
                            }
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading}
                        >
                            {loading
                                ? "Creating..."
                                : "Create Mock Interview"}
                        </button>

                    </div>

                </form>

            </section>

        </div>
    );
}

export default AdminMockInterviewCreate;