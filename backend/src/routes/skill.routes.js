const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/auth.middleware");

const skillController = require("../controllers/skill.controller");

router.post(
    "/",
    authenticate,
    skillController.addSkill
);

router.get(
    "/me",
    authenticate,
    skillController.getMySkills
);

router.put(
    "/:id",
    authenticate,
    skillController.updateSkill
);

router.delete(
    "/:id",
    authenticate,
    skillController.deleteSkill
);

module.exports = router;
