const commentService = require("../services/commentService");

const addComment = async (req, res) => {
  try {
    const comment = await commentService.addComment(
      req.params.postId,
      req.body.text,
      req.user.id
    );
    res.status(201).json(comment);
  } catch (err) {
    console.log({ message: err.message });
    res.status(400).json({ message: err.message });
  }
};

const getCommentsByPost = async (req, res) => {
  try {
    const comments = await commentService.getCommentsByPost(req.params.postId);
    res.json(comments);
  } catch (err) {
    console.log({ message: err.message });
    res.status(400).json({ message: err.message });
  }
};

const updateComment = async (req, res) => {
  try {
    const comment = await commentService.updateComment(
      req.params.commentId,
      req.body.text,
      req.user.id
    );
    res.json(comment);
  } catch (err) {
    console.log({ message: err.message });
    res.status(400).json({ message: err.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const message = await commentService.deleteComment(req.params.commentId, req.user);
    res.json({ message });
  } catch (err) {
    console.log({ message: err.message });
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  addComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
};
