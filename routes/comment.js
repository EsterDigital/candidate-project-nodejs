const express = require("express");
const { checkSchema } = require('express-validator');

const authController = require('../controllers/auth');
const commentController = require("../controllers/comment");

const { createCommentSchema } = require('../models/commentModel');
const { validate } = require('../utils/helpers');

const commentRouter = express.Router();

commentRouter.route('/')
  .get(authController.protect, commentController.getAllComments)
  .post(authController.protect, validate(checkSchema(createCommentSchema)), commentController.createComment);

commentRouter.route('/:id')
  .get(authController.protect, commentController.getCommentById)
  .patch(authController.protect, validate(checkSchema(createCommentSchema)), commentController.updateComment)
  .delete(authController.protect, commentController.deleteComment);

module.exports = commentRouter;
