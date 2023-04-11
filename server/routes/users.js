const express = require("express");
const multer = require("multer");
const { Op } = require("sequelize");
const { User, Activity } = require("../models/userModel");
const verifyToken = require("../verifyToken");
const { createActivityLog, currentDate } = require("./primary");

const router = express.Router();

// Set up file upload using Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profile/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, ""));
  },
});

const upload = multer({ storage: storage });

// Get all users /users EXCEPT The current User
router.get("/", verifyToken, async (req, res) => {
  const user_id = req.userId;
  try {
    const users = await User.findAll({
      where: {
        id: {
          [Op.not]: user_id, // select all users except with id
        },
      },
    });

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving users");
  }
});

// Get Current User Profile
router.get("/profile", verifyToken, async (req, res) => {
  const user_id = req.userId;
  try {
    const user = await User.findOne({
      where: { id: user_id },
      attributes: { exclude: ["password"] },
    });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    res.status(500).send("Error retrieving user");
  }
});

// Get a user by ID /users/:id
router.get("/profile/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findOne({
      where: { id: id },
      attributes: { exclude: ["password"] },
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving user");
  }
});

// Handle POST requests to /updateProfileImage
router.post(
  "/updateProfileImage",
  upload.single("profile_img"),
  async (req, res) => {
    try {
      const input = {
        user_id: req.body.user_id,
        profile_img: process.env.BASE_URL + req.file.path,
      };

      const user = await User.findOne({ where: { id: input.user_id } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.profile_img = input.profile_img;
      await user.save();

      const updatedUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        profile_img: user.profile_img,
        bg_img: user.bg_img,
      };

      createActivityLog(user.id, "changed their profile picture");
      res.json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
);

// Handle POST requests to /updateCoverImage
router.post("/updateCoverImage", upload.single("bg_img"), async (req, res) => {
  try {
    const input = {
      user_id: req.body.user_id,
      bg_img: process.env.BASE_URL + req.file.path,
    };

    const user = await User.findOne({ where: { id: input.user_id } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.bg_img = input.bg_img;
    await user.save();
    const updatedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      profile_img: user.profile_img,
      bg_img: user.bg_img,
    };
    createActivityLog(user.id, "changed their cover picture");
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
