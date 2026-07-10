const commentService = require("../services/comment.service");

exports.createComment = (req, res) =>
    commentService.createComment(req, res);

exports.getPostComments = (req, res) =>
    commentService.getPostComments(req, res);

exports.updateComment = (req, res) =>
    commentService.updateComment(req, res);

exports.deleteComment = (req, res) =>
    commentService.deleteComment(req, res);
