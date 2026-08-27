import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import "./AdminStudentEdit.css";

function AdminStudentEdit() {
	const { id } = useParams();
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		college: "",
		branch: "",
		graduationYear: "",
		skills: "",
	});

	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	useEffect(() => {
		const fetchStudent = async () => {
			try {
				const response = await api.get(`/admin/students/${id}`);

				const student = response.data.data;

				setFormData({
					name: student.name || "",
					email: student.email || "",
					college: student.college || "",
					branch: student.branch || "",
					graduationYear: student.graduationYear || "",
					skills: student.skills?.join(", ") || "",
				});
			} catch (error) {
				console.error("Failed to load student:", error);

				setError("Failed to load student");
			} finally {
				setLoading(false);
			}
		};

		fetchStudent();
	}, [id]);

	const handleChange = (e) => {
		const { name, value } = e.target;

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		setSaving(true);
		setError("");
		setSuccess("");

		try {
			const updatedData = {
				...formData,
				graduationYear: formData.graduationYear === "" ? "" : Number(formData.graduationYear),

				skills: formData.skills
					.split(",")
					.map((skill) => skill.trim())
					.filter(Boolean),
			};

			await api.put(`/admin/students/${id}`, updatedData);

			setSuccess("Student updated successfully.");

			setTimeout(() => {
				navigate(`/admin/students/${id}`);
			}, 800);
		} catch (error) {
			console.error("Failed to update student:", error);

			setError(error.response?.data?.message || "Failed to update student");
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return <div className="student-edit-loading">Loading student...</div>;
	}

	return (
		<div className="admin-student-edit">
			<button className="student-back-btn" onClick={() => navigate(`/admin/students/${id}`)}>
				← Back to Student
			</button>

			<div className="student-edit-header">
				<span className="admin-badge">EDIT STUDENT</span>

				<h2>Edit Student Profile</h2>

				<p>Update the student's academic and profile information.</p>
			</div>

			<div className="student-edit-card">
				{error && <div className="student-edit-error">{error}</div>}

				{success && <div className="student-edit-success">{success}</div>}

				<form onSubmit={handleSubmit}>
					<div className="student-edit-grid">
						<div className="form-group">
							<label>Name</label>

							<input type="text" name="name" value={formData.name} onChange={handleChange} required />
						</div>

						<div className="form-group">
							<label>Email</label>

							<input type="email" name="email" value={formData.email} onChange={handleChange} required />
						</div>

						<div className="form-group">
							<label>College</label>

							<input type="text" name="college" value={formData.college} onChange={handleChange} />
						</div>

						<div className="form-group">
							<label>Branch</label>

							<input type="text" name="branch" value={formData.branch} onChange={handleChange} />
						</div>

						<div className="form-group">
							<label>Graduation Year</label>

							<input type="number" name="graduationYear" value={formData.graduationYear} onChange={handleChange} />
						</div>

						<div className="form-group full-width">
							<label>Skills</label>

							<input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="Python, Java, SQL" />

							<small>Separate skills with commas.</small>
						</div>
					</div>

					<div className="student-edit-actions">
						<button type="button" className="student-cancel-btn" onClick={() => navigate(`/admin/students/${id}`)}>
							Cancel
						</button>

						<button type="submit" className="student-save-btn" disabled={saving}>
							{saving ? "Saving..." : "Save Changes"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default AdminStudentEdit;
