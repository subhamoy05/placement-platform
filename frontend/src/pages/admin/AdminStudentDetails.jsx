import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import "./AdminStudentDetails.css";

function AdminStudentDetails() {
	const { id } = useParams();
	const navigate = useNavigate();

	const [student, setStudent] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchStudent = async () => {
			try {
				const response = await api.get(`/admin/students/${id}`);

				setStudent(response.data.data);
			} catch (error) {
				console.error("Failed to load student:", error);

				setError("Failed to load student");
			} finally {
				setLoading(false);
			}
		};

		fetchStudent();
	}, [id]);

	if (loading) {
		return <div className="student-details-loading">Loading student...</div>;
	}

	if (error) {
		return <div className="student-details-error">{error}</div>;
	}

	if (!student) {
		return <div className="student-details-error">Student not found.</div>;
	}

	return (
		<div className="admin-student-details">
			{/* Back Button */}
			<button className="student-back-btn" onClick={() => navigate("/admin/students")}>
				← Back to Students
			</button>
			<button className="student-edit-btn" onClick={() => navigate(`/admin/students/${id}/edit`)}>
				Edit Student
			</button>

			{/* Header */}
			<div className="student-details-header">
				<div className="student-details-avatar">{student.name?.charAt(0)?.toUpperCase()}</div>

				<div>
					<span className="admin-badge">STUDENT PROFILE</span>

					<h2>{student.name}</h2>

					<p>{student.email}</p>
				</div>
			</div>

			{/* Profile Information */}
			<div className="student-details-card">
				<h3>Personal & Academic Information</h3>

				<div className="student-details-grid">
					<div className="student-detail-item">
						<span>Name</span>
						<strong>{student.name || "—"}</strong>
					</div>

					<div className="student-detail-item">
						<span>Email</span>
						<strong>{student.email || "—"}</strong>
					</div>

					<div className="student-detail-item">
						<span>College</span>
						<strong>{student.college || "—"}</strong>
					</div>

					<div className="student-detail-item">
						<span>Branch</span>
						<strong>{student.branch || "—"}</strong>
					</div>

					<div className="student-detail-item">
						<span>Graduation Year</span>
						<strong>{student.graduationYear || "—"}</strong>
					</div>

					<div className="student-detail-item">
						<span>Role</span>
						<strong>{student.role || "student"}</strong>
					</div>

					<div className="student-detail-item">
						<span>Joined</span>
						<strong>{student.createdAt ? new Date(student.createdAt).toLocaleDateString() : "—"}</strong>
					</div>

					<div className="student-detail-item">
						<span>Last Updated</span>
						<strong>{student.updatedAt ? new Date(student.updatedAt).toLocaleDateString() : "—"}</strong>
					</div>
				</div>
			</div>

			{/* Skills */}
			<div className="student-details-card">
				<h3>Skills</h3>

				{student.skills?.length > 0 ? (
					<div className="student-skills">
						{student.skills.map((skill, index) => (
							<span key={index} className="student-skill">
								{skill}
							</span>
						))}
					</div>
				) : (
					<p className="no-skills">No skills added yet.</p>
				)}
			</div>
		</div>
	);
}

export default AdminStudentDetails;
