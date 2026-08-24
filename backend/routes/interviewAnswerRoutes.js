const express = require("express");

const {
  submitInterviewAnswer,
  getMyInterviewAnswers,
} = require("../controllers/interviewAnswerController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  submitInterviewAnswer
);

router.get(
  "/my",
  protect,
  getMyInterviewAnswers
);

module.exports = router;