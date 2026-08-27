const User = require("../models/User");
const Company = require("../models/Company");
const Assessment = require("../models/Assessment");
const DSAQuestion = require("../models/DSAQuestion");
const SQLQuestion = require("../models/SQLQuestion");

const getAdminDashboard = async (req, res) => {
  try {
    const studentCount = await User.countDocuments({
      role: "student",
    });

    const companyCount = await Company.countDocuments();

    const assessmentCount = await Assessment.countDocuments();

    const dsaQuestionCount = await DSAQuestion.countDocuments();

    const sqlQuestionCount = await SQLQuestion.countDocuments();

    const questionCount =
      dsaQuestionCount + sqlQuestionCount;

    return res.status(200).json({
      success: true,
      message: "Welcome to the admin dashboard",

      data: {
        admin: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
        },

        studentCount,
        companyCount,
        assessmentCount,
        questionCount,
      },
    });
  } catch (error) {
    console.error(
      "Admin dashboard error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load admin dashboard",
    });
  }
};

module.exports = {
  getAdminDashboard,
};