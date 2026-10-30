import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  DashboardIcon,
  CodeIcon,
  DatabaseIcon,
  AssessmentIcon,
  InterviewIcon,
  CompanyIcon,
  ProgressIcon,
  ProfileIcon,
  LogoutIcon,
  SparklesIcon,
  ZapIcon
} from "../components/Icons";

function StudentLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <DashboardIcon size={18} /> },
    { name: "DSA Practice", path: "/dsa", icon: <CodeIcon size={18} /> },
    { name: "SQL Practice", path: "/sql", icon: <DatabaseIcon size={18} /> },
    { name: "Assessments", path: "/assessments", icon: <AssessmentIcon size={18} /> },
    { name: "Mock Interview", path: "/interview", icon: <InterviewIcon size={18} /> },
    { name: "Companies", path: "/companies", icon: <CompanyIcon size={18} /> },
    { name: "Progress", path: "/progress", icon: <ProgressIcon size={18} /> },
    { name: "Profile", path: "/profile", icon: <ProfileIcon size={18} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="student-layout">
      <div className="student-ambient-glow student-glow-1"></div>
      <div className="student-ambient-glow student-glow-2"></div>

      <aside className="sidebar">
        <div className="sidebar-brand-container">
          <div className="sidebar-brand-badge">
            <ZapIcon size={20} color="#030407" />
          </div>
          <div>
            <h2 className="sidebar-title">
              Placement<span className="brand-highlight">Prep</span>
            </h2>
            <div className="sidebar-tag">STUDENT PORTAL</div>
          </div>
        </div>

        <div className="sidebar-section-label">CORE MODULES</div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              <span className="sidebar-link-text">{item.name}</span>
              <span className="sidebar-link-indicator"></span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          {user && (
            <div className="sidebar-user-card">
              <div className="sidebar-user-avatar">
                {(user.name || "S").charAt(0).toUpperCase()}
                <span className="user-online-dot"></span>
              </div>
              <div className="sidebar-user-info">
                <strong>{user.name || "Student"}</strong>
                <span>{user.email || "student@prep.io"}</span>
              </div>
            </div>
          )}

          <button
            className="sidebar-logout-button"
            onClick={handleLogout}
            title="Sign out"
          >
            <LogoutIcon size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="student-topbar">
          <div className="topbar-left">
            <div className="pro-badge">
              <SparklesIcon size={14} color="#D4FF24" />
              <span>PRO CANDIDATE SUITE</span>
            </div>
          </div>
          <div className="topbar-right">
            <div className="topbar-status-chip">
              <span className="pulse-ping"></span>
              <span>All Systems Active</span>
            </div>
          </div>
        </header>

        <div className="page-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default StudentLayout;
