const express = require("express");

const {
  submitAssessment,
  getMyAssessmentResults,
} = require("../controllers/assessmentResultController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Submit an assessment
router.post(
  "/:id/submit",
  protect,
  submitAssessment
);

// Get current student's assessment results
router.get(
  "/my-results",
  protect,
  getMyAssessmentResults
);

module.exports = router;