const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/auth.middleware");

const achievementController = require("../controllers/achievement.controller");

router.post("/", authenticate, achievementController.createAchievement);

router.get("/me", authenticate, achievementController.getMyAchievements);

router.put("/:id", authenticate, achievementController.updateAchievement);

router.delete("/:id", authenticate, achievementController.deleteAchievement);

module.exports = router;
