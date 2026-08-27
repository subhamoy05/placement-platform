import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./AdminStudents.css";

function AdminStudents() {
	const navigate = useNavigate();

	const [students, setStudents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [search, setSearch] = useState("");

	useEffect(() => {
		const fetchStudents = async () => {
			try {
				const response = await api.get("/admin/students");

				setStudents(response.data.data);
			} catch (error) {
				console.error("Failed to load students:", error);

				setError("Failed to load students");
			} finally {
				setLoading(false);
			}
		};

		fetchStudents();
	}, []);

	// Filter students
	const filteredStudents = students.filter((student) => {
		const searchText = search.toLowerCase();

		return (
			student.name?.toLowerCase().includes(searchText) ||
			student.email?.toLowerCase().includes(searchText) ||
			student.college?.toLowerCase().includes(searchText) ||
			student.branch?.toLowerCase().includes(searchText)
		);
	});

	const handleDelete = async (studentId, studentName) => {
		const confirmed = window.confirm(`Are you sure you want to delete ${studentName}?`);

		if (!confirmed) {
			return;
		}

		try {
			await api.delete(`/admin/students/${studentId}`);

			setStudents((prevStudents) => prevStudents.filter((student) => student._id !== studentId));

			alert("Student deleted successfully.");
		} catch (error) {
			console.error("Failed to delete student:", error);

			alert(error.response?.data?.message || "Failed to delete student");
		}
	};

	return (
		<div className="admin-students">
			{/* Header */}
			<div className="admin-students-header">
				<div>
					<span className="admin-badge">STUDENTS</span>

					<h2>Student Management</h2>

					<p>View and manage all registered students.</p>
				</div>

				<div className="student-count">
					<strong>{students.length}</strong>

					<span>Total Students</span>
				</div>
			</div>

			{/* Students Card */}
			<div className="students-card">
				{/* Card Header */}
				<div className="students-card-header">
					<h3>Registered Students</h3>

					<input type="text" placeholder="Search students..." className="student-search" value={search} onChange={(e) => setSearch(e.target.value)} />
				</div>

				{/* Loading */}
				{loading && <div className="students-loading">Loading students...</div>}

				{/* Error */}
				{error && <div className="students-error">{error}</div>}

				{/* Table */}
				{!loading && !error && (
					<div className="students-table-wrapper">
						<table className="students-table">
							<thead>
								<tr>
									<th>Student</th>
									<th>Email</th>
									<th>College</th>
									<th>Branch</th>
									<th>Graduation</th>
									<th>Joined</th>
									<th>Actions</th>
								</tr>
							</thead>

							<tbody>
								{filteredStudents.length === 0 ? (
									<tr>
										<td colSpan="7" className="empty-students">
											No students found.
										</td>
									</tr>
								) : (
									filteredStudents.map((student) => (
										<tr key={student._id}>
											{/* Student */}
											<td>
												<div className="student-name-cell">
													<div className="student-avatar">{student.name?.charAt(0)?.toUpperCase()}</div>

													<strong>{student.name}</strong>
												</div>
											</td>

											{/* Email */}
											<td>{student.email}</td>

											{/* College */}
											<td>{student.college || "—"}</td>

											{/* Branch */}
											<td>{student.branch || "—"}</td>

											{/* Graduation */}
											<td>{student.graduationYear || "—"}</td>

											{/* Joined */}
											<td>{student.createdAt ? new Date(student.createdAt).toLocaleDateString() : "—"}</td>

											{/* Actions */}
											<td>
												<div className="student-action-buttons">
													<button className="student-view-btn" onClick={() => navigate(`/admin/students/${student._id}`)}>
														View
													</button>

													<button className="student-delete-btn" onClick={() => handleDelete(student._id, student.name)}>
														Delete
													</button>
												</div>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
}

export default AdminStudents;
