import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function StudentLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "DSA Practice", path: "/dsa" },
    { name: "SQL Practice", path: "/sql" },
    { name: "Assessments", path: "/assessments" },
    { name: "Mock Interview", path: "/interview" },
    { name: "Companies", path: "/companies" },
    { name: "Progress", path: "/progress" },
    { name: "Profile", path: "/profile" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="student-layout">
      <aside className="sidebar">
        <h2 className="sidebar-title">
          Placement Platform
        </h2>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className="sidebar-link"
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          {user && (
            <div className="sidebar-user">
              <strong>
                {user.name || "Student"}
              </strong>

              <span>
                {user.email || ""}
              </span>
            </div>
          )}

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="page-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default StudentLayout;