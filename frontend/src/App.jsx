import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import StudentLayout from "./layouts/StudentLayout";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import DSA from "./pages/DSA";
import SQL from "./pages/SQL";
import Assessments from "./pages/Assessments";
import Interview from "./pages/Interview";
import Companies from "./pages/Companies";
import Progress from "./pages/Progress";
import Profile from "./pages/Profile";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				{/* Public */}
				<Route path="/" element={<Home />} />

				{/* Student Layout */}
				<Route element={<StudentLayout />}>
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/dsa" element={<DSA />} />
					<Route path="/sql" element={<SQL />} />
					<Route path="/assessments" element={<Assessments />} />
					<Route path="/interview" element={<Interview />} />
					<Route path="/companies" element={<Companies />} />
					<Route path="/progress" element={<Progress />} />
					<Route path="/profile" element={<Profile />} />
				</Route>

				{/* Unknown route */}
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
