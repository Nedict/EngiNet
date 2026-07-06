const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/auth.middleware");

const profileController = require("../controllers/profile.controller");

const validate = require("../middleware/validate.middleware");

const upload = require("../middleware/upload.middleware");

const {
    updateProfileSchema
} = require("../validations/profile.validation");

router.get("/me", authenticate, profileController.getMyProfile);

router.put("/me", authenticate, profileController.updateMyProfile);

router.get("/:id", authenticate, profileController.getProfileById);

router.post(
    "/avatar",
    authenticate,
    upload.single("avatar"),
    profileController.uploadAvatar
);

module.exports = router;