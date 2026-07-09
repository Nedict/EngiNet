const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/auth.middleware");

const jobApplicationController = require("../controllers/jobApplication.controller");

router.post(
    "/:jobId",
    authenticate,
    jobApplicationController.applyForJob
);

router.get(
    "/me",
    authenticate,
    jobApplicationController.getMyApplications
);

router.get(
    "/company/:companyId",
    authenticate,
    jobApplicationController.getCompanyApplications
);

router.patch(
    "/:applicationId/status",
    authenticate,
    jobApplicationController.updateApplicationStatus
);

router.delete(
    "/:applicationId",
    authenticate,
    jobApplicationController.withdrawApplication
);

module.exports = router;
