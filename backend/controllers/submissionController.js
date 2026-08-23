const Submission = require("../models/Submission");

const getMySubmissions = async (req, res) => {
	try {
		const { questionModel, status } = req.query;

		const filter = {
			user: req.userId,
		};

		if (questionModel) {
			filter.questionModel = questionModel;
		}
		if (status) {
			filter.status = status;
		}

		const submissions = await Submission.find(filter).populate("question").sort({ createdAt: -1 });

		return res.status(200).json({
			success: true,
			data: {
				submissions,
			},
		});
	} catch (error) {
		console.error("Get submissions error:", error);

		return res.status(500).json({
			success: false,
			message: "Server error while fetching submissions",
		});
	}
};

module.exports = {
	getMySubmissions,
};
