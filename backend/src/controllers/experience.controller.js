const experienceService = require("../services/experience.service");

exports.createExperience = (req, res) => {
    return experienceService.createExperience(req, res);
};

exports.getMyExperience = (req, res) => {
    return experienceService.getMyExperience(req, res);
};

exports.updateExperience = (req, res) => {
    return experienceService.updateExperience(req, res);
};

exports.deleteExperience = (req, res) => {
    return experienceService.deleteExperience(req, res);
};
