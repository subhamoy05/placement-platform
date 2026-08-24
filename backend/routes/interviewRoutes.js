const express = require("express");

const {
  getInterviewQuestions,
  getInterviewQuestion,
} = require("../controllers/interviewController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/",
  protect,
  getInterviewQuestions
);

router.get(
  "/:id",
  protect,
  getInterviewQuestion
);

module.exports = router;