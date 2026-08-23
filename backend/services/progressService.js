const UserProgress = require("../models/UserProgress");
const Submission = require("../models/Submission");

const updateUserProgress = async (userId) => {
  try {
    let progress = await UserProgress.findOne({
      user: userId,
    });

    if (!progress) {
      progress = await UserProgress.create({
        user: userId,
      });
    }

    const submissions = await Submission.find({
      user: userId,
    }).lean();

    // -----------------------------
    // DSA
    // -----------------------------
    const dsaSolvedQuestions = new Set();

    submissions.forEach((submission) => {
      if (
        submission.questionType === "DSA" &&
        submission.status === "accepted" &&
        submission.question
      ) {
        dsaSolvedQuestions.add(
          submission.question.toString()
        );
      }
    });

    // -----------------------------
    // SQL
    // -----------------------------
    const sqlSolvedQuestions = new Set();

    submissions.forEach((submission) => {
      if (
        submission.questionType === "SQL" &&
        submission.status === "accepted" &&
        submission.question
      ) {
        sqlSolvedQuestions.add(
          submission.question.toString()
        );
      }
    });

    // -----------------------------
    // Average Score
    // -----------------------------
    const allScores = submissions.map(
      (submission) => submission.score || 0
    );

    const averageScore =
      allScores.length > 0
        ? Math.round(
            allScores.reduce(
              (sum, score) => sum + score,
              0
            ) / allScores.length
          )
        : 0;

    // -----------------------------
    // Update Progress
    // -----------------------------
    progress.dsaSolved =
      dsaSolvedQuestions.size;

    progress.sqlSolved =
      sqlSolvedQuestions.size;

    progress.averageScore = averageScore;

    await progress.save();

    console.log("User progress updated:", {
      userId: userId.toString(),
      dsaSolved: progress.dsaSolved,
      sqlSolved: progress.sqlSolved,
      averageScore: progress.averageScore,
    });

    return progress;
  } catch (error) {
    console.error(
      "Update user progress error:",
      error
    );

    throw error;
  }
};

module.exports = {
  updateUserProgress,
};