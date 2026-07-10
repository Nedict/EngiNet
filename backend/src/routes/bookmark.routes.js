const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/auth.middleware");

const bookmarkController = require("../controllers/bookmark.controller");

router.post(
    "/:postId",
    authenticate,
    bookmarkController.toggleBookmark
);

router.get(
    "/me",
    authenticate,
    bookmarkController.getBookmarks
);

module.exports = router;
