const express = require("express");
const { checkSchema } = require('express-validator');

const authController = require('../controllers/auth');
const postController = require("../controllers/post");

const { createPostSchema } = require('../models/postModel');
const { validate } = require('../utils/helpers');

const postRouter = express.Router();

postRouter.route('/')
  .get(authController.protect, postController.getAllPosts)
  .post(authController.protect, validate(checkSchema(createPostSchema)), postController.createPost);

postRouter.route('/:id')
  .get(authController.protect, postController.getPostById)
  .patch(authController.protect, validate(checkSchema(createPostSchema)), postController.updatePost)
  .delete(authController.protect, postController.deletePost);

module.exports = postRouter;
