const express = require("express");

const {
  getSQLQuestions,
  getSQLQuestionById,
  createSQLQuestion,
  updateSQLQuestion,
  deleteSQLQuestion,
} = require("../controllers/sqlController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Authenticated users
router.get("/", protect, getSQLQuestions);

router.get("/:id", protect, getSQLQuestionById);

// Admin only
router.post("/", protect, adminOnly, createSQLQuestion);

router.put("/:id", protect, adminOnly, updateSQLQuestion);

router.delete("/:id", protect, adminOnly, deleteSQLQuestion);

module.exports = router;