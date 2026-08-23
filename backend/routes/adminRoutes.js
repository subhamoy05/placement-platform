const express = require("express");

const {
  getAdminDashboard,
} = require("../controllers/adminController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  adminOnly,
  getAdminDashboard
);

module.exports = router;