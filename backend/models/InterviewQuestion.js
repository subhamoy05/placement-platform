const mongoose = require("mongoose");

const interviewQuestionSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: true,
            trim: true,
        },

        category: {
            type: String,
            required: true,
            enum: [
                "HR",
                "Technical",
                "Behavioral",
                "Python",
                "JavaScript",
                "React",
                "Node.js",
                "MongoDB",
                "SQL",
                "DSA",
            ],
        },

        difficulty: {
            type: String,
            required: true,
            enum: ["Easy", "Medium", "Hard"],
            default: "Easy",
        },

        companyTags: {
            type: [String],
            default: [],
        },

        expectedPoints: {
            type: [String],
            default: [],
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "InterviewQuestion",
    interviewQuestionSchema
);