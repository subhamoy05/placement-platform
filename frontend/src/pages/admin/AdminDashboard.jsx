import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
	const navigate = useNavigate();
	const { user } = useAuth();

	const [dashboardData, setDashboardData] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchDashboard = async () => {
			try {
				const response = await api.get("/admin/dashboard");

				console.log("FULL API RESPONSE:", response);
				console.log("API DATA:", response.data);
				console.log("DASHBOARD DATA:", response.data.data);

				setDashboardData(response.data.data);
			} catch (error) {
				console.error("Failed to load admin dashboard:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchDashboard();
	}, []);
	return (
		<div className="admin-dashboard">
			{/* Welcome Section */}
			<section className="admin-welcome">
				<span className="admin-badge">ADMIN</span>

				<h2>Placement Platform Management</h2>

				<p>Manage students, companies, assessments, questions and placement activities from one place.</p>
			</section>

			{/* Statistics */}
			<section className="admin-stats">
				<div className="admin-stat-card">
					<span>👨‍🎓</span>

					<h3>Students</h3>

					<strong>{loading ? "..." : (dashboardData?.studentCount ?? 0)}</strong>

					<p>Registered students</p>
				</div>

				<div className="admin-stat-card">
					<span>🏢</span>

					<h3>Companies</h3>

					<strong>{loading ? "..." : (dashboardData?.companyCount ?? 0)}</strong>

					<p>Available companies</p>
				</div>

				<div className="admin-stat-card">
					<span>📝</span>

					<h3>Assessments</h3>

					<strong>{loading ? "..." : (dashboardData?.assessmentCount ?? 0)}</strong>

					<p>Available assessments</p>
				</div>

				<div className="admin-stat-card">
					<span>💻</span>

					<h3>Questions</h3>

					<strong>{loading ? "..." : (dashboardData?.questionCount ?? 0)}</strong>

					<p>Practice questions</p>
				</div>
			</section>

			{/* Quick Management */}
			<section className="admin-actions">
				<h2>Quick Management</h2>

				<div className="admin-action-grid">
					<button onClick={() => navigate("/admin/students")}>
						<span>👨‍🎓</span>

						<strong>Manage Students</strong>

						<small>View and manage registered students</small>
					</button>

					<button onClick={() => navigate("/admin/companies")}>
						<span>🏢</span>

						<strong>Manage Companies</strong>

						<small>Add and manage placement companies</small>
					</button>

					<button onClick={() => navigate("/admin/assessments")}>
						<span>📝</span>

						<strong>Manage Assessments</strong>

						<small>Create and manage assessments</small>
					</button>

					<button onClick={() => navigate("/admin/questions")}>
						<span>💻</span>

						<strong>Manage Questions</strong>

						<small>Manage DSA and SQL questions</small>
					</button>
				</div>
			</section>
		</div>
	);
}

export default AdminDashboard;
