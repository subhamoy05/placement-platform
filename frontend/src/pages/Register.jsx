import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { SparklesIcon, ArrowRightIcon, EyeIcon, EyeOffIcon } from "../components/Icons";

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

  const [showPassword, setShowPassword] = useState(false);
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
        style={{ maxWidth: "520px" }}
      >
        <div className="login-header">
          <div className="login-badge">
            <SparklesIcon size={13} color="#D4FF24" />
            <span>JOIN PLACEMENT PREP</span>
          </div>
          <h1>Create Account</h1>
          <p>
            Start your targeted technical interview preparation today.
          </p>
        </div>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="reg-name">Full Name</label>
          <input
            id="reg-name"
            className="login-input"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Alex Johnson"
            autoComplete="name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="reg-email">Email Address</label>
          <input
            id="reg-email"
            className="login-input"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="alex@college.edu"
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="reg-password">Password (min. 6 characters)</label>
          <div className="password-input-wrapper">
            <input
              id="reg-password"
              className="login-input"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••••••"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOffIcon size={19} /> : <EyeIcon size={19} />}
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div className="form-group">
            <label htmlFor="reg-college">College / University</label>
            <input
              id="reg-college"
              className="login-input"
              type="text"
              name="college"
              value={formData.college}
              onChange={handleChange}
              placeholder="e.g. IIT Delhi"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-branch">Branch / Major</label>
            <input
              id="reg-branch"
              className="login-input"
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              placeholder="e.g. CSE / IT"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="reg-year">Graduation Year</label>
          <input
            id="reg-year"
            className="login-input"
            type="number"
            name="graduationYear"
            value={formData.graduationYear}
            onChange={handleChange}
            placeholder="e.g. 2027"
          />
        </div>

        <button
          type="submit"
          className="login-submit-button"
          disabled={loading}
        >
          <span>{loading ? "Creating Account..." : "Join Platform"}</span>
          <ArrowRightIcon size={16} />
        </button>

        <div className="login-footer">
          <span>Already have an account?</span>
          <button
            type="button"
            className="auth-link"
            style={{ background: "none", border: "none", cursor: "pointer", font: "inherit" }}
            onClick={() => navigate("/login")}
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
