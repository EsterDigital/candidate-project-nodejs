const express = require("express");
const authController = require('../controllers/auth');
const userController = require("../controllers/user");
const postController = require("../controllers/post");

const userRouter = express.Router();

userRouter.route('/')
  .get(authController.protect, userController.getAllUsers)
  .post(authController.protect, userController.createUser);


userRouter.route('/:id')
  .get(authController.protect, userController.getUserById)
  .patch(authController.protect, userController.updateUser)
  .delete(authController.protect, userController.deleteUser);

module.exports = userRouter;
