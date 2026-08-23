const UserProgress = require("../models/UserProgress");

const getMyProgress = async (req, res) => {
  try {
    let progress = await UserProgress.findOne({
      user: req.userId,
    });

    if (!progress) {
      progress = await UserProgress.create({
        user: req.userId,
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        progress,
      },
    });
  } catch (error) {
    console.error("Get progress error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching progress",
    });
  }
};

module.exports = {
  getMyProgress,
};