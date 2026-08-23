require("dotenv").config();

const bcrypt = require("bcryptjs");

const connectDB = require("../config/db");
const User = require("../models/User");

const createAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = "admin@placement-platform.com";
    const adminPassword = "Admin@123456";

    const existingAdmin = await User.findOne({
      email: adminEmail,
    });

    if (existingAdmin) {
      console.log("Admin account already exists.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(
      adminPassword,
      10
    );

    const admin = await User.create({
      name: "Platform Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      college: "Placement Platform",
      branch: "Administration",
      graduationYear: null,
      skills: [],
      profileImage: "",
    });

    console.log("Admin account created successfully.");
    console.log(`Email: ${admin.email}`);
    console.log("Password: Admin@123456");
    console.log(`ID: ${admin._id}`);

    process.exit(0);
  } catch (error) {
    console.error("Failed to create admin:", error.message);
    process.exit(1);
  }
};

createAdmin();