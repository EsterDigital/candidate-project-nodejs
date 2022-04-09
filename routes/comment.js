const express = require("express");
const authController = require('../controllers/auth');
const commentController = require("../controllers/comment");

const commentRouter = express.Router();

commentRouter.route('/')
  .get(authController.protect, commentController.getAllComments)
  .post(authController.protect, commentController.createComment);

commentRouter.route('/:id')
  .get(authController.protect, commentController.getCommentById)
  .patch(authController.protect, commentController.updateComment)
  .delete(authController.protect, commentController.deleteComment);

module.exports = commentRouter;
