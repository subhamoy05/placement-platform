const express = require("express");
const router = express.Router();

const {
    getMockInterviews,
    getMockInterviewById,
    createMockInterview,
    updateMockInterview,
    deleteMockInterview,
} = require("../controllers/mockInterviewController");

const { protect } = require("../middleware/authMiddleware");

// Get all mock interviews
router.get("/", protect, getMockInterviews);

// Get mock interview by ID
router.get("/:id", protect, getMockInterviewById);

// Create mock interview
router.post("/", protect, createMockInterview);

// Update mock interview
router.put("/:id", protect, updateMockInterview);

// Delete mock interview
router.delete("/:id", protect, deleteMockInterview);

module.exports = router;