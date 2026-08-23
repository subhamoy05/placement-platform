const DSAQuestion = require("../models/DSAQuestion");
const Submission = require("../models/Submission");
const { executePythonCode } = require("../services/codingService");
const { updateUserProgress } = require("../services/progressService");

const submitDSACode = async (req, res) => {
	try {
		const { code } = req.body;
		const { id } = req.params;

		if (!code || !code.trim()) {
			return res.status(400).json({
				success: false,
				message: "Python code is required",
			});
		}

		const question = await DSAQuestion.findById(id);

		if (!question) {
			return res.status(404).json({
				success: false,
				message: "DSA question not found",
			});
		}

		const result = await executePythonCode({
			code: code.trim(),
			testCases: question.testCases,
		});

		let score = 0;

		if (result.totalTests > 0) {
			score = Math.round((result.passedTests / result.totalTests) * 100);
		}

		const status =
			result.status === "accepted"
				? "accepted"
				: result.status === "time_limit_exceeded"
					? "time_limit_exceeded"
					: result.status === "runtime_error"
						? "runtime_error"
						: "wrong_answer";

		const submission = await Submission.create({
			user: req.userId,

			// IMPORTANT
			questionType: "DSA",
			question: question._id,
			questionModel: "DSAQuestion",
			language: "python",
			code: code.trim(),
			status,
			score,
			executionTime: 0,
			errorMessage: "",
		});

		console.log("DSA submission saved:", {
			submissionId: submission._id.toString(),
			questionType: submission.questionType,
			question: submission.question.toString(),
			status: submission.status,
			score: submission.score,
		});

		await updateUserProgress(req.userId);

		return res.status(200).json({
			success: true,
			data: {
				submissionId: submission._id,
				status,
				score,
				passedTests: result.passedTests,
				totalTests: result.totalTests,
				results: result.results,
			},
		});
	} catch (error) {
		console.error("DSA submission error:", error);

		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

module.exports = {
	submitDSACode,
};
