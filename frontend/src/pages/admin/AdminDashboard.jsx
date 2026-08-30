import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
    const navigate = useNavigate();

    const [dashboardData, setDashboardData] = useState(null);
    const [sqlQuestionCount, setSqlQuestionCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await api.get("/admin/dashboard");

                console.log("FULL API RESPONSE:", response);
                console.log("API DATA:", response.data);
                console.log("DASHBOARD DATA:", response.data.data);

                setDashboardData(response.data.data || {});
            } catch (error) {
                console.error(
                    "Failed to load admin dashboard:",
                    error
                );

                setDashboardData({});
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    useEffect(() => {
        const fetchSQLQuestions = async () => {
            try {
                const response = await api.get(
                    "/admin/sql-questions"
                );

                console.log(
                    "SQL QUESTIONS DASHBOARD:",
                    response.data
                );

                const data = response.data;

                if (Array.isArray(data.data)) {
                    setSqlQuestionCount(data.data.length);
                } else if (typeof data.count === "number") {
                    setSqlQuestionCount(data.count);
                } else {
                    setSqlQuestionCount(0);
                }
            } catch (error) {
                console.error(
                    "Failed to load SQL question count:",
                    error
                );

                setSqlQuestionCount(0);
            }
        };

        fetchSQLQuestions();
    }, []);

    return (
        <div className="admin-dashboard">

            {/* =========================
                WELCOME SECTION
            ========================== */}

            <section className="admin-welcome">
                <span className="admin-badge">
                    ADMINISTRATION
                </span>

                <h2>
                    Placement Platform Management
                </h2>

                <p>
                    Manage students, companies,
                    assessments, questions and
                    placement activities from one place.
                </p>
            </section>

            {/* =========================
                STATISTICS
            ========================== */}

            <section className="admin-stats">

                {/* Students */}

                <div className="admin-stat-card">
                    <span>👨‍🎓</span>

                    <h3>Students</h3>

                    <strong>
                        {loading
                            ? "..."
                            : dashboardData?.studentCount ?? 0}
                    </strong>

                    <p>
                        Registered students
                    </p>
                </div>

                {/* Companies */}

                <div className="admin-stat-card">
                    <span>🏢</span>

                    <h3>Companies</h3>

                    <strong>
                        {loading
                            ? "..."
                            : dashboardData?.companyCount ?? 0}
                    </strong>

                    <p>
                        Available companies
                    </p>
                </div>

                {/* Assessments */}

                <div className="admin-stat-card">
                    <span>📝</span>

                    <h3>Assessments</h3>

                    <strong>
                        {loading
                            ? "..."
                            : dashboardData?.assessmentCount ?? 0}
                    </strong>

                    <p>
                        Available assessments
                    </p>
                </div>

                {/* DSA Questions */}

                <div className="admin-stat-card">
                    <span>💻</span>

                    <h3>DSA Questions</h3>

                    <strong>
                        {loading
                            ? "..."
                            : dashboardData?.questionCount ?? 0}
                    </strong>

                    <p>
                        DSA practice questions
                    </p>
                </div>

                {/* SQL Questions */}

                <div className="admin-stat-card">
                    <span>🗄️</span>

                    <h3>SQL Questions</h3>

                    <strong>
                        {sqlQuestionCount}
                    </strong>

                    <p>
                        SQL practice questions
                    </p>
                </div>

            </section>

            {/* =========================
                QUICK MANAGEMENT
            ========================== */}

            <section className="admin-actions">

                <h2>
                    Quick Management
                </h2>

                <div className="admin-action-grid">

                    {/* Students */}

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/admin/students")
                        }
                    >
                        <span>👨‍🎓</span>

                        <strong>
                            Manage Students
                        </strong>

                        <small>
                            View and manage registered
                            students
                        </small>
                    </button>

                    {/* Companies */}

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/admin/companies")
                        }
                    >
                        <span>🏢</span>

                        <strong>
                            Manage Companies
                        </strong>

                        <small>
                            Add and manage placement
                            companies
                        </small>
                    </button>

                    {/* Assessments */}

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/admin/assessments")
                        }
                    >
                        <span>📝</span>

                        <strong>
                            Manage Assessments
                        </strong>

                        <small>
                            Create and manage
                            assessments
                        </small>
                    </button>

                    {/* DSA */}

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/admin/questions")
                        }
                    >
                        <span>💻</span>

                        <strong>
                            DSA Questions
                        </strong>

                        <small>
                            Create, edit, and delete
                            DSA questions
                        </small>
                    </button>

                    {/* SQL */}

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/admin/sql-questions")
                        }
                    >
                        <span>🗄️</span>

                        <strong>
                            SQL Questions
                        </strong>

                        <small>
                            Create, edit, and delete
                            SQL questions
                        </small>
                    </button>

                </div>
            </section>
        </div>
    );
}

export default AdminDashboard;