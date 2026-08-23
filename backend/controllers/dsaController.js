const DSAQuestion = require("../models/DSAQuestion");

const getDSAQuestions = async (req, res) => {
  try {
    const { topic, difficulty, company, search } = req.query;

    const filter = {};

    if (topic) {
      filter.topic = topic;
    }

    if (difficulty) {
      filter.difficulty = difficulty;
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

    const questions = await DSAQuestion.find(filter)
      .select("-testCases")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: {
        questions,
      },
    });
  } catch (error) {
    console.error("Get DSA questions error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching DSA questions",
    });
  }
};

const getDSAQuestionById = async (req, res) => {
  try {
    const question = await DSAQuestion.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "DSA question not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        question,
      },
    });
  } catch (error) {
    console.error("Get DSA question error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching DSA question",
    });
  }
};

const createDSAQuestion = async (req, res) => {
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

    if (!title || !description || !topic || !difficulty) {
      return res.status(400).json({
        success: false,
        message:
          "Title, description, topic and difficulty are required",
      });
    }

    const question = await DSAQuestion.create({
      title: title.trim(),
      description,
      topic,
      difficulty,
      examples: examples || [],
      constraints: constraints || [],
      starterCode: starterCode || "",
      testCases: testCases || [],
      companyTags: companyTags || [],
    });

    return res.status(201).json({
      success: true,
      message: "DSA question created successfully",
      data: {
        question,
      },
    });
  } catch (error) {
    console.error("Create DSA question error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating DSA question",
    });
  }
};

const updateDSAQuestion = async (req, res) => {
  try {
    const question = await DSAQuestion.findById(
      req.params.id
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "DSA question not found",
      });
    }

    const allowedFields = [
      "title",
      "description",
      "topic",
      "difficulty",
      "examples",
      "constraints",
      "starterCode",
      "testCases",
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
      message: "DSA question updated successfully",
      data: {
        question,
      },
    });
  } catch (error) {
    console.error("Update DSA question error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating DSA question",
    });
  }
};

const deleteDSAQuestion = async (req, res) => {
  try {
    const question = await DSAQuestion.findById(
      req.params.id
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "DSA question not found",
      });
    }

    await question.deleteOne();

    return res.status(200).json({
      success: true,
      message: "DSA question deleted successfully",
    });
  } catch (error) {
    console.error("Delete DSA question error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting DSA question",
    });
  }
};

module.exports = {
  getDSAQuestions,
  getDSAQuestionById,
  createDSAQuestion,
  updateDSAQuestion,
  deleteDSAQuestion,
};