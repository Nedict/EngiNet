const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/auth.middleware");

const profileLinksController = require("../controllers/profileLinks.controller");

router.post(
    "/",
    authenticate,
    profileLinksController.createProfileLink
);

router.get(
    "/me",
    authenticate,
    profileLinksController.getMyProfileLinks
);

router.put(
    "/:id",
    authenticate,
    profileLinksController.updateProfileLink
);

router.delete(
    "/:id",
    authenticate,
    profileLinksController.deleteProfileLink
);

module.exports = router;
