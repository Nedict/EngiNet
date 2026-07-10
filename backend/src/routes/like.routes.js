const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/auth.middleware");

const likeController = require("../controllers/like.controller");

router.post(
    "/:postId",
    authenticate,
    likeController.toggleLike
);

router.get(
    "/:postId",
    authenticate,
    likeController.getPostLikes
);

module.exports = router;
