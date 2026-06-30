const jobService = require("../services/job.service");

exports.getJobs = jobService.getJobs;
exports.createJob = jobService.createJob;
exports.updateJob = jobService.updateJob;
exports.deleteJob = jobService.deleteJob;
