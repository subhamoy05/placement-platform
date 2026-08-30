import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import "./AdminSQLQuestionDetails.css";

function AdminSQLQuestionDetails() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const response = await api.get(
                    `/admin/sql-questions/${id}`
                );

                console.log(
                    "SQL QUESTION DETAIL STATUS:",
                    response.status
                );

                console.log(
                    "SQL QUESTION DETAIL:",
                    response.data
                );

                setQuestion(response.data.data);
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

    if (loading) {
        return (
            <div className="admin-sql-details">
                <div className="sql-details-loading">
                    Loading SQL question...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-sql-details">
                <button
                    type="button"
                    className="sql-details-back"
                    onClick={() =>
                        navigate("/admin/sql-questions")
                    }
                >
                    ← Back to SQL Questions
                </button>

                <div className="sql-details-error">
                    {error}
                </div>
            </div>
        );
    }

    if (!question) {
        return (
            <div className="admin-sql-details">
                <button
                    type="button"
                    className="sql-details-back"
                    onClick={() =>
                        navigate("/admin/sql-questions")
                    }
                >
                    ← Back to SQL Questions
                </button>

                <div className="sql-details-error">
                    SQL question not found.
                </div>
            </div>
        );
    }

    return (
        <div className="admin-sql-details">

            {/* BACK */}

            <button
                type="button"
                className="sql-details-back"
                onClick={() =>
                    navigate("/admin/sql-questions")
                }
            >
                ← Back to SQL Questions
            </button>

            {/* HEADER */}

            <div className="sql-details-header">

                <div>
                    <span className="admin-badge">
                        SQL QUESTION
                    </span>

                    <h2>{question.title}</h2>

                    <p>
                        View complete SQL question
                        information.
                    </p>
                </div>

                <div className="sql-details-header-actions">

                    <button
                        type="button"
                        className="sql-details-edit-btn"
                        onClick={() =>
                            navigate(
                                `/admin/sql-questions/${question._id}/edit`
                            )
                        }
                    >
                        Edit Question
                    </button>

                </div>

            </div>

            {/* MAIN CARD */}

            <div className="sql-details-card">

                {/* BASIC INFORMATION */}

                <section className="sql-details-section">

                    <div className="sql-details-section-title">
                        <h3>
                            Question Information
                        </h3>
                    </div>

                    <div className="sql-details-info-grid">

                        <div className="sql-details-info-item sql-details-full">
                            <span className="sql-details-label">
                                Title
                            </span>

                            <strong>
                                {question.title}
                            </strong>
                        </div>

                        <div className="sql-details-info-item sql-details-full">
                            <span className="sql-details-label">
                                Description
                            </span>

                            <p>
                                {question.description}
                            </p>
                        </div>

                        <div className="sql-details-info-item">
                            <span className="sql-details-label">
                                Category
                            </span>

                            <span className="sql-category-detail">
                                {question.category}
                            </span>
                        </div>

                        <div className="sql-details-info-item">
                            <span className="sql-details-label">
                                Difficulty
                            </span>

                            <span
                                className={`sql-question-difficulty ${
                                    question.difficulty?.toLowerCase()
                                }`}
                            >
                                {question.difficulty}
                            </span>
                        </div>

                    </div>

                </section>

                {/* DATABASE SCHEMA */}

                <section className="sql-details-section">

                    <div className="sql-details-section-title">
                        <h3>
                            Database Schema
                        </h3>
                    </div>

                    <pre className="sql-details-code">
                        <code>
                            {question.schema}
                        </code>
                    </pre>

                </section>

                {/* SAMPLE DATA */}

                <section className="sql-details-section">

                    <div className="sql-details-section-title">
                        <h3>
                            Sample Data
                        </h3>
                    </div>

                    <pre className="sql-details-code">
                        <code>
                            {question.sampleData}
                        </code>
                    </pre>

                </section>

                {/* EXPECTED RESULT */}

                <section className="sql-details-section">

                    <div className="sql-details-section-title">
                        <h3>
                            Expected Query Result
                        </h3>
                    </div>

                    <pre className="sql-details-code sql-result-code">
                        <code>
                            {
                                question.expectedQueryResult
                            }
                        </code>
                    </pre>

                </section>

                {/* COMPANY TAGS */}

                <section className="sql-details-section">

                    <div className="sql-details-section-title">
                        <h3>
                            Company Tags
                        </h3>
                    </div>

                    {question.companyTags?.length ? (
                        <div className="sql-details-company-tags">

                            {question.companyTags.map(
                                (company, index) => (
                                    <span
                                        key={index}
                                    >
                                        {company}
                                    </span>
                                )
                            )}

                        </div>
                    ) : (
                        <p className="sql-no-company-detail">
                            General
                        </p>
                    )}

                </section>

                {/* FOOTER */}

                <div className="sql-details-footer">

                    <button
                        type="button"
                        className="sql-details-back-footer"
                        onClick={() =>
                            navigate(
                                "/admin/sql-questions"
                            )
                        }
                    >
                        Back to Questions
                    </button>

                    <button
                        type="button"
                        className="sql-details-edit-footer"
                        onClick={() =>
                            navigate(
                                `/admin/sql-questions/${question._id}/edit`
                            )
                        }
                    >
                        Edit Question
                    </button>

                </div>

            </div>

        </div>
    );
}

export default AdminSQLQuestionDetails;