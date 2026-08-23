const mongoose = require("mongoose");

const sqlQuestionSchema = new mongoose.Schema(
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

		difficulty: {
			type: String,
			required: true,
			enum: ["Easy", "Medium", "Hard"],
		},

		category: {
			type: String,
			required: true,
			enum: ["SELECT", "WHERE", "GROUP BY", "HAVING", "ORDER BY", "JOIN", "Subquery", "Aggregate Functions", "Window Functions"],
		},

		schema: {
			type: String,
			required: true,
		},

		sampleData: {
			type: String,
			required: true,
		},

		expectedQueryResult: {
			type: String,
			required: true,
		},

		companyTags: {
			type: [String],
			default: [],
		},
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model("SQLQuestion", sqlQuestionSchema);
