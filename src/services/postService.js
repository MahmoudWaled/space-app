const mongoose = require("mongoose");
const Post = require("../models/Post");
const User = require("../models/User");
const Notification = require("../models/Notification");

exports.createPost = async (data, file, userId) => {
  const { content } = data;
  const image = file ? `${file.filename}` : null;

  const post = await Post.create({
    content,
    image,
    author: userId,
  });

  return post;
};

exports.getAllPosts = async () => {
  return await Post.find()
    .populate("author", "username profileImage name ",)
    .populate("likes", "username")
    .populate({
      path: "comments",
      options: { sort: { createdAt: -1 } },
      populate: { path: "author", select: "username name profileImage" },
    })
    .sort({ createdAt: -1 });
};

exports.getPostById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("invalid post id");

  const post = await Post.findById(id)
    .populate("author", "username")
    .populate("likes", "username")
    .populate({
      path: "comments",
      options: { sort: { createdAt: -1 } },
      populate: { path: "author", select: "username" },
    });

  if (!post) throw new Error("post not found.");

  return post;
};

exports.getUserPosts = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId))
    throw new Error("invalid user id");

  const user = await User.findById(userId);
  if (!user) throw new Error("user not found");

  return await Post.find({ author: userId })
    .populate("author", "username")
    .sort({ createdAt: -1 });
};

exports.updatePost = async (postId, data, file, user) => {
  if (!mongoose.Types.ObjectId.isValid(postId))
    throw new Error("invalid post id");

  const post = await Post.findById(postId);
  if (!post) throw new Error("post not found.");

  const isOwner = post.author.toString() === user.id;
  const isAdmin = user.role === "admin";
  if (!isOwner && !isAdmin) throw new Error("not allowed action.");

  const image = file ? `${file.filename}` : null;
  post.content = data.content || post.content;
  post.image = image || post.image;
  await post.save();

  return post;
};

exports.deletePost = async (postId, user) => {
  const post = await Post.findById(postId);
  if (!post) throw new Error("post not found.");

  const isOwner = post.author.toString() === user.id;
  const isAdmin = user.role === "admin";
  if (!isOwner && !isAdmin) throw new Error("not allowed action.");

  await post.deleteOne();

  return `Post deleted by ${isOwner ? user.username : "admin"}`;
};

exports.toggleLike = async (postId, user) => {
  const post = await Post.findById(postId);
  if (!post) throw new Error("post not found.");

  const userId = user.id;
  const liked = post.likes.includes(userId);

  if (liked) {
    post.likes = post.likes.filter((id) => id.toString() !== userId);
  } else {
    post.likes.push(userId);

    if (post.author.toString() !== userId) {
      await Notification.create({
        recipient: post.author,
        sender: userId,
        type: "like",
        post: post._id,
      });
    }
  }

  await post.save();
  return liked ? "post unLiked" : "post liked";
};
