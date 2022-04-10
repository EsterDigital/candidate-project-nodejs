const Post = require("../models/postModel");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { filterObj } = require("../utils/helpers");

//GET
exports.getAllPosts = catchAsync(async (req, res, next) => {
  try {
    const posts = await Post.getPosts();

    res.status(200).json({
      status: "success",
      results: posts.length,
      data: posts,
    });

  } catch(err) {
    return next(err)
  }  
});

exports.getPostsByUserId = catchAsync(async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    const posts = Post.getPosts({ userId: userId });
    
    res.status(200).json({
      status: "success",
      results: posts.length,
      data: posts,
    });

  } catch(err) {
    return next(err)
  }
});

exports.getPostById = catchAsync(async (req, res, next) => {
  try {
    /**
     * Check if post is already present in DB 
     * if not, send an error message and return
     * this function
     */
    const id = Number(req.params.id);
    const searchedPost = await Post.findPost(id);

    if (!searchedPost) {
      return next(new AppError(`Couldn't find a Post with id: ${id}`, 404));
    }

    res.status(200).json({
      status: "success",
      data: searchedPost,
    });

  } catch(err) {
    return next(err)
  }
});

// POST
exports.createPost = catchAsync(async (req, res, next) => {
  try {
    /**
     * Create a new post
     */
    const id = Post.getPosts().length + 1;
    let currentPost = req.body;
    currentPost = {
      id,
      ...currentPost
    }
    const createdPost = await Post.create(currentPost);
    res.status(201).json({
      status: "success",
      data: createdPost,
    });

  } catch(err) {
    return next(err)
  }  
});

//PATCH
exports.updatePost = catchAsync(async (req, res, next) => {
  try {
    /**
     * Check if post is already present in DB 
     * if not, send an error message and return
     * this function
     */
    const id = Number(req.params.id);
    const searchedPost = await Post.findPost(id);
    
    if (!searchedPost) {
      return next(new AppError(`Couldn't find a Post with id: ${id}`, 404));
    }

    /**
     * Filter out unwanted fields
     * that are not allowed to be updated,
     * the line below means we don't allow id to be updated
     */
    const filteredRequestBody = filterObj(req.body, "id");
    /**
     * Update current post document
     */
    const updatedPost = Post.update(id, filteredRequestBody);
    
    res.status(200).json({
      status: "success",
      data: updatedPost,
    });

  } catch(err) {
    return next(err)
  }
});

//DELETE
exports.deletePost = catchAsync(async (req, res, next) => {
  try {
    /**
     * Check if post is already present in DB 
     * if not, send an error message and return
     * this function
     */
    const id = Number(req.params.id);
    const searchedPost = await Post.findPost(id);

    if (!searchedPost) {
      return next(new AppError(`Couldn't find a Post with id: ${id}`, 404));
    }

    /**
     * Delete current post document
     */
    const deletedPost = await Post.delete(id);
    
    res.status(204).json({
      status: "success",
      data: null,
    });
    
  } catch(err) {
    return next(err)
  }
});