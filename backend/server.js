const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const dsaRoutes = require("./routes/dsaRoutes");
const sqlRoutes = require("./routes/sqlRoutes");
const sqlSubmissionRoutes = require("./routes/sqlSubmissionRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const dsaSubmissionRoutes = require("./routes/dsaSubmissionRoutes");
const progressRoutes = require("./routes/progressRoutes");
const assessmentRoutes = require("./routes/assessmentRoutes");
const connectDB = require("./config/db");
const assessmentResultRoutes = require(
  "./routes/assessmentResultRoutes"
);
const companyRoutes = require("./routes/companyRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");


dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// Connect MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dsa", dsaRoutes);
app.use("/api/sql", sqlRoutes);
app.use("/api/sql", sqlSubmissionRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/dsa", dsaSubmissionRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use(
  "/api/assessment-results",
  assessmentResultRoutes
);
app.use("/api/companies", companyRoutes);
app.use("/api/dashboard", dashboardRoutes);


// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Placement Platform API is running",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});