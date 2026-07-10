const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/auth.middleware");

const commentController = require("../controllers/comment.controller");

router.post(
    "/",
    authenticate,
    commentController.createComment
);

router.get(
    "/post/:postId",
    authenticate,
    commentController.getPostComments
);

router.put(
    "/:id",
    authenticate,
    commentController.updateComment
);

router.delete(
    "/:id",
    authenticate,
    commentController.deleteComment
);

module.exports = router;
