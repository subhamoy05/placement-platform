const express = require("express");

const { getAdminDashboard } = require("../controllers/adminController");

const { getStudents, getStudentById, updateStudent, deleteStudent } = require("../controllers/adminStudentController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const { getCompanies, getCompanyById, createCompany, updateCompany, deleteCompany } = require("../controllers/adminCompanyController");

const { getAssessments, getAssessmentById, createAssessment, updateAssessment, deleteAssessment } = require("../controllers/adminAssessmentController");

const { getQuestions, getQuestionById, createQuestion, updateQuestion, deleteQuestion } = require("../controllers/adminQuestionController");

const { getSQLQuestions, getSQLQuestionById, createSQLQuestion, updateSQLQuestion, deleteSQLQuestion } = require("../controllers/adminSQLQuestionController");

const router = express.Router();

router.get("/dashboard", protect, adminOnly, getAdminDashboard);

// Students
router.get("/students", protect, adminOnly, getStudents);

router.get("/students/:id", protect, adminOnly, getStudentById);

router.put("/students/:id", protect, adminOnly, updateStudent);

router.delete("/students/:id", protect, adminOnly, deleteStudent);

// Companies

router.get("/companies", protect, adminOnly, getCompanies);

router.get("/companies/:id", protect, adminOnly, getCompanyById);

router.post("/companies", protect, adminOnly, createCompany);

router.put("/companies/:id", protect, adminOnly, updateCompany);

router.delete("/companies/:id", protect, adminOnly, deleteCompany);

// Assessments

router.get("/assessments", protect, adminOnly, getAssessments);

router.get("/assessments/:id", protect, adminOnly, getAssessmentById);

router.post("/assessments", protect, adminOnly, createAssessment);

router.put("/assessments/:id", protect, adminOnly, updateAssessment);

router.delete("/assessments/:id", protect, adminOnly, deleteAssessment);

// ==========================================
// DSA QUESTIONS
// ==========================================

router.get("/questions", protect, adminOnly, getQuestions);

router.get("/questions/:id", protect, adminOnly, getQuestionById);

router.post("/questions", protect, adminOnly, createQuestion);

router.put("/questions/:id", protect, adminOnly, updateQuestion);

router.delete("/questions/:id", protect, adminOnly, deleteQuestion);

// ==========================================
// SQL QUESTIONS
// ==========================================

router.get("/sql-questions", protect, adminOnly, getSQLQuestions);

router.get("/sql-questions/:id", protect, adminOnly, getSQLQuestionById);

router.post("/sql-questions", protect, adminOnly, createSQLQuestion);

router.put("/sql-questions/:id", protect, adminOnly, updateSQLQuestion);

router.delete("/sql-questions/:id", protect, adminOnly, deleteSQLQuestion);

module.exports = router;
