import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./AdminMockInterviews.css";

function AdminMockInterviews() {
    const navigate = useNavigate();

    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchMockInterviews();
    }, []);

    const fetchMockInterviews = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                "/admin/mock-interviews"
            );

            const data = response.data;

            if (Array.isArray(data)) {
                setInterviews(data);
            } else if (Array.isArray(data.data)) {
                setInterviews(data.data);
            } else {
                setInterviews([]);
            }
        } catch (err) {
            console.error(
                "Failed to load mock interviews:",
                err
            );

            setError(
                "Failed to load mock interviews."
            );

            setInterviews([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this mock interview?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(
                `/admin/mock-interviews/${id}`
            );

            setInterviews((prev) =>
                prev.filter(
                    (interview) =>
                        interview._id !== id &&
                        interview.id !== id
                )
            );
        } catch (err) {
            console.error(
                "Failed to delete mock interview:",
                err
            );

            alert(
                "Failed to delete mock interview."
            );
        }
    };

    const getInterviewId = (interview) => {
        return interview._id || interview.id;
    };

    const getTitle = (interview) => {
        return (
            interview.title ||
            interview.name ||
            "Untitled Mock Interview"
        );
    };

    const getDescription = (interview) => {
        return (
            interview.description ||
            "No description available."
        );
    };

    const getStatus = (interview) => {
        return (
            interview.status ||
            (interview.isPublished
                ? "Published"
                : "Draft")
        );
    };

    return (
        <div className="admin-mock-interviews">

            {/* =================================
                HEADER
            ================================= */}

            <section className="mock-interview-header">

                <div>
                    <span className="mock-interview-badge">
                        MOCK INTERVIEWS
                    </span>

                    <h1>
                        Mock Interview Management
                    </h1>

                    <p>
                        Create and manage mock
                        interviews for students.
                    </p>
                </div>

                <button
                    type="button"
                    className="create-interview-btn"
                    onClick={() =>
                        navigate(
                            "/admin/mock-interviews/create"
                        )
                    }
                >
                    <span>＋</span>
                    Create Mock Interview
                </button>

            </section>


            {/* =================================
                ERROR
            ================================= */}

            {error && (
                <div className="mock-interview-error">
                    {error}
                </div>
            )}


            {/* =================================
                CONTENT
            ================================= */}

            <section className="mock-interview-content">

                <div className="mock-interview-content-header">
                    <div>
                        <h2>
                            All Mock Interviews
                        </h2>

                        <p>
                            {interviews.length} interview
                            {interviews.length !== 1
                                ? "s"
                                : ""}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="refresh-btn"
                        onClick={fetchMockInterviews}
                    >
                        ↻ Refresh
                    </button>
                </div>


                {/* =================================
                    LOADING
                ================================= */}

                {loading && (
                    <div className="mock-interview-empty">
                        <div className="loading-spinner"></div>

                        <p>
                            Loading mock interviews...
                        </p>
                    </div>
                )}


                {/* =================================
                    EMPTY
                ================================= */}

                {!loading &&
                    interviews.length === 0 && (
                        <div className="mock-interview-empty">

                            <div className="empty-icon">
                                🎤
                            </div>

                            <h3>
                                No Mock Interviews
                            </h3>

                            <p>
                                Create your first mock
                                interview to get started.
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/admin/mock-interviews/create"
                                    )
                                }
                            >
                                Create Mock Interview
                            </button>

                        </div>
                    )}


                {/* =================================
                    INTERVIEW GRID
                ================================= */}

                {!loading &&
                    interviews.length > 0 && (
                        <div className="mock-interview-grid">

                            {interviews.map(
                                (interview) => {
                                    const id =
                                        getInterviewId(
                                            interview
                                        );

                                    return (
                                        <article
                                            className="mock-interview-card"
                                            key={id}
                                        >

                                            <div className="mock-card-top">

                                                <div className="mock-card-icon">
                                                    🎤
                                                </div>

                                                <span
                                                    className={`mock-status ${
                                                        String(
                                                            getStatus(
                                                                interview
                                                            )
                                                        ).toLowerCase()
                                                    }`}
                                                >
                                                    {getStatus(
                                                        interview
                                                    )}
                                                </span>

                                            </div>


                                            <h3>
                                                {getTitle(
                                                    interview
                                                )}
                                            </h3>

                                            <p>
                                                {getDescription(
                                                    interview
                                                )}
                                            </p>


                                            <div className="mock-card-info">

                                                <span>
                                                    ⏱️{" "}
                                                    {interview.duration ||
                                                        30}{" "}
                                                    min
                                                </span>

                                                <span>
                                                    ❓{" "}
                                                    {interview.questionCount ||
                                                        interview.questions?.length ||
                                                        0}{" "}
                                                    Questions
                                                </span>

                                            </div>


                                            <div className="mock-card-actions">

                                                <button
                                                    type="button"
                                                    className="view-btn"
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/mock-interviews/${id}`
                                                        )
                                                    }
                                                >
                                                    View
                                                </button>

                                                <button
                                                    type="button"
                                                    className="edit-btn"
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/mock-interviews/${id}/edit`
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    className="delete-btn"
                                                    onClick={() =>
                                                        handleDelete(
                                                            id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </article>
                                    );
                                }
                            )}

                        </div>
                    )}

            </section>

        </div>
    );
}

export default AdminMockInterviews;