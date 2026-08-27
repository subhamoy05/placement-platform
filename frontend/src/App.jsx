import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./App.css";
import "./Auth.css";

import StudentLayout from "./layouts/StudentLayout";
import AdminLayout from "./layouts/AdminLayout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

import StudentDashboard from "./pages/StudentDashboard";
import DSA from "./pages/DSA";
import SQL from "./pages/SQL";
import Assessments from "./pages/Assessments";
import Interview from "./pages/Interview";
import Companies from "./pages/Companies";
import Progress from "./pages/Progress";
import Profile from "./pages/Profile";

import DSAQuestion from "./pages/DSAQuestion";
import SQLQuestion from "./pages/SQLQuestion";
import AssessmentTest from "./pages/AssessmentTest";
import AssessmentResult from "./pages/AssessmentResult";
import CompanyDetail from "./pages/CompanyDetail";

import AdminDashboard from "./pages/admin/AdminDashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AdminStudents from "./pages/admin/AdminStudents";

import AdminStudentDetails from "./pages/admin/AdminStudentDetails";

import AdminStudentEdit from "./pages/admin/AdminStudentEdit";

import AdminCompanies from "./pages/admin/AdminCompanies";

import AdminCompanyDetails from "./pages/admin/AdminCompanyDetails";

import AdminCompanyCreate from "./pages/admin/AdminCompanyCreate";

import AdminCompanyEdit from "./pages/admin/AdminCompanyEdit";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				{/* =================================================
            PUBLIC ROUTES
        ================================================= */}

				<Route path="/" element={<Home />} />

				<Route path="/login" element={<Login />} />

				<Route path="/register" element={<Register />} />

				{/* =================================================
            STUDENT ROUTES
        ================================================= */}

				<Route element={<ProtectedRoute />}>
					<Route element={<StudentLayout />}>
						<Route path="/dashboard" element={<StudentDashboard />} />

						<Route path="/dsa" element={<DSA />} />

						<Route path="/dsa/:id" element={<DSAQuestion />} />

						<Route path="/sql" element={<SQL />} />

						<Route path="/sql/:id" element={<SQLQuestion />} />

						<Route path="/assessments" element={<Assessments />} />

						<Route path="/assessments/:id" element={<AssessmentTest />} />

						<Route path="/assessments/:id/result" element={<AssessmentResult />} />

						<Route path="/interview" element={<Interview />} />

						<Route path="/companies" element={<Companies />} />

						<Route path="/companies/:id" element={<CompanyDetail />} />

						<Route path="/progress" element={<Progress />} />

						<Route path="/profile" element={<Profile />} />
					</Route>
				</Route>

				{/* =================================================
            ADMIN ROUTES
        ================================================= */}
				<Route element={<AdminRoute />}>
					<Route path="/admin" element={<AdminLayout />}>
						<Route index element={<AdminDashboard />} />

						<Route path="students" element={<AdminStudents />} />

						<Route path="students/:id/edit" element={<AdminStudentEdit />} />

						<Route path="students/:id" element={<AdminStudentDetails />} />

						<Route path="companies" element={<AdminCompanies />} />

						<Route path="companies/create" element={<AdminCompanyCreate />} />

						<Route path="companies/:id/edit" element={<AdminCompanyEdit />} />

						<Route path="companies/:id" element={<AdminCompanyDetails />} />
					</Route>
				</Route>

				{/* =================================================
            UNKNOWN ROUTE
        ================================================= */}

				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
