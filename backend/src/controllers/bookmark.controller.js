const bookmarkService = require("../services/bookmark.service");

exports.toggleBookmark = (req, res) =>
    bookmarkService.toggleBookmark(req, res);

exports.getBookmarks = (req, res) =>
    bookmarkService.getBookmarks(req, res);
