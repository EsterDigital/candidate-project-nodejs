const Comment = require("../models/commentModel");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { filterObj } = require("../utils/helpers");

//GET
exports.getAllComments = catchAsync(async (req, res, next) => {
  try {
    const comments = await Comment.getComments();

    res.status(200).json({
      status: "success",
      results: comments.length,
      data: comments,
    });

  } catch(err) {
    return next(err)
  }  
});

exports.getCommentsByPostId = catchAsync(async (req, res, next) => {
  try {
    const postId = Number(req.params.postId);
    const comments = Comment.getComments({ postId: postId });
    
    res.status(200).json({
      status: "success",
      results: comments.length,
      data: comments,
    });

  } catch(err) {
    return next(err)
  }
});

exports.getCommentById = catchAsync(async (req, res, next) => {
  try {
    /**
     * Check if comment is already present in DB 
     * if not, send an error message and return
     * this function
     */
    const id = Number(req.params.id);
    const searchedComment = await Comment.findComment(id);

    if (!searchedComment) {
      return next(new AppError(`Couldn't find a Comment with id: ${id}`, 404));
    }

    res.status(200).json({
      status: "success",
      data: searchedComment,
    });

  } catch(err) {
    return next(err)
  }
});

// POST
exports.createComment = catchAsync(async (req, res, next) => {
  try {
    /**
     * Create a new comment
     */
    const id = Comment.getComments().length + 1;
    let currentComment = req.body;
    currentComment = {
      id,
      ...currentComment
    }
    const createdComment = await Comment.create(currentComment);
    res.status(201).json({
      status: "success",
      data: createdComment,
    });

  } catch(err) {
    return next(err)
  }
});

//PATCH
exports.updateComment = catchAsync(async (req, res, next) => {
  try {
    /**
     * Check if comment is already present in DB 
     * if not, send an error message and return
     * this function
     */
    const id = Number(req.params.id);
    const searchedComment = await Comment.findComment(id);
    
    if (!searchedComment) {
      return next(new AppError(`Couldn't find a Comment with id: ${id}`, 404));
    }

    /**
     * Filter out unwanted fields
     * that are not allowed to be updated,
     * the line below means we don't allow id to be updated
     */
    const filteredRequestBody = filterObj(req.body, "id");
    /**
     * Update current comment document
     */
    const updatedComment = Comment.update(id, filteredRequestBody);
    
    res.status(200).json({
      status: "success",
      data: updatedComment,
    });

  } catch(err) {
    return next(err)
  }  
});

//DELETE
exports.deleteComment = catchAsync(async (req, res, next) => {
  try {
    /**
     * Check if comment is already present in DB 
     * if not, send an error message and return
     * this function
     */
    const id = Number(req.params.id);
    const searchedComment = await Comment.findComment(id);

    if (!searchedComment) {
      return next(new AppError(`Couldn't find a Comment with id: ${id}`, 404));
    }

    /**
     * Delete current comment document
     */
    const deletedComment = await Comment.delete(id);
    
    res.status(204).json({
      status: "success",
      data: null,
    });

  } catch(err) {
    return next(err)
  }  
});