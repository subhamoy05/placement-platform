const express = require("express");

const {
  submitSQLQuery,
} = require("../controllers/sqlSubmissionController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/:id/submit",
  protect,
  submitSQLQuery
);

module.exports = router;