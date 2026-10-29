const MockInterview = require("../models/MockInterview");

// =========================================
// GET ALL MOCK INTERVIEWS
// =========================================
const getMockInterviews = async (req, res) => {
    try {
        const mockInterviews = await MockInterview.find()
            .populate("questions", "question category difficulty")
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Mock interviews fetched successfully",
            data: mockInterviews,
        });
    } catch (error) {
        console.error("GET MOCK INTERVIEWS ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch mock interviews",
        });
    }
};


// =========================================
// GET MOCK INTERVIEW BY ID
// =========================================
const getMockInterviewById = async (req, res) => {
    try {
        const { id } = req.params;

        const mockInterview = await MockInterview.findById(id)
            .populate("questions", "question category difficulty")
            .populate("createdBy", "name email");

        if (!mockInterview) {
            return res.status(404).json({
                success: false,
                message: "Mock interview not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Mock interview fetched successfully",
            data: mockInterview,
        });
    } catch (error) {
        console.error("GET MOCK INTERVIEW ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch mock interview",
        });
    }
};


// =========================================
// CREATE MOCK INTERVIEW
// =========================================
const createMockInterview = async (req, res) => {
    try {
        console.log("CREATE MOCK INTERVIEW");
        console.log("User:", req.user);
        console.log("Body:", req.body);

        const {
            title,
            description,
            category,
            difficulty,
            duration,
            instructions,
            questions,
            isPublished,
        } = req.body;

        // Validate title
        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Mock interview title is required",
            });
        }

        // Validate authenticated user
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "Authenticated user not found",
            });
        }

        const mockInterview = await MockInterview.create({
            title: title.trim(),
            description: description || "",
            category: category || "Technical",
            difficulty: difficulty || "Medium",
            duration: Number(duration) || 30,
            instructions: instructions || "",
            questions: Array.isArray(questions) ? questions : [],
            isPublished: Boolean(isPublished),
            createdBy: req.user._id,
        });

        const populatedInterview = await MockInterview.findById(
            mockInterview._id
        )
            .populate("questions", "question category difficulty")
            .populate("createdBy", "name email");

        return res.status(201).json({
            success: true,
            message: "Mock interview created successfully",
            data: populatedInterview,
        });
    } catch (error) {
        console.error("CREATE MOCK INTERVIEW ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to create mock interview",
        });
    }
};


// =========================================
// UPDATE MOCK INTERVIEW
// =========================================
const updateMockInterview = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            title,
            description,
            category,
            difficulty,
            duration,
            instructions,
            questions,
            isPublished,
        } = req.body;

        const mockInterview = await MockInterview.findById(id);

        if (!mockInterview) {
            return res.status(404).json({
                success: false,
                message: "Mock interview not found",
            });
        }

        if (title !== undefined) {
            if (!title.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Mock interview title is required",
                });
            }

            mockInterview.title = title.trim();
        }

        if (description !== undefined) {
            mockInterview.description = description;
        }

        if (category !== undefined) {
            mockInterview.category = category;
        }

        if (difficulty !== undefined) {
            mockInterview.difficulty = difficulty;
        }

        if (duration !== undefined) {
            mockInterview.duration = Number(duration);
        }

        if (instructions !== undefined) {
            mockInterview.instructions = instructions;
        }

        if (questions !== undefined) {
            mockInterview.questions = Array.isArray(questions)
                ? questions
                : [];
        }

        if (isPublished !== undefined) {
            mockInterview.isPublished = Boolean(isPublished);
        }

        await mockInterview.save();

        const updatedInterview = await MockInterview.findById(id)
            .populate("questions", "question category difficulty")
            .populate("createdBy", "name email");

        res.status(200).json({
            success: true,
            message: "Mock interview updated successfully",
            data: updatedInterview,
        });
    } catch (error) {
        console.error("UPDATE MOCK INTERVIEW ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message || "Failed to update mock interview",
        });
    }
};


// =========================================
// DELETE MOCK INTERVIEW
// =========================================
const deleteMockInterview = async (req, res) => {
    try {
        const { id } = req.params;

        const mockInterview = await MockInterview.findById(id);

        if (!mockInterview) {
            return res.status(404).json({
                success: false,
                message: "Mock interview not found",
            });
        }

        await MockInterview.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Mock interview deleted successfully",
        });
    } catch (error) {
        console.error("DELETE MOCK INTERVIEW ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message || "Failed to delete mock interview",
        });
    }
};


// =========================================
// EXPORT
// =========================================
module.exports = {
    getMockInterviews,
    getMockInterviewById,
    createMockInterview,
    updateMockInterview,
    deleteMockInterview,
};