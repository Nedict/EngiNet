const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/auth.middleware");

const experienceController = require("../controllers/experience.controller");

router.post(
    "/",
    authenticate,
    experienceController.createExperience
);

router.get(
    "/me",
    authenticate,
    experienceController.getMyExperience
);

router.put(
    "/:id",
    authenticate,
    experienceController.updateExperience
);

router.delete(
    "/:id",
    authenticate,
    experienceController.deleteExperience
);

module.exports = router;
