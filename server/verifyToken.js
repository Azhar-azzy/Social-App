const jwt = require("jsonwebtoken");
require("dotenv").config();

// Middleware function to verify user token
const verifyToken = (req, res, next) => {
  // Get the user token from the request headers
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Authorization token is missing" });
  }

  try {
    // Verify the token and retrieve the user ID
    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    // Add the user ID to the request object
    req.userId = id;

    // Call the next middleware function
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid authorization token" });
  }
};

module.exports = verifyToken;
