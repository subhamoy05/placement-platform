import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AdminLayout.css";

function AdminLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: "⌂",
    },
    {
      name: "Students",
      path: "/admin/students",
      icon: "♙",
    },
    {
      name: "Companies",
      path: "/admin/companies",
      icon: "▣",
    },
    {
      name: "Assessments",
      path: "/admin/assessments",
      icon: "✓",
    },
    {
      name: "Questions",
      path: "/admin/questions",
      icon: "⌘",
    },
  ];

  const handleLogout = () => {
    logout();

    navigate("/", {
      replace: true,
    });
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-icon">
            P
          </div>

          <div>
            <strong>Placement</strong>
            <span>Admin Portal</span>
          </div>
        </div>

        <div className="admin-nav-title">
          MANAGEMENT
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `admin-nav-link ${
                  isActive ? "active" : ""
                }`
              }
            >
              <span className="admin-nav-icon">
                {item.icon}
              </span>

              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="admin-user">
            <div className="admin-avatar">
              {user?.name?.charAt(0)?.toUpperCase() ||
                "A"}
            </div>

            <div className="admin-user-info">
              <strong>
                {user?.name || "Administrator"}
              </strong>

              <span>
                {user?.email || ""}
              </span>
            </div>
          </div>

          <button
            className="admin-logout"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <div>
            <span className="admin-topbar-label">
              ADMINISTRATION
            </span>

            <h1>
              {user?.name
                ? `Welcome, ${user.name}`
                : "Admin Dashboard"}
            </h1>
          </div>

          <div className="admin-status">
            <span className="admin-status-dot"></span>
            System Online
          </div>
        </div>

        <div className="admin-page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;