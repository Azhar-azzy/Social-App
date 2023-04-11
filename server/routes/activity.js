const express = require("express");
const {
  User,
  Activity,
  Post,
  PostLikes,
  PostComments,
} = require("../models/userModel");
const verifyToken = require("../verifyToken");

const router = express.Router();

// GET All Activity Logs /activity
router.get("/", verifyToken, async (req, res) => {
  try {
    const response = await Activity.findAll({
      include: {
        model: User,
        attributes: ["id", "name", "email", "profile_img"],
      },
      attributes: ["id", "activity", "created_at"],
      order: [["id", "DESC"]],
    });
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving activities" });
  }
});

// POST: Like Unlike Posts /togglePostLike
router.post("/togglePostLike", verifyToken, async (req, res) => {
  try {
    const user_id = req.userId;
    const post_id = req.body.post_id;

    const postLikes = await PostLikes.findOne({
      where: {
        user_id: user_id,
        post_id: post_id,
      },
    });
    if (postLikes) {
      const newIsLiked = postLikes.is_liked ? 0 : 1;
      postLikes.is_liked = newIsLiked;
      await postLikes.save();
    } else {
      await PostLikes.create({
        user_id,
        post_id,
        is_liked: 1,
      });
    }
    res.json({ message: "Success" });
  } catch (error) {
    res.json({ message: "Some error occurred!!!" });
  }
});

// POST: Comments /comment
router.post("/postComment", verifyToken, async (req, res) => {
  try {
    const user_id = req.userId;
    const post_id = req.body.post_id;
    const comment = req.body.comment;

    const response = await PostComments.create({
      user_id,
      post_id,
      comment,
    });

    res.json({ message: "Success" });
  } catch (error) {
    res.json({ message: "Some error occurred!!!" });
  }
});

module.exports = router;
