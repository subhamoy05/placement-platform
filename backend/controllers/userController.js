const User = require("../models/User");

const getProfile = async (req, res) => {
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
    console.error("Get profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching profile",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const {
      name,
      college,
      branch,
      graduationYear,
      skills,
      profileImage,
    } = req.body;

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name !== undefined) {
      user.name = name.trim();
    }

    if (college !== undefined) {
      user.college = college.trim();
    }

    if (branch !== undefined) {
      user.branch = branch.trim();
    }

    if (graduationYear !== undefined) {
      user.graduationYear = graduationYear;
    }

    if (skills !== undefined) {
      user.skills = Array.isArray(skills) ? skills : [];
    }

    if (profileImage !== undefined) {
      user.profileImage = profileImage;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          college: user.college,
          branch: user.branch,
          graduationYear: user.graduationYear,
          skills: user.skills,
          profileImage: user.profileImage,
        },
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating profile",
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};