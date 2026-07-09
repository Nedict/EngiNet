const postService = require("../services/post.service");

exports.createPost = (req, res) =>
    postService.createPost(req, res);

exports.getFeed = (req, res) =>
    postService.getFeed(req, res);

exports.getMyPosts = (req, res) =>
    postService.getMyPosts(req, res);

exports.getPost = (req, res) =>
    postService.getPost(req, res);

exports.updatePost = (req, res) =>
    postService.updatePost(req, res);

exports.deletePost = (req, res) =>
    postService.deletePost(req, res);
