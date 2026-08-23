const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    questionType: {
      type: String,
      required: true,
      enum: ["DSA", "SQL"],
    },

    question: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "questionModel",
    },

    questionModel: {
      type: String,
      required: true,
      enum: ["DSAQuestion", "SQLQuestion"],
    },

    language: {
      type: String,
      required: true,
      enum: ["python", "sql"],
    },

    code: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      required: true,
      enum: [
        "accepted",
        "wrong_answer",
        "runtime_error",
        "time_limit_exceeded",
        "compilation_error",
      ],
    },

    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    executionTime: {
      type: Number,
      default: 0,
      min: 0,
    },

    errorMessage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Submission",
  submissionSchema
);