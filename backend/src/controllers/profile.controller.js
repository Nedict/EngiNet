const profileService = require("../services/profile.service");

exports.getProfile = profileService.getProfile;
exports.updateProfile = profileService.updateProfile;
exports.uploadResume = profileService.uploadResume;
exports.uploadPhoto = profileService.uploadPhoto;
