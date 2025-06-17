const { default: mongoose } = require("mongoose");
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const Notification = require("../models/Notification");

const addComment = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.postId))
      return res.status(400).json({ message: "invalid post id" });
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "post not found." });
    if (!req.body) return res.status(400).json({ message: "invalid body" });
    const comment = await Comment.create({
      text: req.body.text,
      author: req.user.id,
      post: req.params.postId,
    });
    if (post.author.toString() !== req.user.id) {
      await Notification.create({
        recipient: post.author,
        sender: req.user.id,
        type: "comment",
        post: post._id,
      });
    }
    res.status(201).json(comment);
  } catch (error) {
    console.log({ message: error.message });
    res.status(500).json({ message: "server error." });
  }
};

const getCommentsByPost = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.postId))
      return res.status(400).json({ message: "invalid post id" });
    if (!(await Post.findById(req.params.postId)))
      return res.status(404).json({ message: "post not found." });
    const comments = await Comment.find({ post: req.params.postId })
      .populate("author", "username")
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    console.log({ message: error.message });
    res.status(500).json({ message: "server error." });
  }
};

const updateComment = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.commentId))
      return res.status(400).json({ message: "invalid comment id." });
    const comment = await Comment.findById(req.params.commentId);
    if (!comment)
      return res.status(404).json({ message: "comment not found." });
    if (!req.body) return res.status(400).json({ message: "invalid body." });
    const isOwner = comment.author.toString() === req.user.id;
    if (!isOwner)
      return res.status(403).json({ message: "not allowed action." });
    comment.text = req.body.text;
    await comment.save();
    res.json(comment);
  } catch (error) {
    console.log({ message: error.message });
    res.status(500).json({ message: "server error." });
  }
};

const deleteComment = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.commentId))
      return res.status(400).json({ message: "invalid comment id." });
    const comment = await Comment.findById(req.params.commentId);
    if (!comment)
      return res.status(404).json({ message: "comment not found." });
    const isOwner = comment.author.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin)
      return res.status(403).json({ message: "not allowed action." });
    await comment.deleteOne();
    res.json({
      message: `comment deleted by ${isOwner ? req.user.username : "admin"}`,
    });
  } catch (error) {
    console.log({ message: error.message });
    res.status(500).json({ message: "server error." });
  }
};

module.exports = {
  addComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
};
