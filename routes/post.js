const express = require("express");
const authController = require('../controllers/auth');
const postController = require("../controllers/post");

const postRouter = express.Router();

postRouter.route('/')
  .get(authController.protect, postController.getAllPosts)
  .post(authController.protect, postController.createPost);

postRouter.route('/:id')
  .get(authController.protect, postController.getPostById)
  .patch(authController.protect, postController.updatePost)
  .delete(authController.protect, postController.deletePost);

module.exports = postRouter;
