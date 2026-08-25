import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    college: "",
    branch: "",
    graduationYear: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password
    ) {
      setError("Name, email and password are required.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/register", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        college: formData.college.trim(),
        branch: formData.branch.trim(),
        graduationYear: formData.graduationYear
          ? Number(formData.graduationYear)
          : null,
      });

      const data = response.data;

      const token = data.data?.token || data.token;
      const user = data.data?.user || data.user;

      if (!token || !user) {
        throw new Error("Invalid registration response from server.");
      }

      login(user, token);

      navigate("/dashboard", {
        replace: true,
      });
    } catch (err) {
      console.error("Registration error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form
        className="login-card"
        onSubmit={handleSubmit}
      >
        <h1>Create Account</h1>

        <p>
          Join the placement preparation platform.
        </p>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <label>Full Name</label>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          autoComplete="name"
        />

        <label>Email</label>

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          autoComplete="email"
        />

        <label>Password</label>

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create a password"
          autoComplete="new-password"
        />

        <label>College</label>

        <input
          type="text"
          name="college"
          value={formData.college}
          onChange={handleChange}
          placeholder="Enter your college"
        />

        <label>Branch</label>

        <input
          type="text"
          name="branch"
          value={formData.branch}
          onChange={handleChange}
          placeholder="e.g. Computer Science"
        />

        <label>Graduation Year</label>

        <input
          type="number"
          name="graduationYear"
          value={formData.graduationYear}
          onChange={handleChange}
          placeholder="e.g. 2027"
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <div className="register-link">
          <span>Already have an account?</span>

          <button
            type="button"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;