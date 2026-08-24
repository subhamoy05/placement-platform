const mongoose = require("mongoose");

const interviewAnswerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InterviewQuestion",
      required: true,
    },

    answer: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
    },

    evaluationStatus: {
      type: String,
      enum: [
        "pending",
        "evaluated",
      ],
      default: "pending",
    },

    score: {
      type: Number,
      default: null,
    },

    feedback: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "InterviewAnswer",
  interviewAnswerSchema
);