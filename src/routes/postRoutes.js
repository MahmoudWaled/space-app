const express = require("express");
const { createPost, getAllPosts, getPostById, updatePost, deletePost, toggleLike, getUserPosts } = require("../controllers/postController");
const protect = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const Router = express.Router();

Router.get("/", getAllPosts);
Router.get("/:id", getPostById);
Router.get("/user/:id", getUserPosts);
Router.post("/", protect,upload.single('image'), createPost);
Router.put("/:id", protect,upload.single('image') , updatePost);
Router.delete("/:id", protect, deletePost);
Router.post("/:id/like", protect, toggleLike);

module.exports = Router;
