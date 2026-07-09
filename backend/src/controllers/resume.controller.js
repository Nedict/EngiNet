const resumeService = require("../services/resume.service");

exports.uploadResume = (req, res) => {
    return resumeService.uploadResume(req, res);
};

exports.getMyResume = (req, res) => {
    return resumeService.getMyResume(req, res);
};

exports.deleteResume = (req, res) => {
    return resumeService.deleteResume(req, res);
};
