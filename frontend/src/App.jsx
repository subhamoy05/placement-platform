import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./App.css";

import StudentLayout from "./layouts/StudentLayout";

import Login from "./pages/Login";
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

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        {/* Protected Student Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<StudentLayout />}>

            <Route
              path="/dashboard"
              element={<StudentDashboard />}
            />

            <Route
              path="/dsa"
              element={<DSA />}
            />

            <Route
              path="/dsa/:id"
              element={<DSAQuestion />}
            />

            <Route
              path="/sql"
              element={<SQL />}
            />

            <Route
              path="/sql/:id"
              element={<SQLQuestion />}
            />

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

            <Route
              path="/interview"
              element={<Interview />}
            />

            <Route
              path="/companies"
              element={<Companies />}
            />

            <Route
              path="/companies/:id"
              element={<CompanyDetail />}
            />

            <Route
              path="/progress"
              element={<Progress />}
            />

            <Route
              path="/profile"
              element={<Profile />}
            />

          </Route>
        </Route>

        {/* Unknown Route */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;