import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./AdminAssessments.css";

function AdminAssessments() {
	const navigate = useNavigate();

	const [assessments, setAssessments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [search, setSearch] = useState("");

	useEffect(() => {
		const fetchAssessments = async () => {
			try {
				const response = await api.get("/admin/assessments");

				console.log("ASSESSMENTS:", response.data);

				setAssessments(response.data.data || []);
			} catch (error) {
				console.error("Failed to load assessments:", error);

				setError(error.response?.data?.message || "Failed to load assessments");
			} finally {
				setLoading(false);
			}
		};

		fetchAssessments();
	}, []);

	/* ================================
       SEARCH
    ================================= */

	const filteredAssessments = assessments.filter((assessment) => {
		const searchText = search.toLowerCase();

		return (
			assessment.title?.toLowerCase().includes(searchText) ||
			assessment.description?.toLowerCase().includes(searchText) ||
			assessment.difficulty?.toLowerCase().includes(searchText) ||
			assessment.company?.name?.toLowerCase().includes(searchText)
		);
	});

	/* ================================
       DELETE
    ================================= */

	const handleDelete = async (id) => {
		const confirmed = window.confirm("Are you sure you want to delete this assessment?");

		if (!confirmed) {
			return;
		}

		try {
			const response = await api.delete(`/admin/assessments/${id}`);

			console.log("DELETE STATUS:", response.status);

			console.log("DELETE RESPONSE:", response.data);

			/* Remove deleted assessment
               immediately from UI */
			setAssessments((prev) => prev.filter((assessment) => assessment._id !== id));
		} catch (error) {
			console.error("Failed to delete assessment:", error);

			alert(error.response?.data?.message || "Failed to delete assessment");
		}
	};

	/* ================================
       LOADING
    ================================= */

	if (loading) {
		return (
			<div className="admin-assessments">
				<div className="assessments-loading">Loading assessments...</div>
			</div>
		);
	}

	return (
		<div className="admin-assessments">
			{/* ================================
                BACK BUTTON
            ================================= */}

			<button type="button" className="assessment-back-btn" onClick={() => navigate("/admin")}>
				← Back to Dashboard
			</button>

			{/* ================================
                HEADER
            ================================= */}

			<div className="admin-assessments-header">
				<div>
					<span className="admin-badge">ASSESSMENTS</span>

					<h2>Assessment Management</h2>

					<p>View and manage placement assessments.</p>
				</div>

				<div className="assessment-count">
					<strong>{assessments.length}</strong>

					<span>Total Assessments</span>
				</div>
			</div>

			{/* ================================
                CARD
            ================================= */}

			<div className="assessments-card">
				{/* Card Header */}

				<div className="assessments-card-header">
					<h3>Available Assessments</h3>

					<div className="assessments-header-actions">
						{/* Search */}

						<input type="text" placeholder="Search assessments..." className="assessment-search" value={search} onChange={(e) => setSearch(e.target.value)} />

						{/* Add */}

						<button type="button" className="assessment-add-btn" onClick={() => navigate("/admin/assessments/create")}>
							+ Add Assessment
						</button>
					</div>
				</div>

				{/* ================================
                    ERROR
                ================================= */}

				{error && <div className="assessments-error">{error}</div>}

				{/* ================================
                    TABLE
                ================================= */}

				{!error && (
					<div className="assessments-table-wrapper">
						<table className="assessments-table">
							<thead>
								<tr>
									<th>Assessment</th>

									<th>Company</th>

									<th>Duration</th>

									<th>Questions</th>

									<th>Marks</th>

									<th>Difficulty</th>

									<th>Actions</th>
								</tr>
							</thead>

							<tbody>
								{/* Empty */}

								{filteredAssessments.length === 0 ? (
									<tr>
										<td colSpan="7" className="empty-assessments">
											{search ? "No assessments match your search." : "No assessments found."}
										</td>
									</tr>
								) : (
									/* Assessment Rows */

									filteredAssessments.map((assessment) => (
										<tr key={assessment._id}>
											{/* Assessment */}

											<td>
												<div className="assessment-name-cell">
													<div className="assessment-avatar">{assessment.title?.charAt(0)?.toUpperCase()}</div>

													<div>
														<strong>{assessment.title}</strong>

														<small>{assessment.description}</small>
													</div>
												</div>
											</td>

											{/* Company */}

											<td>{assessment.company?.name || "General"}</td>

											{/* Duration */}

											<td>{assessment.duration} min</td>

											{/* Questions */}

											<td>{assessment.questions?.length || 0}</td>

											{/* Marks */}

											<td>{assessment.totalMarks}</td>

											{/* Difficulty */}

											<td>
												<span className={`assessment-difficulty ${assessment.difficulty?.toLowerCase()}`}>{assessment.difficulty}</span>
											</td>

											{/* Actions */}

											<td>
												<div className="assessment-actions">
													{/* View */}

													<button type="button" className="assessment-view-btn" onClick={() => navigate(`/admin/assessments/${assessment._id}`)}>
														View
													</button>

													{/* Edit */}

													<button
														type="button"
														className="assessment-edit-btn-small"
														onClick={() => navigate(`/admin/assessments/${assessment._id}/edit`)}
													>
														Edit
													</button>

													{/* Delete */}

													<button type="button" className="assessment-delete-btn" onClick={() => handleDelete(assessment._id)}>
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

export default AdminAssessments;
