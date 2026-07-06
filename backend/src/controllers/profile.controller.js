const profileService = require("../services/profile.service");

exports.getMyProfile = (req, res) =>
    profileService.getMyProfile(req, res);

exports.updateMyProfile = (req, res) =>
    profileService.updateMyProfile(req, res);

exports.getProfileById = (req, res) =>
    profileService.getProfileById(req, res);

exports.uploadAvatar = (req, res) =>
    profileService.uploadAvatar(req, res);