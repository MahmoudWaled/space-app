const express = require("express");
const protect = require("../middlewares/authMiddleware");
const Router =express.Router();
const { addComment, getCommentsByPost, updateComment, deleteComment } = require("../controllers/commentController");


Router.post('/:postId',protect,addComment);
Router.get('/post/:postId',getCommentsByPost);
Router.put('/:commentId',protect,updateComment);
Router.delete('/:commentId',protect,deleteComment);



module.exports=Router;