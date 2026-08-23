const express = require("express");

const { getCompanies, getCompanyById, getCompanyDashboard, createCompany, updateCompany, deleteCompany } = require("../controllers/companyController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Authenticated users
router.get("/", protect, getCompanies);

router.get("/:id/dashboard", protect, getCompanyDashboard);
router.get("/:id", protect, getCompanyById);

// Admin only
router.post("/", protect, adminOnly, createCompany);

router.put("/:id", protect, adminOnly, updateCompany);

router.delete("/:id", protect, adminOnly, deleteCompany);

module.exports = router;
