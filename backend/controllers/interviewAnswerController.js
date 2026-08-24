const InterviewAnswer = require("../models/InterviewAnswer");
const InterviewQuestion = require("../models/InterviewQuestion");

const submitInterviewAnswer = async (req, res) => {
  try {
    const { questionId, answer } = req.body;

    if (!questionId || !answer?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question and answer are required",
      });
    }

    const question = await InterviewQuestion.findOne({
      _id: questionId,
      isActive: true,
    });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Interview question not found",
      });
    }

    const interviewAnswer =
      await InterviewAnswer.create({
        user: req.userId,
        question: question._id,
        answer: answer.trim(),
        category: question.category,
      });

    return res.status(201).json({
      success: true,
      message: "Interview answer saved successfully",
      data: {
        answer: interviewAnswer,
      },
    });
  } catch (error) {
    console.error(
      "Submit interview answer error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while saving interview answer",
    });
  }
};

const getMyInterviewAnswers = async (req, res) => {
  try {
    const answers = await InterviewAnswer.find({
      user: req.userId,
    })
      .populate("question", "question category level topic")
      .sort({ createdAt: -1 })
      .select("-__v");

    return res.status(200).json({
      success: true,
      data: {
        answers,
      },
    });
  } catch (error) {
    console.error(
      "Get interview answers error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching interview answers",
    });
  }
};

module.exports = {
  submitInterviewAnswer,
  getMyInterviewAnswers,
};