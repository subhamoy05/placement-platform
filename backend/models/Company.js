const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},

		description: {
			type: String,
			required: true,
		},

		eligibility: {
			type: [String],
			default: [],
		},

		package: {
			type: String,
			default: "",
		},

		difficulty: {
			type: String,
			required: true,
			enum: ["Easy", "Medium", "Hard"],
		},

		rounds: {
			type: [String],
			default: [],
		},

		topics: {
			type: [String],
			default: [],
		},

		questions: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "DSAQuestion",
			},
		],
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model("Company", companySchema);
