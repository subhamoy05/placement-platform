const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const generateToken = (userId) => {
	return jwt.sign(
		{
			userId,
		},
		process.env.JWT_SECRET,
		{
			expiresIn: "7d",
		},
	);
};

const register = async (req, res) => {
	try {
		const { name, email, password, college, branch, graduationYear } = req.body;

		if (!name || !email || !password) {
			return res.status(400).json({
				success: false,
				message: "Name, email and password are required",
			});
		}

		if (password.length < 6) {
			return res.status(400).json({
				success: false,
				message: "Password must be at least 6 characters",
			});
		}

		const normalizedEmail = email.toLowerCase().trim();

		const existingUser = await User.findOne({
			email: normalizedEmail,
		});

		if (existingUser) {
			return res.status(409).json({
				success: false,
				message: "Email is already registered",
			});
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await User.create({
			name: name.trim(),
			email: normalizedEmail,
			password: hashedPassword,
			college: college?.trim() || "",
			branch: branch?.trim() || "",
			graduationYear: graduationYear || null,
			role: "student",
		});

		const token = generateToken(user._id);

		return res.status(201).json({
			success: true,
			message: "Registration successful",
			data: {
				token,
				user: {
					id: user._id,
					name: user.name,
					email: user.email,
					role: user.role,
					college: user.college,
					branch: user.branch,
					graduationYear: user.graduationYear,
				},
			},
		});
	} catch (error) {
		console.error("Registration error:", error);

		return res.status(500).json({
			success: false,
			message: "Server error during registration",
		});
	}
};

const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({
				success: false,
				message: "Email and password are required",
			});
		}

		const normalizedEmail = email.toLowerCase().trim();

		const user = await User.findOne({
			email: normalizedEmail,
		});

		if (!user) {
			return res.status(401).json({
				success: false,
				message: "Invalid email or password",
			});
		}

		const passwordMatch = await bcrypt.compare(password, user.password);

		if (!passwordMatch) {
			return res.status(401).json({
				success: false,
				message: "Invalid email or password",
			});
		}

		const token = generateToken(user._id);

		return res.status(200).json({
			success: true,
			message: "Login successful",
			data: {
				token,
				user: {
					id: user._id,
					name: user.name,
					email: user.email,
					role: user.role,
					college: user.college,
					branch: user.branch,
					graduationYear: user.graduationYear,
				},
			},
		});
	} catch (error) {
		console.error("Login error:", error);

		return res.status(500).json({
			success: false,
			message: "Server error during login",
		});
	}
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching user",
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
};