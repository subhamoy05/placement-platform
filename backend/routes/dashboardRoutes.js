const express = require("express");

const {
  getStudentDashboard,
} = require("../controllers/dashboardController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/",
  protect,
  getStudentDashboard
);

module.exports = router;