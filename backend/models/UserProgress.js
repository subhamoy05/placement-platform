const mongoose = require("mongoose");

const userProgressSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			unique: true,
		},

		dsaSolved: {
			type: Number,
			default: 0,
			min: 0,
		},

		sqlSolved: {
			type: Number,
			default: 0,
			min: 0,
		},

		assessmentsCompleted: {
			type: Number,
			default: 0,
			min: 0,
		},

		interviewCompleted: {
			type: Number,
			default: 0,
			min: 0,
		},

		topicStats: {
			type: mongoose.Schema.Types.Mixed,
			default: {},
		},

		averageScore: {
			type: Number,
			default: 0,
			min: 0,
			max: 100,
		},

		readinessScore: {
			type: Number,
			default: 0,
			min: 0,
			max: 100,
		},
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model("UserProgress", userProgressSchema);
