const { default: mongoose } = require("mongoose");
const Post = require("../models/Post");
const User = require("../models/User");
const Notification = require("../models/Notification");

const createPost = async (req, res) => {
  console.log(req.file); 
    console.log(req.body);
  try {
    const { content } = req.body;
    const image = req.file ? `/Uploads/${req.file.filename}` : null;
    const post = await Post.create({
      content,
      image,
      author: req.user.id,
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username")
      .populate("likes", "username")
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
        populate: { path: "author", select: "username" },
      })
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.log({ message: error.message });
    res.status(500).json({ message: "server error." });
  }
};

const getPostById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: "invalid post id" });
    const post = await Post.findById(req.params.id)
      .populate("author", "username")
      .populate("likes", "username")
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
        populate: { path: "author", select: "username" },
      })
      .sort({ createdAt: -1 });
    if (!post) return res.status(404).json({ message: "post not found." });
    res.json(post);
  } catch (error) {
    console.log({ message: error.message });
    res.status(500).json({ message: "server error." });
  }
};

const getUserPosts = async (req, res) => {
  try {
    if (!req.params.id)
      return res.status(400).json({ message: "user id required!" });
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: "invalid user id" });
    if (!(await User.findById(req.params.id)))
      return res.status(404).json({ message: "user not found" });
    const posts = await Post.find({ author: req.params.id })
      .populate("author", "username")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.log({ message: error.message });
    res.status(500).json({ message: "server error." });
  }
};

const updatePost = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: "invalid post id" });
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "post not found." });
    const isOwner = post.author.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin)
      return res.status(403).json({ message: "not allowed action." });
    const { content } = req.body;
    const image = req.file ? `/Uploads/${req.file.filename}` : null;
    post.content = content || post.content;
    post.image = image || post.image;
    await post.save();
    res.json(post);
  } catch (error) {
    console.log({ message: error.message });
    res.status(500).json({ message: "server error." });
  }
};
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "post not found." });
    const isOwner = post.author.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin)
      return res.status(403).json({ message: "not allowed action." });
    await post.deleteOne();
    res.json({
      message: `Post deleted by ${isOwner ? req.user.username : "admin"}`,
    });
  } catch (error) {
    console.log({ message: error.message });
    res.status(500).json({ message: "server error." });
  }
};

const toggleLike = async (req, res) => {
  try {
    console.log(req.params.id);
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "post not found." });
    const userId = req.user.id;
    const liked = post.likes.includes(userId);
    if (liked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
      if (post.author.toString() !== req.user.id) {
        await Notification.create({
          recipient: post.author,
          sender: req.user.id,
          type: "like",
          post: post._id,
        });
      }
    }
    await post.save();

    res.json(`post ${liked ? `unLiked` : `liked`} `);
  } catch (error) {
    console.log({ message: error.message });
    res.status(500).json({ message: "server error." });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  getUserPosts,
  updatePost,
  deletePost,
  toggleLike,
};
