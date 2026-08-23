const Company = require("../models/Company");
const Assessment = require("../models/Assessment");
const DSAQuestion = require("../models/DSAQuestion");

const getCompanies = async (req, res) => {
	try {
		const companies = await Company.find().select("-questions").sort({ name: 1 });

		return res.status(200).json({
			success: true,
			data: {
				companies,
			},
		});
	} catch (error) {
		console.error("Get companies error:", error);

		return res.status(500).json({
			success: false,
			message: "Server error while fetching companies",
		});
	}
};

const getCompanyById = async (req, res) => {
	try {
		const company = await Company.findById(req.params.id).populate("questions", "title topic difficulty companyTags");

		if (!company) {
			return res.status(404).json({
				success: false,
				message: "Company not found",
			});
		}

		return res.status(200).json({
			success: true,
			data: {
				company,
			},
		});
	} catch (error) {
		console.error("Get company error:", error);

		return res.status(500).json({
			success: false,
			message: "Server error while fetching company",
		});
	}
};

const createCompany = async (req, res) => {
	try {
		const { name, description, eligibility, package: salaryPackage, difficulty, rounds, topics, questions } = req.body;

		if (!name || !description || !difficulty) {
			return res.status(400).json({
				success: false,
				message: "Name, description and difficulty are required",
			});
		}

		const existingCompany = await Company.findOne({
			name: name.trim(),
		});

		if (existingCompany) {
			return res.status(409).json({
				success: false,
				message: "Company already exists",
			});
		}

		const company = await Company.create({
			name: name.trim(),
			description,
			eligibility: eligibility || [],
			package: salaryPackage || "",
			difficulty,
			rounds: rounds || [],
			topics: topics || [],
			questions: questions || [],
		});

		return res.status(201).json({
			success: true,
			message: "Company created successfully",
			data: {
				company,
			},
		});
	} catch (error) {
		console.error("Create company error:", error);

		return res.status(500).json({
			success: false,
			message: "Server error while creating company",
		});
	}
};

const updateCompany = async (req, res) => {
	try {
		const company = await Company.findById(req.params.id);

		if (!company) {
			return res.status(404).json({
				success: false,
				message: "Company not found",
			});
		}

		const allowedFields = ["name", "description", "eligibility", "package", "difficulty", "rounds", "topics", "questions"];

		allowedFields.forEach((field) => {
			if (req.body[field] !== undefined) {
				company[field] = req.body[field];
			}
		});

		await company.save();

		return res.status(200).json({
			success: true,
			message: "Company updated successfully",
			data: {
				company,
			},
		});
	} catch (error) {
		console.error("Update company error:", error);

		return res.status(500).json({
			success: false,
			message: "Server error while updating company",
		});
	}
};

const deleteCompany = async (req, res) => {
	try {
		const company = await Company.findById(req.params.id);

		if (!company) {
			return res.status(404).json({
				success: false,
				message: "Company not found",
			});
		}

		await company.deleteOne();

		return res.status(200).json({
			success: true,
			message: "Company deleted successfully",
		});
	} catch (error) {
		console.error("Delete company error:", error);

		return res.status(500).json({
			success: false,
			message: "Server error while deleting company",
		});
	}
};
const getCompanyDashboard = async (req, res) => {
	try {
		const company = await Company.findById(req.params.id).select("-questions").lean();

		if (!company) {
			return res.status(404).json({
				success: false,
				message: "Company not found",
			});
		}

		const questions = await DSAQuestion.find({
			companyTags: company.name,
		})
			.select("title description topic difficulty companyTags")
			.sort({ createdAt: -1 });

		const assessments = await Assessment.find({
			company: company._id,
		})
			.select("title description duration totalMarks difficulty")
			.sort({ createdAt: -1 });

		return res.status(200).json({
			success: true,
			data: {
				company,
				questions,
				assessments,
				statistics: {
					totalQuestions: questions.length,
					totalAssessments: assessments.length,
					totalTopics: company.topics ? company.topics.length : 0,
					totalRounds: company.rounds ? company.rounds.length : 0,
				},
			},
		});
	} catch (error) {
		console.error("Get company dashboard error:", error.message);

		return res.status(500).json({
			success: false,
			message: "Server error while fetching company dashboard",
		});
	}
};
module.exports = {
  getCompanies,
  getCompanyById,
  getCompanyDashboard,
  createCompany,
  updateCompany,
  deleteCompany,
};