import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import "./AdminAssessmentDetails.css";

function AdminAssessmentDetails() {
	const { id } = useParams();
	const navigate = useNavigate();

	const [assessment, setAssessment] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchAssessment = async () => {
			try {
				const response = await api.get(`/admin/assessments/${id}`);

				setAssessment(response.data.data);
			} catch (error) {
				console.error("Failed to load assessment:", error);

				setError("Failed to load assessment");
			} finally {
				setLoading(false);
			}
		};

		fetchAssessment();
	}, [id]);

	if (loading) {
		return <div className="assessment-details-loading">Loading assessment...</div>;
	}

	if (error) {
		return <div className="assessment-details-error">{error}</div>;
	}

	if (!assessment) {
		return <div className="assessment-details-error">Assessment not found.</div>;
	}

	return (
		<div className="admin-assessment-details">
			{/* Actions */}
			<div className="assessment-details-actions">
				<button className="assessment-back-btn" onClick={() => navigate("/admin/assessments")}>
					← Back to Assessments
				</button>

				<button className="assessment-edit-btn" onClick={() => navigate(`/admin/assessments/${id}/edit`)}>
					Edit Assessment
				</button>
			</div>

			{/* Header */}
			<div className="assessment-details-header">
				<div className="assessment-details-avatar">{assessment.title?.charAt(0)?.toUpperCase()}</div>

				<div>
					<span className="admin-badge">ASSESSMENT</span>

					<h2>{assessment.title}</h2>

					<p>{assessment.description}</p>
				</div>
			</div>

			{/* Basic Information */}
			<div className="assessment-details-card">
				<h3>Assessment Information</h3>

				<div className="assessment-details-grid">
					<div className="assessment-detail-item">
						<span>Company</span>

						<strong>{assessment.company?.name || "General"}</strong>
					</div>

					<div className="assessment-detail-item">
						<span>Duration</span>

						<strong>{assessment.duration} minutes</strong>
					</div>

					<div className="assessment-detail-item">
						<span>Total Questions</span>

						<strong>{assessment.questions?.length || 0}</strong>
					</div>

					<div className="assessment-detail-item">
						<span>Total Marks</span>

						<strong>{assessment.totalMarks}</strong>
					</div>
				</div>
			</div>

			{/* Description */}
			<div className="assessment-details-card">
				<h3>Description</h3>

				<p className="assessment-description-full">{assessment.description || "No description available."}</p>
			</div>

			{/* Difficulty */}
			<div className="assessment-details-card">
				<h3>Difficulty</h3>

				<span className={`assessment-detail-difficulty ${assessment.difficulty?.toLowerCase()}`}>{assessment.difficulty}</span>
			</div>

			{/* Questions */}
			<div className="assessment-details-card">
				<div className="assessment-questions-header">
					<h3>Questions</h3>

					<span>{assessment.questions?.length || 0} Questions</span>
				</div>

				{assessment.questions?.length > 0 ? (
					<div className="assessment-question-list">
						{assessment.questions.map((question, index) => (
							<div className="assessment-question-item" key={question._id || index}>
								<div className="question-number">{index + 1}</div>

								<div className="question-info">
									<strong>{question.title || `Question ${index + 1}`}</strong>

									{question.difficulty && <small>{question.difficulty}</small>}
								</div>
							</div>
						))}
					</div>
				) : (
					<p className="assessment-empty">No questions assigned.</p>
				)}
			</div>
		</div>
	);
}

export default AdminAssessmentDetails;
