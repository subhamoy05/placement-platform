const mongoose = require("mongoose");

const dsaQuestionSchema = new mongoose.Schema(
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

		topic: {
			type: String,
			required: true,
			enum: ["Array", "String", "Linked List", "Stack", "Queue", "Hashing", "Searching", "Sorting", "Tree", "Graph", "Greedy", "Dynamic Programming", "Recursion"],
		},

		difficulty: {
			type: String,
			required: true,
			enum: ["Easy", "Medium", "Hard"],
		},

		examples: [
			{
				input: {
					type: String,
					required: true,
				},
				output: {
					type: String,
					required: true,
				},
				explanation: {
					type: String,
					default: "",
				},
			},
		],

		constraints: {
			type: [String],
			default: [],
		},

		starterCode: {
			type: String,
			default: "",
		},

		testCases: [
			{
				input: {
					type: String,
					required: true,
				},
				expectedOutput: {
					type: String,
					required: true,
				},
			},
		],

		companyTags: {
			type: [String],
			default: [],
		},
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model("DSAQuestion", dsaQuestionSchema);
