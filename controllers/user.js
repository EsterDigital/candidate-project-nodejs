const User = require("../models/userModel");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { filterObj } = require("../utils/helpers");

//GET
exports.getAllUsers = catchAsync(async (req, res, next) => {
  // console.log('req.query', req.query)

  // const apiFeatures = new APIFeatures(User.getUsers(), req.query).paginate();

  // const users = await apiFeatures.query;
  const users = await User.getUsers();

  res.status(200).json({
    status: "success",
    results: users.length,
    data: users,
  });
});

exports.getUserById = catchAsync(async (req, res, next) => {
  /**
   * Check if user is already present in DB 
   * if not, send an error message and return
   * this function
   */
  const id = Number(req.params.id);
  const searchedUser = await User.findUser(id);

  if (!searchedUser) {
    return next(new AppError(`Couldn't find a User with id: ${id}`, 404));
  }

  res.status(200).json({
    status: "success",
    data: searchedUser,
  });
});

// POST
exports.createUser = catchAsync(async (req, res, next) => {
  /**
   * Check if passed user with given email is already present in DB 
   * if yes, send an message and return
   * this function
   */
  let currentUser = req.body;
  if (User.isPresent(currentUser.email)) {
    return next(
      new AppError(
        "You already had a User with give email id",
        405,
      ),
    );
  }
  /**
   * If everything is good, create a new user
   */
  const id = User.getUsers().length + 1;
  currentUser = {
    id,
    ...currentUser
  }
  const createdUser = await User.create(currentUser);
  res.status(201).json({
    status: "success",
    data: createdUser,
  });
});

//PATCH
exports.updateUser = catchAsync(async (req, res, next) => {
  /**
   * Check if user is already present in DB 
   * if not, send an erro message and return
   * this function
   */
  const id = Number(req.params.id);
  const searchedUser = await User.findUser(id);
  
  if (!searchedUser) {
    return next(new AppError(`Couldn't find a User with id: ${id}`, 404));
  }

  /**
   * Filter out unwanted fields
   * that are not allowed to be updated,
   * the line below means we don't allow id to be updated
   */
  const filteredRequestBody = filterObj(req.body, "id");
  /**
   * Update current user document
   */
  const updatedUser = User.update(id, filteredRequestBody);
  
  res.status(200).json({
    status: "success",
    data: updatedUser,
  });
});

//DELETE
exports.deleteUser = catchAsync(async (req, res, next) => {
  /**
   * Check if user is already present in DB 
   * if not, send an erro message and return
   * this function
   */
  const id = Number(req.params.id);
  const searchedUser = await User.findUser(id);

  if (!searchedUser) {
    return next(new AppError(`Couldn't find a User with id: ${id}`, 404));
  }

  /**
   * Delete current user document
   */
  const deletedUser = await User.delete(id);
  
  res.status(204).json({
    status: "success",
    data: null,
  });
});