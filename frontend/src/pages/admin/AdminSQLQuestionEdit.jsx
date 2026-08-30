import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import "./AdminSQLQuestionEdit.css";

function AdminSQLQuestionEdit() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        difficulty: "Easy",
        category: "SELECT",
        schema: "",
        sampleData: "",
        expectedQueryResult: "",
        companyTags: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const response = await api.get(
                    `/admin/sql-questions/${id}`
                );

                console.log(
                    "SQL EDIT DETAIL STATUS:",
                    response.status
                );

                console.log(
                    "SQL EDIT DETAIL:",
                    response.data
                );

                const question = response.data.data;

                if (!question) {
                    setError("SQL question not found.");
                    return;
                }

                setFormData({
                    title: question.title || "",
                    description: question.description || "",
                    difficulty: question.difficulty || "Easy",
                    category: question.category || "SELECT",
                    schema: question.schema || "",
                    sampleData: question.sampleData || "",
                    expectedQueryResult:
                        question.expectedQueryResult || "",
                    companyTags:
                        question.companyTags?.join(", ") || "",
                });
            } catch (error) {
                console.error(
                    "Failed to load SQL question:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                        "Failed to load SQL question"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchQuestion();
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

        setError("");

        if (
            !formData.title.trim() ||
            !formData.description.trim() ||
            !formData.schema.trim() ||
            !formData.sampleData.trim() ||
            !formData.expectedQueryResult.trim()
        ) {
            setError(
                "Please fill in all required fields."
            );
            return;
        }

        try {
            setSaving(true);

            const payload = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                difficulty: formData.difficulty,
                category: formData.category,
                schema: formData.schema.trim(),
                sampleData: formData.sampleData.trim(),
                expectedQueryResult:
                    formData.expectedQueryResult.trim(),
                companyTags: formData.companyTags
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean),
            };

            const response = await api.put(
                `/admin/sql-questions/${id}`,
                payload
            );

            console.log(
                "UPDATE SQL QUESTION STATUS:",
                response.status
            );

            console.log(
                "UPDATE SQL QUESTION RESPONSE:",
                response.data
            );

            navigate(`/admin/sql-questions/${id}`);
        } catch (error) {
            console.error(
                "Failed to update SQL question:",
                error
            );

            setError(
                error.response?.data?.message ||
                    "Failed to update SQL question"
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="admin-sql-edit">
                <div className="sql-edit-loading">
                    Loading SQL question...
                </div>
            </div>
        );
    }

    if (error && !formData.title) {
        return (
            <div className="admin-sql-edit">
                <button
                    type="button"
                    className="sql-edit-back"
                    onClick={() =>
                        navigate("/admin/sql-questions")
                    }
                >
                    ← Back to SQL Questions
                </button>

                <div className="sql-edit-error">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="admin-sql-edit">

            {/* BACK */}

            <button
                type="button"
                className="sql-edit-back"
                onClick={() =>
                    navigate(`/admin/sql-questions/${id}`)
                }
            >
                ← Back to Question
            </button>

            {/* HEADER */}

            <div className="sql-edit-header">

                <div>
                    <span className="admin-badge">
                        SQL QUESTIONS
                    </span>

                    <h2>
                        Edit SQL Question
                    </h2>

                    <p>
                        Update the SQL practice
                        question details.
                    </p>
                </div>

            </div>

            {/* CARD */}

            <div className="sql-edit-card">

                <form
                    className="sql-edit-form"
                    onSubmit={handleSubmit}
                >

                    {/* BASIC INFORMATION */}

                    <div className="sql-edit-section">

                        <h3>
                            Basic Information
                        </h3>

                        <div className="sql-edit-grid">

                            <div className="sql-edit-group sql-edit-full">

                                <label>
                                    Question Title
                                    <span>*</span>
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Enter question title"
                                />

                            </div>

                            <div className="sql-edit-group sql-edit-full">

                                <label>
                                    Description
                                    <span>*</span>
                                </label>

                                <textarea
                                    name="description"
                                    value={
                                        formData.description
                                    }
                                    onChange={handleChange}
                                    placeholder="Describe the SQL problem..."
                                    rows="5"
                                />

                            </div>

                            <div className="sql-edit-group">

                                <label>
                                    Difficulty
                                    <span>*</span>
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

                            <div className="sql-edit-group">

                                <label>
                                    Category
                                    <span>*</span>
                                </label>

                                <select
                                    name="category"
                                    value={
                                        formData.category
                                    }
                                    onChange={handleChange}
                                >
                                    <option value="SELECT">
                                        SELECT
                                    </option>

                                    <option value="WHERE">
                                        WHERE
                                    </option>

                                    <option value="GROUP BY">
                                        GROUP BY
                                    </option>

                                    <option value="HAVING">
                                        HAVING
                                    </option>

                                    <option value="ORDER BY">
                                        ORDER BY
                                    </option>

                                    <option value="JOIN">
                                        JOIN
                                    </option>

                                    <option value="Subquery">
                                        Subquery
                                    </option>

                                    <option value="Aggregate Functions">
                                        Aggregate Functions
                                    </option>

                                    <option value="Window Functions">
                                        Window Functions
                                    </option>
                                </select>

                            </div>

                        </div>

                    </div>

                    {/* DATABASE INFORMATION */}

                    <div className="sql-edit-section">

                        <h3>
                            Database Information
                        </h3>

                        <div className="sql-edit-grid">

                            <div className="sql-edit-group sql-edit-full">

                                <label>
                                    Database Schema
                                    <span>*</span>
                                </label>

                                <textarea
                                    name="schema"
                                    value={formData.schema}
                                    onChange={handleChange}
                                    rows="10"
                                    className="sql-edit-code"
                                />

                            </div>

                            <div className="sql-edit-group sql-edit-full">

                                <label>
                                    Sample Data
                                    <span>*</span>
                                </label>

                                <textarea
                                    name="sampleData"
                                    value={
                                        formData.sampleData
                                    }
                                    onChange={handleChange}
                                    rows="10"
                                    className="sql-edit-code"
                                />

                            </div>

                            <div className="sql-edit-group sql-edit-full">

                                <label>
                                    Expected Query Result
                                    <span>*</span>
                                </label>

                                <textarea
                                    name="expectedQueryResult"
                                    value={
                                        formData.expectedQueryResult
                                    }
                                    onChange={handleChange}
                                    rows="8"
                                    className="sql-edit-code"
                                />

                            </div>

                        </div>

                    </div>

                    {/* COMPANY TAGS */}

                    <div className="sql-edit-section">

                        <h3>
                            Company Tags
                        </h3>

                        <div className="sql-edit-group">

                            <label>
                                Companies
                            </label>

                            <input
                                type="text"
                                name="companyTags"
                                value={
                                    formData.companyTags
                                }
                                onChange={handleChange}
                                placeholder="TCS, Infosys, Accenture"
                            />

                            <small>
                                Separate multiple
                                companies with commas.
                            </small>

                        </div>

                    </div>

                    {/* ERROR */}

                    {error && (
                        <div className="sql-edit-error">
                            {error}
                        </div>
                    )}

                    {/* FOOTER */}

                    <div className="sql-edit-footer">

                        <button
                            type="button"
                            className="sql-edit-cancel"
                            onClick={() =>
                                navigate(
                                    `/admin/sql-questions/${id}`
                                )
                            }
                            disabled={saving}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="sql-edit-save"
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

export default AdminSQLQuestionEdit;