import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./AdminQuestions.css";

function AdminQuestions() {
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await api.get(
                    "/admin/questions"
                );

                console.log(
                    "QUESTIONS:",
                    response.data
                );

                setQuestions(
                    response.data.data || []
                );
            } catch (error) {
                console.error(
                    "Failed to load questions:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                        "Failed to load questions"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    /* ================================
       SEARCH
    ================================= */

    const filteredQuestions = questions.filter(
        (question) => {
            const searchText =
                search.toLowerCase();

            return (
                question.title
                    ?.toLowerCase()
                    .includes(searchText) ||
                question.description
                    ?.toLowerCase()
                    .includes(searchText) ||
                question.topic
                    ?.toLowerCase()
                    .includes(searchText) ||
                question.difficulty
                    ?.toLowerCase()
                    .includes(searchText) ||
                question.companyTags?.some(
                    (company) =>
                        company
                            ?.toLowerCase()
                            .includes(searchText)
                )
            );
        }
    );

    /* ================================
       DELETE
    ================================= */

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this question?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await api.delete(
                `/admin/questions/${id}`
            );

            console.log(
                "DELETE STATUS:",
                response.status
            );

            console.log(
                "DELETE RESPONSE:",
                response.data
            );

            setQuestions((prev) =>
                prev.filter(
                    (question) =>
                        question._id !== id
                )
            );
        } catch (error) {
            console.error(
                "Failed to delete question:",
                error
            );

            alert(
                error.response?.data?.message ||
                    "Failed to delete question"
            );
        }
    };

    /* ================================
       LOADING
    ================================= */

    if (loading) {
        return (
            <div className="admin-questions">
                <div className="questions-loading">
                    Loading questions...
                </div>
            </div>
        );
    }

    return (
        <div className="admin-questions">

            {/* ================================
                BACK BUTTON
            ================================= */}

            <button
                type="button"
                className="question-back-btn"
                onClick={() =>
                    navigate("/admin")
                }
            >
                ← Back to Dashboard
            </button>

            {/* ================================
                HEADER
            ================================= */}

            <div className="admin-questions-header">

                <div>
                    <span className="admin-badge">
                        DSA QUESTIONS
                    </span>

                    <h2>
                        DSA Question Management
                    </h2>

                    <p>
                        Create and manage coding
                        questions for placement
                        preparation.
                    </p>
                </div>

                <div className="question-count">
                    <strong>
                        {questions.length}
                    </strong>

                    <span>
                        Total Questions
                    </span>
                </div>

            </div>

            {/* ================================
                CARD
            ================================= */}

            <div className="questions-card">

                {/* Card Header */}

                <div className="questions-card-header">

                    <h3>
                        Available Questions
                    </h3>

                    <div className="questions-header-actions">

                        {/* Search */}

                        <input
                            type="text"
                            placeholder="Search questions..."
                            className="question-search"
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                        />

                        {/* Add */}

                        <button
                            type="button"
                            className="question-add-btn"
                            onClick={() =>
                                navigate(
                                    "/admin/questions/create"
                                )
                            }
                        >
                            + Add Question
                        </button>

                    </div>

                </div>

                {/* ================================
                    ERROR
                ================================= */}

                {error && (
                    <div className="questions-error">
                        {error}
                    </div>
                )}

                {/* ================================
                    TABLE
                ================================= */}

                {!error && (
                    <div className="questions-table-wrapper">

                        <table className="questions-table">

                            <thead>
                                <tr>
                                    <th>
                                        Question
                                    </th>

                                    <th>
                                        Topic
                                    </th>

                                    <th>
                                        Difficulty
                                    </th>

                                    <th>
                                        Companies
                                    </th>

                                    <th>
                                        Examples
                                    </th>

                                    <th>
                                        Test Cases
                                    </th>

                                    <th>
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>

                                {/* Empty */}

                                {filteredQuestions.length ===
                                0 ? (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="empty-questions"
                                        >
                                            {search
                                                ? "No questions match your search."
                                                : "No questions found."}
                                        </td>
                                    </tr>
                                ) : (

                                    /* Question Rows */

                                    filteredQuestions.map(
                                        (question) => (
                                            <tr
                                                key={
                                                    question._id
                                                }
                                            >

                                                {/* Question */}

                                                <td>
                                                    <div className="question-name-cell">

                                                        <div className="question-avatar">
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
                                                                {question.description?.length >
                                                                70
                                                                    ? `${question.description.substring(
                                                                          0,
                                                                          70
                                                                      )}...`
                                                                    : question.description}
                                                            </small>
                                                        </div>

                                                    </div>
                                                </td>

                                                {/* Topic */}

                                                <td>
                                                    <span className="question-topic">
                                                        {
                                                            question.topic
                                                        }
                                                    </span>
                                                </td>

                                                {/* Difficulty */}

                                                <td>
                                                    <span
                                                        className={`question-difficulty ${question.difficulty?.toLowerCase()}`}
                                                    >
                                                        {
                                                            question.difficulty
                                                        }
                                                    </span>
                                                </td>

                                                {/* Companies */}

                                                <td>
                                                    <div className="question-company-tags">

                                                        {question.companyTags?.length >
                                                        0 ? (
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
                                                            <span className="no-company">
                                                                General
                                                            </span>
                                                        )}

                                                        {question.companyTags?.length >
                                                            3 && (
                                                            <small>
                                                                +
                                                                {question
                                                                    .companyTags
                                                                    .length -
                                                                    3}
                                                            </small>
                                                        )}

                                                    </div>
                                                </td>

                                                {/* Examples */}

                                                <td>
                                                    <span className="question-number">
                                                        {
                                                            question
                                                                .examples
                                                                ?.length
                                                        }
                                                    </span>
                                                </td>

                                                {/* Test Cases */}

                                                <td>
                                                    <span className="question-number">
                                                        {
                                                            question
                                                                .testCases
                                                                ?.length
                                                        }
                                                    </span>
                                                </td>

                                                {/* Actions */}

                                                <td>
                                                    <div className="question-actions">

                                                        {/* View */}

                                                        <button
                                                            type="button"
                                                            className="question-view-btn"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/admin/questions/${question._id}`
                                                                )
                                                            }
                                                        >
                                                            View
                                                        </button>

                                                        {/* Edit */}

                                                        <button
                                                            type="button"
                                                            className="question-edit-btn"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/admin/questions/${question._id}/edit`
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </button>

                                                        {/* Delete */}

                                                        <button
                                                            type="button"
                                                            className="question-delete-btn"
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

export default AdminQuestions;