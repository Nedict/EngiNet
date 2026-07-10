const feedService = require("../services/feed.service");

exports.getHomeFeed = (req, res) =>
    feedService.getHomeFeed(req, res);

exports.getLatestFeed = (req, res) =>
    feedService.getLatestFeed(req, res);

exports.getTrendingFeed = (req, res) =>
    feedService.getTrendingFeed(req, res);
