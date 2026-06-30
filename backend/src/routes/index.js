const express = require("express");

const router = express.Router();

router.use("/health", require("./health.routes"));
router.use("/auth", require("./auth.routes"));
router.use("/profile", require("./profile.routes"));
router.use("/companies", require("./company.routes"));
router.use("/posts", require("./post.routes"));
router.use("/projects", require("./project.routes"));
router.use("/jobs", require("./job.routes"));
router.use("/communities", require("./community.routes"));
router.use("/messages", require("./message.routes"));

module.exports = router;
