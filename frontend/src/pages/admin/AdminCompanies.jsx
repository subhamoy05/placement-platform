import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./AdminCompanies.css";

function AdminCompanies() {
	const navigate = useNavigate();

	const [companies, setCompanies] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [search, setSearch] = useState("");

	useEffect(() => {
		const fetchCompanies = async () => {
			try {
				const response = await api.get("/admin/companies");

				setCompanies(response.data.data);
			} catch (error) {
				console.error("Failed to load companies:", error);

				setError("Failed to load companies");
			} finally {
				setLoading(false);
			}
		};

		fetchCompanies();
	}, []);

	// Filter companies
	const filteredCompanies = companies.filter((company) => {
		const searchText = search.toLowerCase();

		return (
			company.name?.toLowerCase().includes(searchText) ||
			company.description?.toLowerCase().includes(searchText) ||
			company.difficulty?.toLowerCase().includes(searchText) ||
			company.package?.toLowerCase().includes(searchText)
		);
	});

	const handleDelete = async (companyId, companyName) => {
		const confirmed = window.confirm(`Are you sure you want to delete ${companyName}?`);

		if (!confirmed) {
			return;
		}

		try {
			await api.delete(`/admin/companies/${companyId}`);

			setCompanies((prevCompanies) => prevCompanies.filter((company) => company._id !== companyId));

			alert("Company deleted successfully.");
		} catch (error) {
			console.error("Failed to delete company:", error);

			alert(error.response?.data?.message || "Failed to delete company");
		}
	};

	return (
		<div className="admin-companies">
			{/* ================================
                HEADER
            ================================= */}

			<div className="admin-companies-header">
				<div>
					<span className="admin-badge">COMPANIES</span>

					<h2>Company Management</h2>

					<p>View and manage placement companies.</p>
				</div>

				<div className="company-count">
					<strong>{companies.length}</strong>

					<span>Total Companies</span>
				</div>
			</div>

			{/* ================================
                COMPANIES CARD
            ================================= */}

			<div className="companies-card">
				{/* Card Header */}

				<div className="companies-card-header">
					<h3>Placement Companies</h3>

					<div className="companies-header-actions">
						{/* Search */}

						<input type="text" placeholder="Search companies..." className="company-search" value={search} onChange={(e) => setSearch(e.target.value)} />

						{/* Add Company */}

						<button className="company-add-btn" onClick={() => navigate("/admin/companies/create")}>
							+ Add Company
						</button>
					</div>
				</div>

				{/* ================================
                    LOADING
                ================================= */}

				{loading && <div className="companies-loading">Loading companies...</div>}

				{/* ================================
                    ERROR
                ================================= */}

				{error && <div className="companies-error">{error}</div>}

				{/* ================================
                    TABLE
                ================================= */}

				{!loading && !error && (
					<div className="companies-table-wrapper">
						<table className="companies-table">
							<thead>
								<tr>
									<th>Company</th>
									<th>Description</th>
									<th>Package</th>
									<th>Difficulty</th>
									<th>Rounds</th>
									<th>Actions</th>
								</tr>
							</thead>

							<tbody>
								{filteredCompanies.length === 0 ? (
									<tr>
										<td colSpan="6" className="empty-companies">
											No companies found.
										</td>
									</tr>
								) : (
									filteredCompanies.map((company) => (
										<tr key={company._id}>
											{/* Company */}

											<td>
												<div className="company-name-cell">
													<div className="company-avatar">{company.name?.charAt(0)?.toUpperCase()}</div>

													<strong>{company.name}</strong>
												</div>
											</td>

											{/* Description */}

											<td>
												<div className="company-description">{company.description || "—"}</div>
											</td>

											{/* Package */}

											<td>{company.package || "—"}</td>

											{/* Difficulty */}

											<td>
												<span className={`company-difficulty ${company.difficulty?.toLowerCase() || ""}`}>{company.difficulty || "—"}</span>
											</td>

											{/* Rounds */}

											<td>{company.rounds?.length || 0}</td>

											{/* Actions */}

											<td>
												<div className="company-action-buttons">
													<button className="company-view-btn" onClick={() => navigate(`/admin/companies/${company._id}`)}>
														View
													</button>

													<button className="company-delete-btn" onClick={() => handleDelete(company._id, company.name)}>
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

export default AdminCompanies;
