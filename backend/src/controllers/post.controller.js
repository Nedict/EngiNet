const postService = require("../services/post.service");

exports.getPosts = postService.getPosts;
exports.createPost = postService.createPost;
exports.updatePost = postService.updatePost;
exports.deletePost = postService.deletePost;
