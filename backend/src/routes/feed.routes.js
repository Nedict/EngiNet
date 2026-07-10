const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/auth.middleware");

const feedController = require("../controllers/feed.controller");

router.get(
    "/",
    authenticate,
    feedController.getHomeFeed
);

router.get(
    "/latest",
    authenticate,
    feedController.getLatestFeed
);

router.get(
    "/trending",
    authenticate,
    feedController.getTrendingFeed
);

module.exports = router;
