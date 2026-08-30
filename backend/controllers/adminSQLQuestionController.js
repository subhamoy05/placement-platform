const SQLQuestion = require("../models/SQLQuestion");

// ==========================================
// GET ALL SQL QUESTIONS
// ==========================================

const getSQLQuestions = async (req, res) => {
    try {
        const questions = await SQLQuestion.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: questions.length,
            data: questions,
        });
    } catch (error) {
        console.error("Get SQL questions error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch SQL questions",
        });
    }
};

// ==========================================
// GET SQL QUESTION BY ID
// ==========================================

const getSQLQuestionById = async (req, res) => {
    try {
        const question = await SQLQuestion.findById(req.params.id);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: "SQL question not found",
            });
        }

        res.status(200).json({
            success: true,
            data: question,
        });
    } catch (error) {
        console.error("Get SQL question error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch SQL question",
        });
    }
};

// ==========================================
// CREATE SQL QUESTION
// ==========================================

const createSQLQuestion = async (req, res) => {
    try {
        const question = await SQLQuestion.create(req.body);

        res.status(201).json({
            success: true,
            message: "SQL question created successfully",
            data: question,
        });
    } catch (error) {
        console.error("Create SQL question error:", error);

        res.status(400).json({
            success: false,
            message: error.message || "Failed to create SQL question",
        });
    }
};

// ==========================================
// UPDATE SQL QUESTION
// ==========================================

const updateSQLQuestion = async (req, res) => {
    try {
        const question = await SQLQuestion.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!question) {
            return res.status(404).json({
                success: false,
                message: "SQL question not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "SQL question updated successfully",
            data: question,
        });
    } catch (error) {
        console.error("Update SQL question error:", error);

        res.status(400).json({
            success: false,
            message: error.message || "Failed to update SQL question",
        });
    }
};

// ==========================================
// DELETE SQL QUESTION
// ==========================================

const deleteSQLQuestion = async (req, res) => {
    try {
        const question = await SQLQuestion.findByIdAndDelete(
            req.params.id
        );

        if (!question) {
            return res.status(404).json({
                success: false,
                message: "SQL question not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "SQL question deleted successfully",
        });
    } catch (error) {
        console.error("Delete SQL question error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete SQL question",
        });
    }
};

module.exports = {
    getSQLQuestions,
    getSQLQuestionById,
    createSQLQuestion,
    updateSQLQuestion,
    deleteSQLQuestion,
};