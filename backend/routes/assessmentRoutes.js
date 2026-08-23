const express = require("express");

const {
  getAssessments,
  getAssessmentById,
  createAssessment,
  updateAssessment,
  deleteAssessment,
} = require("../controllers/assessmentController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Authenticated users
router.get("/", protect, getAssessments);

router.get("/:id", protect, getAssessmentById);

// Admin only
router.post("/", protect, adminOnly, createAssessment);

router.put("/:id", protect, adminOnly, updateAssessment);

router.delete("/:id", protect, adminOnly, deleteAssessment);

module.exports = router;
