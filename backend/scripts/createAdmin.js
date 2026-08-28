require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

const ADMIN_NAME = "Subhamoy saha";
const ADMIN_EMAIL = "subhamoy@admin.com";
const ADMIN_PASSWORD = "Subhamoy@1234";

const createAdmin = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined in .env");
        }

        console.log("Connecting to MongoDB...");

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected.");

        const existingUser = await User.findOne({
            email: ADMIN_EMAIL,
        });

        if (existingUser) {
            console.log(
                `User already exists: ${ADMIN_EMAIL}`
            );

            if (existingUser.role !== "admin") {
                existingUser.role = "admin";
                await existingUser.save();

                console.log(
                    "Existing user has been promoted to admin."
                );
            } else {
                console.log(
                    "This user is already an admin."
                );
            }

            await mongoose.disconnect();

            console.log("MongoDB disconnected.");

            return;
        }

        const hashedPassword = await bcrypt.hash(
            ADMIN_PASSWORD,
            10
        );

        const admin = await User.create({
            name: ADMIN_NAME,
            email: ADMIN_EMAIL,
            password: hashedPassword,
            role: "admin",
            college: "",
            branch: "",
            graduationYear: null,
            skills: [],
            profileImage: "",
        });

        console.log("");
        console.log("======================================");
        console.log("     ADMIN CREATED SUCCESSFULLY");
        console.log("======================================");
        console.log("Name     :", admin.name);
        console.log("Email    :", admin.email);
        console.log("Password :", ADMIN_PASSWORD);
        console.log("Role     :", admin.role);
        console.log("======================================");
        console.log("");

        await mongoose.disconnect();

        console.log("MongoDB disconnected.");
    } catch (error) {
        console.error("");
        console.error("======================================");
        console.error("       FAILED TO CREATE ADMIN");
        console.error("======================================");
        console.error(error.message);
        console.error("======================================");

        try {
            await mongoose.disconnect();
        } catch (disconnectError) {
            // Ignore disconnect errors
        }

        process.exit(1);
    }
};

createAdmin();