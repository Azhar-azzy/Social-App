const express = require("express");
const multer = require("multer");
const {
  Sequelize,
  Post,
  User,
  Activity,
  PostComments,
} = require("../models/userModel");
const verifyToken = require("../verifyToken");
const { createActivityLog, currentDate } = require("./primary");

const router = express.Router();

// Set up file upload using Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, ""));
  },
});

const upload = multer({ storage: storage });

// Handle POST requests to /posts/
router.post("/", upload.single("image"), async (req, res) => {
  const image = {
    user_id: req.body.user_id,
    image: req.file ? process.env.BASE_URL + req.file.path : null,
    text: req.body.text,
    upload_datetime: currentDate(),
  };

  try {
    const response = await Post.create(image);
    const data = response.toJSON();
    const post = await Post.findOne({
      where: { id: data.id },
      include: [
        {
          model: User,
          attributes: ["id", "name", "email", "profile_img"],
        },
        {
          model: PostComments,
          attributes: ["id", "comment", "created_at"],
          include: {
            model: User,
            attributes: ["id", "name", "profile_img"],
          },
        },
      ],
      attributes: [
        "id",
        "image",
        "text",
        "upload_datetime",
        [
          Sequelize.literal(
            `(SELECT COUNT(*) FROM post_likes WHERE post_likes.post_id = posts.id AND post_likes.is_liked = 1)`
          ),
          "like_count",
        ],
        [
          Sequelize.literal(
            `(SELECT is_liked FROM post_likes WHERE post_likes.post_id = posts.id AND post_likes.user_id = ${image.user_id})`
          ),
          "is_liked",
        ],
      ],
      order: [
        ["id", "DESC"],
        ["post_comments", "id", "DESC"],
      ],
    });
    createActivityLog(data.id, "created a new post");
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// GET All POSTS /posts
router.get("/", verifyToken, async (req, res) => {
  try {
    const user_id = req.userId;
    const posts = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "name", "email", "profile_img"],
        },
        {
          model: PostComments,
          attributes: ["id", "comment", "created_at"],
          include: {
            model: User,
            attributes: ["id", "name", "profile_img"],
          },
        },
      ],
      attributes: [
        "id",
        "image",
        "text",
        "upload_datetime",
        [
          Sequelize.literal(
            `(SELECT COUNT(*) FROM post_likes WHERE post_likes.post_id = posts.id AND post_likes.is_liked = 1)`
          ),
          "like_count",
        ],
        [
          Sequelize.literal(
            `(SELECT is_liked FROM post_likes WHERE post_likes.post_id = posts.id AND post_likes.user_id = ${user_id})`
          ),
          "is_liked",
        ],
      ],
      order: [
        ["id", "DESC"],
        ["post_comments", "id", "DESC"],
      ],
    });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving posts");
  }
});

// GET All POSTS OF USER /posts/:id
router.get("/:userId", verifyToken, async (req, res) => {
  const user_id = req.params.userId;
  try {
    const posts = await Post.findAll({
      where: { user_id },
      include: [
        {
          model: User,
          attributes: ["id", "name", "email", "profile_img"],
        },
        {
          model: PostComments,
          attributes: ["id", "comment", "created_at"],
          include: {
            model: User,
            attributes: ["id", "name", "profile_img"],
          },
        },
      ],
      attributes: [
        "id",
        "image",
        "text",
        "upload_datetime",
        [
          Sequelize.literal(
            `(SELECT COUNT(*) FROM post_likes WHERE post_likes.post_id = posts.id AND post_likes.is_liked = 1)`
          ),
          "like_count",
        ],
        [
          Sequelize.literal(
            `(SELECT is_liked FROM post_likes WHERE post_likes.post_id = posts.id AND post_likes.user_id = ${user_id})`
          ),
          "is_liked",
        ],
      ],
      order: [
        ["id", "DESC"],
        ["post_comments", "id", "DESC"],
      ],
    });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving posts");
  }
});

module.exports = router;
