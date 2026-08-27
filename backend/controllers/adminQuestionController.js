const DSAQuestion = require("../models/DSAQuestion");

// ==========================================
// GET ALL QUESTIONS
// ==========================================

const getQuestions = async (req, res) => {
    try {
        const questions = await DSAQuestion.find()
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: questions.length,
            data: questions,
        });
    } catch (error) {
        console.error(
            "Get questions error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to load questions",
        });
    }
};

// ==========================================
// GET QUESTION BY ID
// ==========================================

const getQuestionById = async (req, res) => {
    try {
        const question =
            await DSAQuestion.findById(
                req.params.id
            );

        if (!question) {
            return res.status(404).json({
                success: false,
                message: "Question not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: question,
        });
    } catch (error) {
        console.error(
            "Get question error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to load question",
        });
    }
};

// ==========================================
// CREATE QUESTION
// ==========================================

const createQuestion = async (req, res) => {
    try {
        const {
            title,
            description,
            topic,
            difficulty,
            examples,
            constraints,
            starterCode,
            testCases,
            companyTags,
        } = req.body;

        const question =
            await DSAQuestion.create({
                title,
                description,
                topic,
                difficulty,
                examples:
                    examples || [],
                constraints:
                    constraints || [],
                starterCode:
                    starterCode || "",
                testCases:
                    testCases || [],
                companyTags:
                    companyTags || [],
            });

        return res.status(201).json({
            success: true,
            message:
                "Question created successfully",
            data: question,
        });
    } catch (error) {
        console.error(
            "Create question error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to create question",
        });
    }
};

// ==========================================
// UPDATE QUESTION
// ==========================================

const updateQuestion = async (req, res) => {
    try {
        const question =
            await DSAQuestion.findById(
                req.params.id
            );

        if (!question) {
            return res.status(404).json({
                success: false,
                message: "Question not found",
            });
        }

        const {
            title,
            description,
            topic,
            difficulty,
            examples,
            constraints,
            starterCode,
            testCases,
            companyTags,
        } = req.body;

        if (title !== undefined) {
            question.title =
                title.trim();
        }

        if (description !== undefined) {
            question.description =
                description;
        }

        if (topic !== undefined) {
            question.topic = topic;
        }

        if (difficulty !== undefined) {
            question.difficulty =
                difficulty;
        }

        if (examples !== undefined) {
            question.examples =
                examples;
        }

        if (constraints !== undefined) {
            question.constraints =
                constraints;
        }

        if (starterCode !== undefined) {
            question.starterCode =
                starterCode;
        }

        if (testCases !== undefined) {
            question.testCases =
                testCases;
        }

        if (companyTags !== undefined) {
            question.companyTags =
                companyTags;
        }

        await question.save();

        return res.status(200).json({
            success: true,
            message:
                "Question updated successfully",
            data: question,
        });
    } catch (error) {
        console.error(
            "Update question error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to update question",
        });
    }
};

// ==========================================
// DELETE QUESTION
// ==========================================

const deleteQuestion = async (req, res) => {
    try {
        const question =
            await DSAQuestion.findById(
                req.params.id
            );

        if (!question) {
            return res.status(404).json({
                success: false,
                message: "Question not found",
            });
        }

        await DSAQuestion.findByIdAndDelete(
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message:
                "Question deleted successfully",
        });
    } catch (error) {
        console.error(
            "Delete question error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to delete question",
        });
    }
};

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
    getQuestions,
    getQuestionById,
    createQuestion,
    updateQuestion,
    deleteQuestion,
};