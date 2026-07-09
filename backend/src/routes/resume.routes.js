const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

const resumeController = require("../controllers/resume.controller");

router.post(
    "/",
    authenticate,
    upload.single("resume"),
    resumeController.uploadResume
);

router.get(
    "/me",
    authenticate,
    resumeController.getMyResume
);

router.delete(
    "/:id",
    authenticate,
    resumeController.deleteResume
);

module.exports = router;
