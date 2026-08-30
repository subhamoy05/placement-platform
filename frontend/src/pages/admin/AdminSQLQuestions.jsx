import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./AdminSQLQuestions.css";

function AdminSQLQuestions() {
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    // =========================================
    // FETCH SQL QUESTIONS
    // =========================================

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await api.get(
                    "/admin/sql-questions"
                );

                console.log(
                    "SQL QUESTIONS:",
                    response.data
                );

                setQuestions(
                    response.data.data || []
                );
            } catch (error) {
                console.error(
                    "Failed to load SQL questions:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                        "Failed to load SQL questions"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    // =========================================
    // SEARCH / FILTER
    // =========================================

    const filteredQuestions = questions.filter(
        (question) => {
            const searchText =
                search.toLowerCase().trim();

            return (
                question.title
                    ?.toLowerCase()
                    .includes(searchText) ||
                question.description
                    ?.toLowerCase()
                    .includes(searchText) ||
                question.category
                    ?.toLowerCase()
                    .includes(searchText) ||
                question.difficulty
                    ?.toLowerCase()
                    .includes(searchText) ||
                question.companyTags?.some((company) =>
                    company
                        ?.toLowerCase()
                        .includes(searchText)
                )
            );
        }
    );

    // =========================================
    // DELETE SQL QUESTION
    // =========================================

    const handleDelete = async (id) => {
        if (!id) {
            console.error(
                "Delete failed: SQL question ID is missing"
            );
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to delete this SQL question?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await api.delete(
                `/admin/sql-questions/${id}`
            );

            console.log(
                "DELETE STATUS:",
                response.status
            );

            console.log(
                "DELETE RESPONSE:",
                response.data
            );

            // Only remove from frontend
            // after successful backend deletion
            if (response.data?.success) {
                setQuestions((prevQuestions) =>
                    prevQuestions.filter(
                        (question) =>
                            question._id !== id
                    )
                );
            } else {
                alert(
                    response.data?.message ||
                        "Failed to delete SQL question"
                );
            }
        } catch (error) {
            console.error(
                "Failed to delete SQL question:",
                error
            );

            alert(
                error.response?.data?.message ||
                    "Failed to delete SQL question"
            );
        }
    };

    // =========================================
    // RENDER
    // =========================================

    return (
        <div className="admin-sql-questions">

            {/* =================================
                BACK
            ================================= */}

            <button
                type="button"
                className="sql-question-back"
                onClick={() =>
                    navigate("/admin")
                }
            >
                ← Back to Dashboard
            </button>

            {/* =================================
                HEADER
            ================================= */}

            <div className="admin-sql-header">

                <div>
                    <span className="admin-badge">
                        SQL QUESTIONS
                    </span>

                    <h2>
                        SQL Question Management
                    </h2>

                    <p>
                        View and manage SQL
                        practice questions.
                    </p>
                </div>

                <div className="sql-question-count">
                    <strong>
                        {questions.length}
                    </strong>

                    <span>
                        Total Questions
                    </span>
                </div>

            </div>

            {/* =================================
                CARD
            ================================= */}

            <div className="sql-questions-card">

                <div className="sql-questions-card-header">

                    <h3>
                        Available SQL Questions
                    </h3>

                    <div className="sql-question-actions">

                        {/* SEARCH */}

                        <input
                            type="text"
                            placeholder="Search SQL questions..."
                            className="sql-question-search"
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                        />

                        {/* ADD */}

                        <button
                            type="button"
                            className="sql-question-add-btn"
                            onClick={() =>
                                navigate(
                                    "/admin/sql-questions/create"
                                )
                            }
                        >
                            + Add SQL Question
                        </button>

                    </div>

                </div>

                {/* =================================
                    LOADING
                ================================= */}

                {loading && (
                    <div className="sql-question-loading">
                        Loading SQL questions...
                    </div>
                )}

                {/* =================================
                    ERROR
                ================================= */}

                {error && (
                    <div className="sql-question-error">
                        {error}
                    </div>
                )}

                {/* =================================
                    TABLE
                ================================= */}

                {!loading && !error && (
                    <div className="sql-question-table-wrapper">

                        <table className="sql-question-table">

                            <thead>
                                <tr>
                                    <th>
                                        Question
                                    </th>

                                    <th>
                                        Category
                                    </th>

                                    <th>
                                        Difficulty
                                    </th>

                                    <th>
                                        Companies
                                    </th>

                                    <th>
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredQuestions.length ===
                                0 ? (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="empty-sql-questions"
                                        >
                                            No SQL
                                            questions
                                            found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredQuestions.map(
                                        (question) => (
                                            <tr
                                                key={
                                                    question._id
                                                }
                                            >

                                                {/* =================================
                                                    QUESTION
                                                ================================= */}

                                                <td>
                                                    <div className="sql-question-name-cell">

                                                        <div className="sql-question-avatar">
                                                            {question.title
                                                                ?.charAt(
                                                                    0
                                                                )
                                                                ?.toUpperCase()}
                                                        </div>

                                                        <div>
                                                            <strong>
                                                                {
                                                                    question.title
                                                                }
                                                            </strong>

                                                            <small>
                                                                {
                                                                    question.description
                                                                }
                                                            </small>
                                                        </div>

                                                    </div>
                                                </td>

                                                {/* =================================
                                                    CATEGORY
                                                ================================= */}

                                                <td>
                                                    <span className="sql-category">
                                                        {
                                                            question.category
                                                        }
                                                    </span>
                                                </td>

                                                {/* =================================
                                                    DIFFICULTY
                                                ================================= */}

                                                <td>
                                                    <span
                                                        className={`sql-question-difficulty ${
                                                            question.difficulty?.toLowerCase()
                                                        }`}
                                                    >
                                                        {
                                                            question.difficulty
                                                        }
                                                    </span>
                                                </td>

                                                {/* =================================
                                                    COMPANIES
                                                ================================= */}

                                                <td>
                                                    <div className="sql-company-tags">

                                                        {question.companyTags
                                                            ?.length ? (
                                                            question.companyTags
                                                                .slice(
                                                                    0,
                                                                    3
                                                                )
                                                                .map(
                                                                    (
                                                                        company,
                                                                        index
                                                                    ) => (
                                                                        <span
                                                                            key={
                                                                                index
                                                                            }
                                                                        >
                                                                            {
                                                                                company
                                                                            }
                                                                        </span>
                                                                    )
                                                                )
                                                        ) : (
                                                            <span className="sql-no-company">
                                                                General
                                                            </span>
                                                        )}

                                                    </div>
                                                </td>

                                                {/* =================================
                                                    ACTIONS
                                                ================================= */}

                                                <td>
                                                    <div className="sql-question-action-buttons">

                                                        {/* VIEW */}

                                                        <button
                                                            type="button"
                                                            className="sql-view-btn"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/admin/sql-questions/${question._id}`
                                                                )
                                                            }
                                                        >
                                                            View
                                                        </button>

                                                        {/* EDIT */}

                                                        <button
                                                            type="button"
                                                            className="sql-edit-btn"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/admin/sql-questions/${question._id}/edit`
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </button>

                                                        {/* DELETE */}

                                                        <button
                                                            type="button"
                                                            className="sql-delete-btn"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    question._id
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>

                                                    </div>
                                                </td>

                                            </tr>
                                        )
                                    )
                                )}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

        </div>
    );
}

export default AdminSQLQuestions;