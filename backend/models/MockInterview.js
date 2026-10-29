const mongoose = require("mongoose");

const mockInterviewSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
            default: "",
        },

        category: {
            type: String,
            enum: [
                "Technical",
                "HR",
                "Behavioral",
                "Mixed",
            ],
            default: "Technical",
        },

        difficulty: {
            type: String,
            enum: [
                "Easy",
                "Medium",
                "Hard",
            ],
            default: "Medium",
        },

        duration: {
            type: Number,
            required: true,
            min: 5,
            max: 180,
            default: 30,
        },

        instructions: {
            type: String,
            trim: true,
            default: "",
        },

        questions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "InterviewQuestion",
            },
        ],

        isPublished: {
            type: Boolean,
            default: false,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

mockInterviewSchema.index({
    title: 1,
});

mockInterviewSchema.index({
    isPublished: 1,
});

module.exports = mongoose.model(
    "MockInterview",
    mockInterviewSchema
);