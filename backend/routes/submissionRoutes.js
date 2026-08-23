const express = require("express");

const {
  getMySubmissions,
} = require("../controllers/submissionController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getMySubmissions);

module.exports = router;