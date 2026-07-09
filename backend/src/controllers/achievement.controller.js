const achievementService = require("../services/achievement.service");

exports.createAchievement = (req, res) =>
    achievementService.createAchievement(req, res);

exports.getMyAchievements = (req, res) =>
    achievementService.getMyAchievements(req, res);

exports.updateAchievement = (req, res) =>
    achievementService.updateAchievement(req, res);

exports.deleteAchievement = (req, res) =>
    achievementService.deleteAchievement(req, res);
