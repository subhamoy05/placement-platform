const {
  updateUserProgress,
} = require("../services/progressService");

const getMyProgress = async (req, res) => {
  try {
    const progress = await updateUserProgress(req.userId);

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