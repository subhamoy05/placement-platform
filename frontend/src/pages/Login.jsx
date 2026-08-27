import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {
	const navigate = useNavigate();
	const { login } = useAuth();

	const [loginType, setLoginType] = useState("student");

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

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
				<h1>Welcome Back</h1>

				<p>Login to continue your placement preparation.</p>

				{/* Login Type */}
				<div className="login-type">
					<span className="login-type-label">Login as</span>

					<div className="login-type-options">
						<button
							type="button"
							className={loginType === "student" ? "login-type-button active" : "login-type-button"}
							onClick={() => {
								setLoginType("student");
								setError("");
							}}
						>
							<span>🎓</span>
							Student
						</button>

						<button
							type="button"
							className={loginType === "admin" ? "login-type-button active" : "login-type-button"}
							onClick={() => {
								setLoginType("admin");
								setError("");
							}}
						>
							<span>🛡️</span>
							Admin
						</button>
					</div>
				</div>

				{error && <div className="login-error">{error}</div>}

				<label>Email</label>

				<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Enter your email" autoComplete="email" />

				<label>Password</label>

				<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" autoComplete="current-password" />

				<button type="submit" disabled={loading}>
					{loading ? "Logging in..." : `Login as ${loginType === "admin" ? "Admin" : "Student"}`}
				</button>

				{/* Registration */}
				<div className="register-link">
					<span>Don't have an account?</span>

					<button type="button" onClick={() => navigate("/register")}>
						Create Account
					</button>
				</div>
			</form>
		</div>
	);
}

export default Login;
