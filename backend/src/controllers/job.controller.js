const jobService = require("../services/job.service");

exports.createJob = (req, res) =>
    jobService.createJob(req, res);

exports.getAllJobs = (req, res) =>
    jobService.getAllJobs(req, res);

exports.getCompanyJobs = (req, res) =>
    jobService.getCompanyJobs(req, res);

exports.getJobsByDiscipline = (req, res) =>
    jobService.getJobsByDiscipline(req, res);

exports.getJob = (req, res) =>
    jobService.getJob(req, res);

exports.updateJob = (req, res) =>
    jobService.updateJob(req, res);

exports.deleteJob = (req, res) =>
    jobService.deleteJob(req, res);
