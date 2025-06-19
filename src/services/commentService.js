const mongoose = require("mongoose");
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const Notification = require("../models/Notification");

exports.addComment = async (postId, text, userId) => {
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new Error("invalid post id");
  }

  const post = await Post.findById(postId);
  if (!post) throw new Error("post not found");

  const comment = await Comment.create({
    text,
    author: userId,
    post: postId,
  });

  if (post.author.toString() !== userId) {
    await Notification.create({
      recipient: post.author,
      sender: userId,
      type: "comment",
      post: post._id,
    });
  }

  return comment;
};

exports.getCommentsByPost = async (postId) => {
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new Error("invalid post id");
  }

  const post = await Post.findById(postId);
  if (!post) throw new Error("post not found");

  return await Comment.find({ post: postId })
    .populate("author", "username")
    .sort({ createdAt: -1 });
};

exports.updateComment = async (commentId, newText, userId) => {
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new Error("invalid comment id");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) throw new Error("comment not found");

  if (comment.author.toString() !== userId) {
    throw new Error("not allowed action");
  }

  comment.text = newText;
  await comment.save();

  return comment;
};

exports.deleteComment = async (commentId, user) => {
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new Error("invalid comment id");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) throw new Error("comment not found");

  const isOwner = comment.author.toString() === user.id;
  const isAdmin = user.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new Error("not allowed action");
  }

  await comment.deleteOne();

  return `comment deleted by ${isOwner ? user.username : "admin"}`;
};
