import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./App.css";
import "./Auth.css";

/* =========================================
   LAYOUTS
========================================= */

import StudentLayout from "./layouts/StudentLayout";
import AdminLayout from "./layouts/AdminLayout";

/* =========================================
   PUBLIC PAGES
========================================= */

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

/* =========================================
   STUDENT PAGES
========================================= */

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

/* =========================================
   ROUTE PROTECTION
========================================= */

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

/* =========================================
   ADMIN - DASHBOARD
========================================= */

import AdminDashboard from "./pages/admin/AdminDashboard";

/* =========================================
   ADMIN - STUDENTS
========================================= */

import AdminStudents from "./pages/admin/AdminStudents";
import AdminStudentDetails from "./pages/admin/AdminStudentDetails";
import AdminStudentEdit from "./pages/admin/AdminStudentEdit";

/* =========================================
   ADMIN - COMPANIES
========================================= */

import AdminCompanies from "./pages/admin/AdminCompanies";
import AdminCompanyDetails from "./pages/admin/AdminCompanyDetails";
import AdminCompanyCreate from "./pages/admin/AdminCompanyCreate";
import AdminCompanyEdit from "./pages/admin/AdminCompanyEdit";

/* =========================================
   ADMIN - ASSESSMENTS
========================================= */

import AdminAssessments from "./pages/admin/AdminAssessments";
import AdminAssessmentDetails from "./pages/admin/AdminAssessmentDetails";
import AdminAssessmentCreate from "./pages/admin/AdminAssessmentCreate";
import AdminAssessmentEdit from "./pages/admin/AdminAssessmentEdit";

/* =========================================
   ADMIN - DSA QUESTIONS
========================================= */

import AdminQuestions from "./pages/admin/AdminQuestions";
import AdminQuestionCreate from "./pages/admin/AdminQuestionCreate";
import AdminQuestionDetails from "./pages/admin/AdminQuestionDetails";
import AdminQuestionEdit from "./pages/admin/AdminQuestionEdit";


function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* =========================================
                    PUBLIC ROUTES
                ========================================= */}

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* =========================================
                    STUDENT ROUTES
                ========================================= */}

                <Route element={<ProtectedRoute />}>

                    <Route element={<StudentLayout />}>

                        {/* Dashboard */}

                        <Route
                            path="/dashboard"
                            element={<StudentDashboard />}
                        />

                        {/* DSA */}

                        <Route
                            path="/dsa"
                            element={<DSA />}
                        />

                        <Route
                            path="/dsa/:id"
                            element={<DSAQuestion />}
                        />

                        {/* SQL */}

                        <Route
                            path="/sql"
                            element={<SQL />}
                        />

                        <Route
                            path="/sql/:id"
                            element={<SQLQuestion />}
                        />

                        {/* Assessments */}

                        <Route
                            path="/assessments"
                            element={<Assessments />}
                        />

                        <Route
                            path="/assessments/:id"
                            element={<AssessmentTest />}
                        />

                        <Route
                            path="/assessments/:id/result"
                            element={<AssessmentResult />}
                        />

                        {/* Interview */}

                        <Route
                            path="/interview"
                            element={<Interview />}
                        />

                        {/* Companies */}

                        <Route
                            path="/companies"
                            element={<Companies />}
                        />

                        <Route
                            path="/companies/:id"
                            element={<CompanyDetail />}
                        />

                        {/* Progress */}

                        <Route
                            path="/progress"
                            element={<Progress />}
                        />

                        {/* Profile */}

                        <Route
                            path="/profile"
                            element={<Profile />}
                        />

                    </Route>

                </Route>


                {/* =========================================
                    ADMIN ROUTES
                ========================================= */}

                <Route element={<AdminRoute />}>

                    <Route
                        path="/admin"
                        element={<AdminLayout />}
                    >

                        {/* =================================
                            ADMIN DASHBOARD
                        ================================= */}

                        <Route
                            index
                            element={<AdminDashboard />}
                        />


                        {/* =================================
                            STUDENTS
                        ================================= */}

                        <Route
                            path="students"
                            element={<AdminStudents />}
                        />

                        <Route
                            path="students/:id/edit"
                            element={<AdminStudentEdit />}
                        />

                        <Route
                            path="students/:id"
                            element={<AdminStudentDetails />}
                        />


                        {/* =================================
                            COMPANIES
                        ================================= */}

                        <Route
                            path="companies"
                            element={<AdminCompanies />}
                        />

                        <Route
                            path="companies/create"
                            element={<AdminCompanyCreate />}
                        />

                        <Route
                            path="companies/:id/edit"
                            element={<AdminCompanyEdit />}
                        />

                        <Route
                            path="companies/:id"
                            element={<AdminCompanyDetails />}
                        />


                        {/* =================================
                            ASSESSMENTS
                        ================================= */}

                        <Route
                            path="assessments"
                            element={<AdminAssessments />}
                        />

                        <Route
                            path="assessments/create"
                            element={<AdminAssessmentCreate />}
                        />

                        <Route
                            path="assessments/:id/edit"
                            element={<AdminAssessmentEdit />}
                        />

                        <Route
                            path="assessments/:id"
                            element={<AdminAssessmentDetails />}
                        />


                        {/* =================================
                            DSA QUESTIONS
                        ================================= */}

                        <Route
                            path="questions"
                            element={<AdminQuestions />}
                        />

                        <Route
                            path="questions/create"
                            element={<AdminQuestionCreate />}
                        />

                        <Route
                            path="questions/:id/edit"
                            element={<AdminQuestionEdit />}
                        />

                        <Route
                            path="questions/:id"
                            element={<AdminQuestionDetails />}
                        />

                    </Route>

                </Route>


                {/* =========================================
                    UNKNOWN ROUTES
                ========================================= */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;