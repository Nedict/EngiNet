const express = require("express");

const router = express.Router();

const profileController = require("../controllers/profile.controller");

const {
    uploadSingle
} = require("../middleware/upload.middleware");
const {
    authenticate
} = require("../middleware/auth.middleware");

router.get(
    "/",
    authenticate,
    profileController.getProfile
);

const {
    validateProfile
} = require("../validations/profile.validation");

router.put(
    "/",
    authenticate,
    validateProfile,
    profileController.updateProfile
);

router.post(
    "/resume",
    authenticate,
    uploadSingle,
    profileController.uploadResume
);

router.post(
    "/photo",
    authenticate,
    uploadSingle,
    profileController.uploadPhoto
);

module.exports = router;
