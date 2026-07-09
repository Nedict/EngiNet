const jobApplicationService = require("../services/jobApplication.service");

exports.applyForJob = (req, res) =>
    jobApplicationService.applyForJob(req, res);

exports.getMyApplications = (req, res) =>
    jobApplicationService.getMyApplications(req, res);

exports.getCompanyApplications = (req, res) =>
    jobApplicationService.getCompanyApplications(req, res);

exports.updateApplicationStatus = (req, res) =>
    jobApplicationService.updateApplicationStatus(req, res);

exports.withdrawApplication = (req, res) =>
    jobApplicationService.withdrawApplication(req, res);
