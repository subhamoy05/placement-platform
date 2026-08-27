const Assessment = require("../models/Assessment");

const getAssessments = async (req, res) => {
	try {
		const assessments = await Assessment.find().populate("company", "name").sort({ createdAt: -1 });

		return res.status(200).json({
			success: true,
			count: assessments.length,
			data: assessments,
		});
	} catch (error) {
		console.error("Get assessments error:", error);

		return res.status(500).json({
			success: false,
			message: "Failed to fetch assessments",
		});
	}
};

const getAssessmentById = async (req, res) => {
	try {
		const assessment = await Assessment.findById(req.params.id).populate("company", "name").populate("questions", "title difficulty");

		if (!assessment) {
			return res.status(404).json({
				success: false,
				message: "Assessment not found",
			});
		}

		return res.status(200).json({
			success: true,
			data: assessment,
		});
	} catch (error) {
		console.error("Get assessment error:", error);

		return res.status(500).json({
			success: false,
			message: "Failed to fetch assessment",
		});
	}
};

const createAssessment = async (req, res) => {
	try {
		const { title, description, duration, questions, totalMarks, difficulty, company } = req.body;

		if (!title || !description || !duration || totalMarks === undefined || !difficulty) {
			return res.status(400).json({
				success: false,
				message: "Title, description, duration, total marks and difficulty are required",
			});
		}

		const assessment = await Assessment.create({
			title: title.trim(),
			description: description.trim(),
			duration: Number(duration),
			questions: questions || [],
			totalMarks: Number(totalMarks),
			difficulty,
			company: company || null,
		});

		const populatedAssessment = await Assessment.findById(assessment._id).populate("company", "name");

		return res.status(201).json({
			success: true,
			message: "Assessment created successfully",
			data: populatedAssessment,
		});
	} catch (error) {
		console.error("Create assessment error:", error);

		return res.status(500).json({
			success: false,
			message: "Failed to create assessment",
		});
	}
};

const updateAssessment = async (req, res) => {
    try {
        const assessment =
            await Assessment.findById(
                req.params.id
            );

        if (!assessment) {
            return res.status(404).json({
                success: false,
                message: "Assessment not found",
            });
        }

        const {
            title,
            description,
            duration,
            questions,
            totalMarks,
            difficulty,
            company,
        } = req.body;

        if (title !== undefined) {
            assessment.title = title.trim();
        }

        if (description !== undefined) {
            assessment.description =
                description.trim();
        }

        if (duration !== undefined) {
            assessment.duration =
                Number(duration);
        }

        if (questions !== undefined) {
            assessment.questions = questions;
        }

        if (totalMarks !== undefined) {
            assessment.totalMarks =
                Number(totalMarks);
        }

        if (difficulty !== undefined) {
            assessment.difficulty = difficulty;
        }

        if (company !== undefined) {
            assessment.company =
                company || null;
        }

        await assessment.save();

        const populatedAssessment =
            await Assessment.findById(
                assessment._id
            )
                .populate(
                    "company",
                    "name"
                )
                .populate(
                    "questions",
                    "title difficulty"
                );

        return res.status(200).json({
            success: true,
            message:
                "Assessment updated successfully",
            data: populatedAssessment,
        });
    } catch (error) {
        console.error(
            "Update assessment error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to update assessment",
        });
    }
};

const deleteAssessment = async (req, res) => {
    try {
        const assessment =
            await Assessment.findById(
                req.params.id
            );

        if (!assessment) {
            return res.status(404).json({
                success: false,
                message: "Assessment not found",
            });
        }

        await Assessment.findByIdAndDelete(
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message:
                "Assessment deleted successfully",
        });
    } catch (error) {
        console.error(
            "Delete assessment error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to delete assessment",
        });
    }
};

module.exports = {
    getAssessments,
    getAssessmentById,
    createAssessment,
    updateAssessment,
    deleteAssessment,
};