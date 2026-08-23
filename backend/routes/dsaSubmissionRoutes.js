const express = require("express");

const {
  submitDSACode,
} = require("../controllers/dsaSubmissionController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/:id/submit",
  protect,
  submitDSACode
);

module.exports = router;