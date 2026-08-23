const UserProgress = require("../models/UserProgress");
const Submission = require("../models/Submission");
const AssessmentResult = require("../models/AssessmentResult");

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
    }).populate("question");

    const dsaSubmissions = submissions.filter(
      (submission) =>
        submission.questionType === "DSA"
    );

    const sqlSubmissions = submissions.filter(
      (submission) =>
        submission.questionType === "SQL"
    );

    const acceptedDSAQuestions = new Set(
      dsaSubmissions
        .filter(
          (submission) =>
            submission.status === "accepted"
        )
        .map((submission) =>
          submission.question._id.toString()
        )
    );

    const acceptedSQLQuestions = new Set(
      sqlSubmissions
        .filter(
          (submission) =>
            submission.status === "accepted"
        )
        .map((submission) =>
          submission.question._id.toString()
        )
    );

    const allScores = submissions.map(
      (submission) => submission.score
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

    const assessmentResults =
      await AssessmentResult.find({
        user: userId,
      });

    progress.dsaSolved =
      acceptedDSAQuestions.size;

    progress.sqlSolved =
      acceptedSQLQuestions.size;

    progress.assessmentsCompleted =
      assessmentResults.length;

    progress.averageScore = averageScore;

    await progress.save();

    return progress;
  } catch (error) {
    console.error(
      "Update user progress error:",
      error.message
    );

    throw error;
  }
};

module.exports = {
  updateUserProgress,
};