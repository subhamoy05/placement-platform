const Assessment = require("../models/Assessment");
const Company = require("../models/Company");

const getAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find()
      .populate("questions", "title topic difficulty")
      .populate("company", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: {
        assessments,
      },
    });
  } catch (error) {
    console.error("Get assessments error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching assessments",
    });
  }
};

const getAssessmentById = async (req, res) => {
  try {
    const assessment = await Assessment.findById(
      req.params.id
    )
      .populate("questions", "title description topic difficulty examples constraints starterCode")
      .populate("company", "name");

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        assessment,
      },
    });
  } catch (error) {
    console.error("Get assessment error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching assessment",
    });
  }
};

const createAssessment = async (req, res) => {
  try {
    const {
      title,
      description,
      duration,
      questions,
      totalMarks,
      difficulty,
      company,
    } = req.body;

    if (
      !title ||
      !description ||
      !duration ||
      !totalMarks ||
      !difficulty
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, description, duration, total marks and difficulty are required",
      });
    }

    const assessment = await Assessment.create({
      title: title.trim(),
      description,
      duration,
      questions: questions || [],
      totalMarks,
      difficulty,
      company: company || null,
    });

    return res.status(201).json({
      success: true,
      message: "Assessment created successfully",
      data: {
        assessment,
      },
    });
  } catch (error) {
    console.error("Create assessment error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating assessment",
    });
  }
};

const updateAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findById(
      req.params.id
    );

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found",
      });
    }

    const allowedFields = [
      "title",
      "description",
      "duration",
      "questions",
      "totalMarks",
      "difficulty",
      "company",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        assessment[field] = req.body[field];
      }
    });

    await assessment.save();

    return res.status(200).json({
      success: true,
      message: "Assessment updated successfully",
      data: {
        assessment,
      },
    });
  } catch (error) {
    console.error("Update assessment error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating assessment",
    });
  }
};

const deleteAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findById(
      req.params.id
    );

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found",
      });
    }

    await assessment.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Assessment deleted successfully",
    });
  } catch (error) {
    console.error("Delete assessment error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting assessment",
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