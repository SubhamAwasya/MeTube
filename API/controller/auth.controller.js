import { User } from "../models/models.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import dotenv from "dotenv";
dotenv.config();

/**
 * Login Controller
 * Handles user login by validating credentials, generating a JWT token,
 * and returning user information if the credentials are valid.
 */

const Login = async (req, res) => {
  console.log("---------- Login controller started ----------------");

  try {
    const { email, password } = req.body;
    console.log(req.body);

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Create JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, username: user.username },
      process.env.JWT_SECRET, // make sure you have this set in your .env
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        token,
      },
    });
  } catch (error) {
    console.error("auth.controller error => ", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }

  console.log("---------- Login controller ended ------------------");
};

/**
 * Logout Controller
 * Handles user logout by clearing authentication cookies and returning a success message.
 */
const Logout = async (req, res) => {
  console.log("---------- Logout controller started ---------------");

  try {
    // If using cookies to store token
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    console.error("auth.controller error => ", error);
    res.status(500).json({ message: "Server error during logout." });
  }

  console.log("---------- Logout controller ended -----------------");
};

/**
 * Register Controller
 * Handles new user registration by validating input, checking for an existing user,
 * hashing the password, and saving the new user to the database.
 */
const Register = async (req, res) => {
  console.log("---------- Register controller started -------------");

  try {
    const { username, email, password } = req.body;
    console.log({ username, email, password });

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("auth.controller error => ", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }

  console.log("---------- Register controller ended ---------------");
};

export { Login, Logout, Register };
