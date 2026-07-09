const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/auth.middleware");

const postController = require("../controllers/post.controller");

router.post(
    "/",
    authenticate,
    postController.createPost
);

router.get(
    "/feed",
    authenticate,
    postController.getFeed
);

router.get(
    "/me",
    authenticate,
    postController.getMyPosts
);

router.get(
    "/:id",
    authenticate,
    postController.getPost
);

router.put(
    "/:id",
    authenticate,
    postController.updatePost
);

router.delete(
    "/:id",
    authenticate,
    postController.deletePost
);

module.exports = router;
