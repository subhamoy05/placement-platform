import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  DashboardIcon,
  StudentsIcon,
  CompanyIcon,
  AssessmentIcon,
  CodeIcon,
  DatabaseIcon,
  InterviewIcon,
  LogoutIcon,
  ShieldIcon,
  SparklesIcon
} from "../components/Icons";
import "./AdminLayout.css";

function AdminLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <DashboardIcon size={18} />,
    },
    {
      name: "Students",
      path: "/admin/students",
      icon: <StudentsIcon size={18} />,
    },
    {
      name: "Companies",
      path: "/admin/companies",
      icon: <CompanyIcon size={18} />,
    },
    {
      name: "Assessments",
      path: "/admin/assessments",
      icon: <AssessmentIcon size={18} />,
    },
    {
      name: "DSA Questions",
      path: "/admin/questions",
      icon: <CodeIcon size={18} />,
    },
    {
      name: "SQL Questions",
      path: "/admin/sql-questions",
      icon: <DatabaseIcon size={18} />,
    },
    {
      name: "Mock Interviews",
      path: "/admin/mock-interviews",
      icon: <InterviewIcon size={18} />,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="admin-layout">
      {/* Background Ambient Glows */}
      <div className="admin-ambient-glow admin-glow-1"></div>
      <div className="admin-ambient-glow admin-glow-2"></div>

      {/* ================= SIDEBAR ================= */}
      <aside className="admin-sidebar">
        {/* Brand */}
        <div className="admin-brand">
          <div className="admin-brand-icon">
            <ShieldIcon size={20} color="#030407" />
          </div>

          <div>
            <strong>Placement</strong>
            <span>Admin Control</span>
          </div>
        </div>

        {/* Navigation Title */}
        <div className="admin-nav-title">MANAGEMENT SUITE</div>

        {/* Navigation */}
        <nav className="admin-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `admin-nav-link ${isActive ? "active" : ""}`
              }
            >
              <span className="admin-nav-link-icon">{item.icon}</span>
              <span className="admin-nav-link-label">{item.name}</span>
              <span className="admin-nav-indicator"></span>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="admin-sidebar-footer">
          <div className="admin-user-card">
            <div className="admin-avatar">
              {(user?.name || "A").charAt(0).toUpperCase()}
              <span className="admin-online-badge"></span>
            </div>

            <div className="admin-user-details">
              <strong>{user?.name || "Administrator"}</strong>
              <span>{user?.email || "admin@prep.io"}</span>
            </div>
          </div>

          <button
            className="admin-logout-button"
            onClick={handleLogout}
            title="Sign out of Admin Portal"
          >
            <LogoutIcon size={17} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="admin-main">
        {/* Top Header */}
        <header className="admin-topbar">
          <div className="admin-topbar-badge">
            <SparklesIcon size={14} color="#D4FF24" />
            <span>ELEVATED PRIVILEGES</span>
          </div>

          <div className="admin-system-health">
            <span className="pulse-dot-green"></span>
            <span>Cluster Status: Healthy</span>
          </div>
        </header>

        <div className="admin-content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
