import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import "./AdminCompanyDetails.css";

function AdminCompanyDetails() {
	const { id } = useParams();
	const navigate = useNavigate();

	const [company, setCompany] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchCompany = async () => {
			try {
				const response = await api.get(`/admin/companies/${id}`);

				setCompany(response.data.data);
			} catch (error) {
				console.error("Failed to load company:", error);

				setError("Failed to load company");
			} finally {
				setLoading(false);
			}
		};

		fetchCompany();
	}, [id]);

	if (loading) {
		return <div className="company-details-loading">Loading company...</div>;
	}

	if (error) {
		return <div className="company-details-error">{error}</div>;
	}

	if (!company) {
		return <div className="company-details-error">Company not found.</div>;
	}

	return (
		<div className="admin-company-details">
			{/* Actions */}
			<div className="company-details-actions">
				<button className="company-back-btn" onClick={() => navigate("/admin/companies")}>
					← Back to Companies
				</button>

				<button className="company-edit-btn" onClick={() => navigate(`/admin/companies/${id}/edit`)}>
					Edit Company
				</button>
			</div>

			{/* Header */}
			<div className="company-details-header">
				<div className="company-details-avatar">{company.name?.charAt(0)?.toUpperCase()}</div>

				<div>
					<span className="admin-badge">COMPANY PROFILE</span>

					<h2>{company.name}</h2>

					<p>{company.description}</p>
				</div>
			</div>

			{/* Basic Information */}
			<div className="company-details-card">
				<h3>Company Information</h3>

				<div className="company-details-grid">
					<div className="company-detail-item">
						<span>Company Name</span>

						<strong>{company.name || "—"}</strong>
					</div>

					<div className="company-detail-item">
						<span>Package</span>

						<strong>{company.package || "—"}</strong>
					</div>

					<div className="company-detail-item">
						<span>Difficulty</span>

						<strong>{company.difficulty || "—"}</strong>
					</div>

					<div className="company-detail-item">
						<span>Interview Rounds</span>

						<strong>{company.rounds?.length || 0}</strong>
					</div>
				</div>
			</div>

			{/* Description */}
			<div className="company-details-card">
				<h3>Description</h3>

				<p className="company-description-full">{company.description || "No description available."}</p>
			</div>

			{/* Eligibility */}
			<div className="company-details-card">
				<h3>Eligibility</h3>

				{company.eligibility?.length > 0 ? (
					<div className="company-tags">
						{company.eligibility.map((item, index) => (
							<span key={index} className="company-tag">
								{item}
							</span>
						))}
					</div>
				) : (
					<p className="company-empty">No eligibility criteria added.</p>
				)}
			</div>

			{/* Rounds */}
			<div className="company-details-card">
				<h3>Interview Rounds</h3>

				{company.rounds?.length > 0 ? (
					<div className="company-tags">
						{company.rounds.map((round, index) => (
							<span key={index} className="company-tag">
								{round}
							</span>
						))}
					</div>
				) : (
					<p className="company-empty">No interview rounds added.</p>
				)}
			</div>

			{/* Topics */}
			<div className="company-details-card">
				<h3>Topics</h3>

				{company.topics?.length > 0 ? (
					<div className="company-tags">
						{company.topics.map((topic, index) => (
							<span key={index} className="company-tag">
								{topic}
							</span>
						))}
					</div>
				) : (
					<p className="company-empty">No topics added.</p>
				)}
			</div>
		</div>
	);
}

export default AdminCompanyDetails;
