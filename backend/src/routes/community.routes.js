const express = require("express");
const router = express.Router();

const communityController = require("../controllers/community.controller");

router.get("/", communityController.getCommunities);
router.post("/", communityController.createCommunity);
router.put("/:id", communityController.updateCommunity);
router.delete("/:id", communityController.deleteCommunity);

module.exports = router;
