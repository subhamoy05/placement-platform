const mongoose = require("mongoose");

const assessmentResultSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

		assessment: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Assessment",
			required: true,
		},

		score: {
			type: Number,
			required: true,
			min: 0,
		},

		totalMarks: {
			type: Number,
			required: true,
			min: 0,
		},

		percentage: {
			type: Number,
			required: true,
			min: 0,
			max: 100,
		},

		timeTaken: {
			type: Number,
			required: true,
			min: 0,
		},

		answers: [
			{
				question: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "DSAQuestion",
				},

				code: {
					type: String,
					default: "",
				},

				status: {
					type: String,
					default: "",
				},

				score: {
					type: Number,
					default: 0,
				},
			},
		],
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model("AssessmentResult", assessmentResultSchema);
