const SQLQuestion = require("../models/SQLQuestion");

const getSQLQuestions = async (req, res) => {
  try {
    const { difficulty, category, company, search } = req.query;

    const filter = {};

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    if (category) {
      filter.category = category;
    }

    if (company) {
      filter.companyTags = company;
    }

    if (search) {
      filter.title = {
        $regex: search,
        $options: "i",
      };
    }

    const questions = await SQLQuestion.find(filter).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: {
        questions,
      },
    });
  } catch (error) {
    console.error("Get SQL questions error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching SQL questions",
    });
  }
};

const getSQLQuestionById = async (req, res) => {
  try {
    const question = await SQLQuestion.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "SQL question not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        question,
      },
    });
  } catch (error) {
    console.error("Get SQL question error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching SQL question",
    });
  }
};

const createSQLQuestion = async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      category,
      schema,
      sampleData,
      expectedQueryResult,
      companyTags,
    } = req.body;

    if (
      !title ||
      !description ||
      !difficulty ||
      !category ||
      !schema ||
      !sampleData ||
      !expectedQueryResult
    ) {
      return res.status(400).json({
        success: false,
        message: "All required SQL question fields must be provided",
      });
    }

    const question = await SQLQuestion.create({
      title: title.trim(),
      description,
      difficulty,
      category,
      schema,
      sampleData,
      expectedQueryResult,
      companyTags: companyTags || [],
    });

    return res.status(201).json({
      success: true,
      message: "SQL question created successfully",
      data: {
        question,
      },
    });
  } catch (error) {
    console.error("Create SQL question error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating SQL question",
    });
  }
};

const updateSQLQuestion = async (req, res) => {
  try {
    const question = await SQLQuestion.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "SQL question not found",
      });
    }

    const allowedFields = [
      "title",
      "description",
      "difficulty",
      "category",
      "schema",
      "sampleData",
      "expectedQueryResult",
      "companyTags",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        question[field] = req.body[field];
      }
    });

    await question.save();

    return res.status(200).json({
      success: true,
      message: "SQL question updated successfully",
      data: {
        question,
      },
    });
  } catch (error) {
    console.error("Update SQL question error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating SQL question",
    });
  }
};

const deleteSQLQuestion = async (req, res) => {
  try {
    const question = await SQLQuestion.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "SQL question not found",
      });
    }

    await question.deleteOne();

    return res.status(200).json({
      success: true,
      message: "SQL question deleted successfully",
    });
  } catch (error) {
    console.error("Delete SQL question error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting SQL question",
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