const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/auth.middleware");

const educationController = require("../controllers/education.controller");

router.post(
    "/",
    authenticate,
    educationController.createEducation
);

router.get(
    "/me",
    authenticate,
    educationController.getMyEducation
);

router.put(
    "/:id",
    authenticate,
    educationController.updateEducation
);

router.delete(
    "/:id",
    authenticate,
    educationController.deleteEducation
);

module.exports = router;
