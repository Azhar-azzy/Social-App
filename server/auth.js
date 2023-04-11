const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("./models/userModel");

const router = express.Router();
require("dotenv").config();

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user with the provided email address
    const user = await User.findOne({
      where: { email },
    });

    // If user not found, return an error
    if (!user) {
      return res.status(401).send("Invalid email or password");
    }

    // Check if password matches
    const passwordMatch = await bcrypt.compare(password, user.password);

    // If password doesn't match, return an error
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // If user and password are valid, generate and return a JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error logging in");
  }
});

// Register route
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }
  try {
    // Check if email is already in use
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email address is already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the hashed password
    const user = await User.create({
      name,
      email,
      profile_img: process.env.DUMMY_PROFILE_IMG,
      bg_img: process.env.DUMMY_COVER_IMG,
      password: hashedPassword,
    });

    res.json({ message: "User registered successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.post("/logout", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    await invalidateToken(token);
    res.status(200).json({ message: "User logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error logging out" });
  }
});

async function invalidateToken(token) {
  // Store the token in a blacklist to prevent its usage
  await BlacklistedToken.create({ token });
}

module.exports = router;
