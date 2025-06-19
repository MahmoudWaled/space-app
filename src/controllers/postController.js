const postService = require("../services/postService");

const createPost = async (req, res) => {
  try {
    const post = await postService.createPost(req.body, req.file, req.user.id);
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await postService.getAllPosts();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "server error." });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await postService.getPostById(req.params.id);
    res.json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const posts = await postService.getUserPosts(req.params.id);
    res.json(posts);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await postService.updatePost(req.params.id, req.body, req.file, req.user);
    res.json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const message = await postService.deletePost(req.params.id, req.user);
    res.json({ message });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const toggleLike = async (req, res) => {
  try {
    const message = await postService.toggleLike(req.params.id, req.user);
    res.json({ message });
  } catch (err) {
    res.status(400).json({ message: err.message });
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
