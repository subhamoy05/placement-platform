const SQLQuestion = require("../models/SQLQuestion");
const Submission = require("../models/Submission");
const { executeSQL } = require("../services/sqlService");
const { updateUserProgress } = require("../services/progressService");

const submitSQLQuery = async (req, res) => {
	try {
		const { query } = req.body;
		const { id } = req.params;

		if (!query || !query.trim()) {
			return res.status(400).json({
				success: false,
				message: "SQL query is required",
			});
		}

		const question = await SQLQuestion.findById(id);

		if (!question) {
			return res.status(404).json({
				success: false,
				message: "SQL question not found",
			});
		}

		const result = await executeSQL({
			schema: question.schema,
			sampleData: question.sampleData,
			query: query.trim(),
		});

		// SQL execution failed
		if (!result.success) {
			await Submission.create({
				user: req.userId,
				questionType: "SQL",
				question: question._id,
				language: "sql",
				code: query.trim(),
				status: "runtime_error",
				score: 0,
				executionTime: 0,
				errorMessage: result.error || "SQL execution failed",
			});
			await updateUserProgress(req.userId);

			return res.status(200).json({
				success: false,
				message: "SQL query execution failed",
				data: {
					error: result.error,
				},
			});
		}

		const actualResult = JSON.stringify(result.rows);

		const expectedResult = JSON.stringify(parseExpectedResult(question.expectedQueryResult));

		const isCorrect = actualResult === expectedResult;

		const submission = await Submission.create({
			user: req.userId,
			questionType: "SQL",
			question: question._id,
			language: "sql",
			code: query.trim(),
			status: isCorrect ? "accepted" : "wrong_answer",
			score: isCorrect ? 100 : 0,
			executionTime: result.executionTime || 0,
			errorMessage: "",
		});
		await updateUserProgress(req.userId);

		return res.status(200).json({
			success: true,
			data: {
				submissionId: submission._id,
				correct: isCorrect,
				score: submission.score,
				status: submission.status,
				columns: result.columns,
				rows: result.rows,
				executionTime: result.executionTime,
				message: isCorrect ? "Correct answer" : "Incorrect answer",
			},
		});
	} catch (error) {
		console.error("SQL submission error:", error.message);

		return res.status(500).json({
			success: false,
			message: "Server error while submitting SQL query",
		});
	}
};

const parseExpectedResult = (expectedResult) => {
	return expectedResult
		.split("\n")
		.filter((row) => row.trim())
		.map((row) =>
			row.split("|").map((value) => {
				const trimmedValue = value.trim();

				if (trimmedValue !== "" && !Number.isNaN(Number(trimmedValue))) {
					return Number(trimmedValue);
				}

				return trimmedValue;
			}),
		);
};

module.exports = {
	submitSQLQuery,
};
