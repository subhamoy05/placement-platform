const InterviewQuestion = require("../models/InterviewQuestion");

// Get interview questions
const getInterviewQuestions = async (req, res) => {
	try {
		const { category, level, company } = req.query;

		const filter = {
			isActive: true,
		};

		if (category) {
			filter.category = category;
		}

		if (level) {
			filter.level = level;
		}

		if (company) {
			filter.company = company;
		}

		const questions = await InterviewQuestion.find(filter).sort({ createdAt: -1 }).select("-__v");

		return res.status(200).json({
			success: true,
			data: {
				questions,
			},
		});
	} catch (error) {
		console.error("Get interview questions error:", error);

		return res.status(500).json({
			success: false,
			message: "Server error while fetching interview questions",
		});
	}
};

// Get one interview question
const getInterviewQuestion = async (req, res) => {
	try {
		const question = await InterviewQuestion.findOne({
			_id: req.params.id,
			isActive: true,
		}).select("-__v");

		if (!question) {
			return res.status(404).json({
				success: false,
				message: "Interview question not found",
			});
		}

		return res.status(200).json({
			success: true,
			data: {
				question,
			},
		});
	} catch (error) {
		console.error("Get interview question error:", error);

		return res.status(500).json({
			success: false,
			message: "Server error while fetching interview question",
		});
	}
};

module.exports = {
	getInterviewQuestions,
	getInterviewQuestion,
};
