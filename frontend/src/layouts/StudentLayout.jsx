import { NavLink, Outlet } from "react-router-dom";

function StudentLayout() {
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

	return (
		<div className="student-layout">
			<aside className="sidebar">
				<h2 className="sidebar-title">Placement Platform</h2>

				<nav className="sidebar-nav">
					{navItems.map((item) => (
						<NavLink key={item.path} to={item.path} className="sidebar-link">
							{item.name}
						</NavLink>
					))}
				</nav>
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
