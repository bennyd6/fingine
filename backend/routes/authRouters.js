import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import dotenv from "dotenv";  // Import dotenv to load environment variables
import authMiddleware from "../middleware/authMiddleware.js";

dotenv.config();  // Ensure environment variables are loaded

const router = express.Router();

// Test route
router.get("/", (req, res) => {
  res.status(200).json({ message: "API is running" });
});

// User Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Fix the JWT secret usage
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error('Login Error:', error.message); // Log the error for debugging
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// User Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, phone, organization } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "Name, email, password, and role are required" });
    }

    // Optional fields validation
    if (phone && typeof phone !== 'string') {
      return res.status(400).json({ error: "Phone must be a string" });
    }
    if (organization && typeof organization !== 'string') {
      return res.status(400).json({ error: "Organization must be a string" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create a new user with the additional fields
    const newUser = new User({ name, email, password, role, phone, organization });
    await newUser.save();

    // Create JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "10h",
    });

    // Send the response with success message and token
    res.status(201).json({ message: "User registered successfully", token });

  } catch (error) {
    console.error('Registration Error:', error.message); // Log the error for debugging
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// Protected Route Example
router.post("/", authMiddleware, (req, res) => {
  const { id } = req.user;
  console.log("User authenticated with ID:", id);

  return res.json({
    message: "User authenticated successfully",
    id,
  });
});

// Fetch User Details
router.post('/getuser', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('name email password');
    
    if (!user) return res.status(404).send('User not found');

    res.json(user.name);
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
