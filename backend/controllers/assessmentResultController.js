const Assessment = require("../models/Assessment");
const AssessmentResult = require("../models/AssessmentResult");
const { executePythonCode } = require("../services/codingService");
const { updateUserProgress } = require("../services/progressService");

const submitAssessment = async (req, res) => {
	try {
		const { answers, timeTaken } = req.body;
        const { id } = req.params;
		if (!Array.isArray(answers) || answers.length === 0) {
			return res.status(400).json({
				success: false,
				message: "At least one answer is required",
			});
		}

		if (!Array.isArray(answers)) {
			return res.status(400).json({
				success: false,
				message: "Answers must be an array",
			});
		}

		const assessment = await Assessment.findById(id).populate("questions");

		if (!assessment) {
			return res.status(404).json({
				success: false,
				message: "Assessment not found",
			});
		}

		let totalScore = 0;

		const processedAnswers = [];

		for (const question of assessment.questions) {
			const submittedAnswer = answers.find((answer) => String(answer.questionId) === String(question._id));

			if (!submittedAnswer || !submittedAnswer.code) {
				processedAnswers.push({
					question: question._id,
					code: "",
					status: "wrong_answer",
					score: 0,
				});

				continue;
			}

			const result = await executePythonCode({
				code: submittedAnswer.code,
				testCases: question.testCases,
			});

			let score = 0;

			if (result.totalTests > 0) {
				score = Math.round((result.passedTests / result.totalTests) * 100);
			}

			totalScore += score;

			processedAnswers.push({
				question: question._id,
				code: submittedAnswer.code,
				status: result.status,
				score,
			});
		}

		const questionCount = assessment.questions.length;

		const percentage = questionCount > 0 ? Math.round(totalScore / questionCount) : 0;

		const result = await AssessmentResult.create({
			user: req.userId,
			assessment: assessment._id,
			score: totalScore,
			totalMarks: assessment.totalMarks,
			percentage,
			timeTaken: timeTaken || 0,
			answers: processedAnswers,
		});

		await updateUserProgress(req.userId);

		return res.status(201).json({
			success: true,
			message: "Assessment submitted successfully",
			data: {
				resultId: result._id,
				score: totalScore,
				totalMarks: assessment.totalMarks,
				percentage,
				timeTaken: timeTaken || 0,
				answers: processedAnswers,
			},
		});
	} catch (error) {
		console.error("Assessment submission error:", error.message);

		return res.status(500).json({
			success: false,
			message: "Server error while submitting assessment",
		});
	}
};

const getMyAssessmentResults = async (req, res) => {
	try {
		const results = await AssessmentResult.find({
			user: req.userId,
		})
			.populate("assessment", "title difficulty totalMarks")
			.sort({ createdAt: -1 });

		return res.status(200).json({
			success: true,
			data: {
				results,
			},
		});
	} catch (error) {
		console.error("Get assessment results error:", error.message);

		return res.status(500).json({
			success: false,
			message: "Server error while fetching assessment results",
		});
	}
};

module.exports = {
	submitAssessment,
	getMyAssessmentResults,
};
