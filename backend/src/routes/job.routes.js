const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/auth.middleware");

const jobController = require("../controllers/job.controller");

router.post(
    "/",
    authenticate,
    jobController.createJob
);

router.get(
    "/",
    authenticate,
    jobController.getAllJobs
);

router.get(
    "/company/:companyId",
    authenticate,
    jobController.getCompanyJobs
);

router.get(
    "/discipline/:disciplineId",
    authenticate,
    jobController.getJobsByDiscipline
);

router.get(
    "/:id",
    authenticate,
    jobController.getJob
);

router.put(
    "/:id",
    authenticate,
    jobController.updateJob
);

router.delete(
    "/:id",
    authenticate,
    jobController.deleteJob
);

module.exports = router;
