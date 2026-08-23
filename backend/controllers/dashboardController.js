const User = require("../models/User");
const UserProgress = require("../models/UserProgress");
const Submission = require("../models/Submission");
const AssessmentResult = require("../models/AssessmentResult");

const getStudentDashboard = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let progress = await UserProgress.findOne({
      user: userId,
    });

    if (!progress) {
      progress = await UserProgress.create({
        user: userId,
      });
    }

    const recentSubmissions = await Submission.find({
      user: userId,
    })
      .populate("question", "title topic difficulty")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentAssessments =
      await AssessmentResult.find({
        user: userId,
      })
        .populate(
          "assessment",
          "title difficulty totalMarks"
        )
        .sort({ createdAt: -1 })
        .limit(5);

    return res.status(200).json({
      success: true,
      data: {
        user,
        progress,
        recentSubmissions,
        recentAssessments,
        statistics: {
          dsaSolved: progress.dsaSolved || 0,
          sqlSolved: progress.sqlSolved || 0,
          assessmentsCompleted:
            progress.assessmentsCompleted || 0,
          averageScore:
            progress.averageScore || 0,
          readinessScore:
            progress.readinessScore || 0,
        },
      },
    });
  } catch (error) {
    console.error(
      "Get student dashboard error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching student dashboard",
    });
  }
};

module.exports = {
  getStudentDashboard,
};