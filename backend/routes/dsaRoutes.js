const express = require("express");

const {
  getDSAQuestions,
  getDSAQuestionById,
  createDSAQuestion,
  updateDSAQuestion,
  deleteDSAQuestion,
} = require("../controllers/dsaController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Student + authenticated users
router.get("/", protect, getDSAQuestions);

router.get("/:id", protect, getDSAQuestionById);

// Admin only
router.post("/", protect, adminOnly, createDSAQuestion);

router.put("/:id", protect, adminOnly, updateDSAQuestion);

router.delete("/:id", protect, adminOnly, deleteDSAQuestion);

module.exports = router;