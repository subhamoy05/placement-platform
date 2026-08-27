import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminRoute() {
	const { user, loading, isAuthenticated } = useAuth();

	if (loading) {
		return <div className="auth-loading">Checking authentication...</div>;
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	if (user?.role !== "admin") {
		return <Navigate to="/admin" replace />;
	}

	return <Outlet />;
}

export default AdminRoute;
