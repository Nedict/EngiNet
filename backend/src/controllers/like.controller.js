const likeService = require("../services/like.service");

exports.toggleLike = (req, res) =>
    likeService.toggleLike(req, res);

exports.getPostLikes = (req, res) =>
    likeService.getPostLikes(req, res);
