const educationService = require("../services/education.service");

exports.createEducation = (req, res) => {
    return educationService.createEducation(req, res);
};

exports.getMyEducation = (req, res) => {
    return educationService.getMyEducation(req, res);
};

exports.updateEducation = (req, res) => {
    return educationService.updateEducation(req, res);
};

exports.deleteEducation = (req, res) => {
    return educationService.deleteEducation(req, res);
};
