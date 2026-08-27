const User = require("../models/User");

const getStudents = async (req, res) => {
	try {
		const students = await User.find({
			role: "student",
		})
			.select("-password")
			.sort({ createdAt: -1 });

		return res.status(200).json({
			success: true,
			count: students.length,
			data: students,
		});
	} catch (error) {
		console.error("Get students error:", error);

		return res.status(500).json({
			success: false,
			message: "Failed to fetch students",
		});
	}
};

const getStudentById = async (req, res) => {
	try {
		const student = await User.findOne({
			_id: req.params.id,
			role: "student",
		}).select("-password");

		if (!student) {
			return res.status(404).json({
				success: false,
				message: "Student not found",
			});
		}

		return res.status(200).json({
			success: true,
			data: student,
		});
	} catch (error) {
		console.error("Get student error:", error);

		return res.status(500).json({
			success: false,
			message: "Failed to fetch student",
		});
	}
};

const updateStudent = async (req, res) => {
	try {
		const student = await User.findOne({
			_id: req.params.id,
			role: "student",
		});

		if (!student) {
			return res.status(404).json({
				success: false,
				message: "Student not found",
			});
		}

		const { name, email, college, branch, graduationYear, skills } = req.body;

		if (name !== undefined) {
			student.name = name;
		}

		if (email !== undefined) {
			student.email = email;
		}

		if (college !== undefined) {
			student.college = college;
		}

		if (branch !== undefined) {
			student.branch = branch;
		}

		if (graduationYear !== undefined) {
			student.graduationYear = graduationYear === "" ? null : graduationYear;
		}

		if (skills !== undefined) {
			student.skills = skills;
		}

		await student.save();

		const updatedStudent = await User.findById(student._id).select("-password");

		return res.status(200).json({
			success: true,
			message: "Student updated successfully",
			data: updatedStudent,
		});
	} catch (error) {
		console.error("Update student error:", error);

		return res.status(500).json({
			success: false,
			message: "Failed to update student",
		});
	}
};

const deleteStudent = async (req, res) => {
	try {
		const student = await User.findOne({
			_id: req.params.id,
			role: "student",
		});

		if (!student) {
			return res.status(404).json({
				success: false,
				message: "Student not found",
			});
		}

		await User.findByIdAndDelete(student._id);

		return res.status(200).json({
			success: true,
			message: "Student deleted successfully",
		});
	} catch (error) {
		console.error("Delete student error:", error);

		return res.status(500).json({
			success: false,
			message: "Failed to delete student",
		});
	}
};

module.exports = {
    getStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
};