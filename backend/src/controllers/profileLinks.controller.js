const profileLinksService = require("../services/profileLinks.service");

exports.createProfileLink = (req, res) =>
    profileLinksService.createProfileLink(req, res);

exports.getMyProfileLinks = (req, res) =>
    profileLinksService.getMyProfileLinks(req, res);

exports.updateProfileLink = (req, res) =>
    profileLinksService.updateProfileLink(req, res);

exports.deleteProfileLink = (req, res) =>
    profileLinksService.deleteProfileLink(req, res);
