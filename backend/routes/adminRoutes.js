const express = require("express");

const { getAdminDashboard } = require("../controllers/adminController");

const { getStudents, getStudentById, updateStudent, deleteStudent } = require("../controllers/adminStudentController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const { getCompanies, getCompanyById, createCompany, updateCompany, deleteCompany } = require("../controllers/adminCompanyController");

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

module.exports = router;
