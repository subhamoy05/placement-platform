const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},

		description: {
			type: String,
			required: true,
		},

		duration: {
			type: Number,
			required: true,
			min: 1,
		},

		questions: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "DSAQuestion",
			},
		],

		totalMarks: {
			type: Number,
			required: true,
			min: 0,
		},

		difficulty: {
			type: String,
			required: true,
			enum: ["Easy", "Medium", "Hard"],
		},

		company: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Company",
			default: null,
		},
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model("Assessment", assessmentSchema);
