import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { StudentsIcon, ShieldIcon, SparklesIcon, ArrowRightIcon, EyeIcon, EyeOffIcon } from "../components/Icons";

function Login() {
	const navigate = useNavigate();
	const { login } = useAuth();

	const [loginType, setLoginType] = useState("student");

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (event) => {
		event.preventDefault();
		setError("");

		if (!email.trim() || !password) {
			setError("Email and password are required.");
			return;
		}

		setLoading(true);

		try {
			const response = await api.post("/auth/login", {
				email: email.trim(),
				password,
			});

			const data = response.data;

			const token = data.data?.token || data.token;
			const user = data.data?.user || data.user;

			if (!token || !user) {
				throw new Error("Invalid login response from server.");
			}

			/*
			 * Security check:
			 * The selected login type must match
			 * the role stored in the database.
			 */
			if (loginType === "admin" && user.role !== "admin") {
				setError("This account does not have administrator access.");
				return;
			}

			if (loginType === "student" && user.role !== "student") {
				setError("Please use the Admin login option for this account.");
				return;
			}

			login(user, token);

			if (user.role === "admin") {
				navigate("/admin", {
					replace: true,
				});
			} else {
				navigate("/dashboard", {
					replace: true,
				});
			}
		} catch (err) {
			console.error("Login error:", err);

			setError(err.response?.data?.message || err.message || "Login failed.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="login-page">
			<form className="login-card" onSubmit={handleSubmit}>
				<div className="login-header">
					<div className="login-badge">
						<SparklesIcon size={13} color="#D4FF24" />
						<span>SECURE ACCESS</span>
					</div>
					<h1>Welcome Back</h1>
					<p>Sign in to continue your placement preparation journey.</p>
				</div>

				{/* Login Type Tabs */}
				<div className="role-tabs">
					<button
						type="button"
						className={`role-tab-button ${loginType === "student" ? "active" : ""}`}
						onClick={() => {
							setLoginType("student");
							setError("");
						}}
					>
						<span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
							<StudentsIcon size={16} />
							Student
						</span>
					</button>

					<button
						type="button"
						className={`role-tab-button ${loginType === "admin" ? "active" : ""}`}
						onClick={() => {
							setLoginType("admin");
							setError("");
						}}
					>
						<span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
							<ShieldIcon size={16} />
							Admin
						</span>
					</button>
				</div>

				{error && <div className="login-error">{error}</div>}

				<div className="form-group">
					<label htmlFor="login-email">Email Address</label>
					<input
						id="login-email"
						className="login-input"
						type="email"
						value={email}
						onChange={(event) => setEmail(event.target.value)}
						placeholder="name@placement.edu"
						autoComplete="email"
					/>
				</div>

				<div className="form-group">
					<label htmlFor="login-password">Password</label>
					<div className="password-input-wrapper">
						<input
							id="login-password"
							className="login-input"
							type={showPassword ? "text" : "password"}
							value={password}
							onChange={(event) => setPassword(event.target.value)}
							placeholder="••••••••••••"
							autoComplete="current-password"
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

				<button type="submit" className="login-submit-button" disabled={loading}>
					<span>{loading ? "Authenticating..." : `Sign In as ${loginType === "admin" ? "Admin" : "Student"}`}</span>
					<ArrowRightIcon size={16} />
				</button>

				{/* Registration Link */}
				<div className="login-footer">
					<span>Don't have an account yet?</span>
					<button
						type="button"
						className="auth-link"
						style={{ background: "none", border: "none", cursor: "pointer", font: "inherit" }}
						onClick={() => navigate("/register")}
					>
						Create Account
					</button>
				</div>
			</form>
		</div>
	);
}

export default Login;
