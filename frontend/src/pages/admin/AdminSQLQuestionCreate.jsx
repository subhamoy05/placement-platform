import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./AdminSQLQuestionCreate.css";

function AdminSQLQuestionCreate() {
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		title: "",
		description: "",
		difficulty: "Easy",
		category: "SELECT",
		schema: "",
		sampleData: "",
		expectedQueryResult: "",
		companyTags: "",
	});

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleChange = (e) => {
		const { name, value } = e.target;

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		setError("");

		if (!formData.title.trim() || !formData.description.trim() || !formData.schema.trim() || !formData.sampleData.trim() || !formData.expectedQueryResult.trim()) {
			setError("Please fill in all required fields.");
			return;
		}

		try {
			setLoading(true);

			const payload = {
				title: formData.title.trim(),
				description: formData.description.trim(),
				difficulty: formData.difficulty,
				category: formData.category,
				schema: formData.schema.trim(),
				sampleData: formData.sampleData.trim(),
				expectedQueryResult: formData.expectedQueryResult.trim(),
				companyTags: formData.companyTags
					.split(",")
					.map((tag) => tag.trim())
					.filter(Boolean),
			};

			const response = await api.post("/admin/sql-questions", payload);

			console.log("CREATE SQL QUESTION STATUS:", response.status);

			console.log("CREATE SQL QUESTION RESPONSE:", response.data);

			navigate("/admin/sql-questions");
		} catch (error) {
			console.error("Failed to create SQL question:", error);

			setError(error.response?.data?.message || "Failed to create SQL question");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="admin-sql-create">
			{/* BACK */}

			<button type="button" className="sql-create-back" onClick={() => navigate("/admin/sql-questions")}>
				← Back to SQL Questions
			</button>

			{/* HEADER */}

			<div className="sql-create-header">
				<span className="admin-badge">SQL QUESTIONS</span>

				<h2>Add SQL Question</h2>

				<p>Create a new SQL practice question for students.</p>
			</div>

			{/* FORM CARD */}

			<div className="sql-create-card">
				<form onSubmit={handleSubmit} className="sql-create-form">
					{/* BASIC INFORMATION */}

					<div className="sql-form-section">
						<h3>Basic Information</h3>

						<div className="sql-form-grid">
							{/* TITLE */}

							<div className="sql-form-group sql-full-width">
								<label>
									Question Title
									<span>*</span>
								</label>

								<input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Find employees with salary greater than 50000" />
							</div>

							{/* DESCRIPTION */}

							<div className="sql-form-group sql-full-width">
								<label>
									Description
									<span>*</span>
								</label>

								<textarea
									name="description"
									value={formData.description}
									onChange={handleChange}
									placeholder="Describe what the student needs to find..."
									rows="5"
								/>
							</div>

							{/* DIFFICULTY */}

							<div className="sql-form-group">
								<label>
									Difficulty
									<span>*</span>
								</label>

								<select name="difficulty" value={formData.difficulty} onChange={handleChange}>
									<option value="Easy">Easy</option>

									<option value="Medium">Medium</option>

									<option value="Hard">Hard</option>
								</select>
							</div>

							{/* CATEGORY */}

							<div className="sql-form-group">
								<label>
									Category
									<span>*</span>
								</label>

								<select name="category" value={formData.category} onChange={handleChange}>
									<option value="SELECT">SELECT</option>

									<option value="WHERE">WHERE</option>

									<option value="GROUP BY">GROUP BY</option>

									<option value="HAVING">HAVING</option>

									<option value="ORDER BY">ORDER BY</option>

									<option value="JOIN">JOIN</option>

									<option value="Subquery">Subquery</option>

									<option value="Aggregate Functions">Aggregate Functions</option>

									<option value="Window Functions">Window Functions</option>
								</select>
							</div>
						</div>
					</div>

					{/* DATABASE INFORMATION */}

					<div className="sql-form-section">
						<h3>Database Information</h3>

						<div className="sql-form-grid">
							{/* SCHEMA */}

							<div className="sql-form-group sql-full-width">
								<label>
									Database Schema
									<span>*</span>
								</label>

								<textarea
									name="schema"
									value={formData.schema}
									onChange={handleChange}
									placeholder={`CREATE TABLE employees (
    id INT,
    name VARCHAR(100),
    salary INT
);`}
									rows="9"
									className="sql-code-input"
								/>

								<small>Enter the table definitions students will use.</small>
							</div>

							{/* SAMPLE DATA */}

							<div className="sql-form-group sql-full-width">
								<label>
									Sample Data
									<span>*</span>
								</label>

								<textarea
									name="sampleData"
									value={formData.sampleData}
									onChange={handleChange}
									placeholder={`INSERT INTO employees (id, name, salary)
VALUES
(1, 'John', 60000),
(2, 'Alice', 45000),
(3, 'Bob', 70000);`}
									rows="9"
									className="sql-code-input"
								/>

								<small>Provide sample records for the SQL problem.</small>
							</div>

							{/* EXPECTED RESULT */}

							<div className="sql-form-group sql-full-width">
								<label>
									Expected Query Result
									<span>*</span>
								</label>

								<textarea
									name="expectedQueryResult"
									value={formData.expectedQueryResult}
									onChange={handleChange}
									placeholder={`John | 60000
Bob | 70000`}
									rows="7"
									className="sql-code-input"
								/>

								<small>Enter the expected output of the correct query.</small>
							</div>
						</div>
					</div>

					{/* COMPANY TAGS */}

					<div className="sql-form-section">
						<h3>Company Tags</h3>

						<div className="sql-form-group">
							<label>Companies</label>

							<input type="text" name="companyTags" value={formData.companyTags} onChange={handleChange} placeholder="TCS, Infosys, Accenture" />

							<small>Separate multiple companies with commas.</small>
						</div>
					</div>

					{/* ERROR */}

					{error && <div className="sql-create-error">{error}</div>}

					{/* ACTIONS */}

					<div className="sql-create-footer">
						<button type="button" className="sql-cancel-btn" onClick={() => navigate("/admin/sql-questions")} disabled={loading}>
							Cancel
						</button>

						<button type="submit" className="sql-save-btn" disabled={loading}>
							{loading ? "Creating..." : "Create SQL Question"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default AdminSQLQuestionCreate;
