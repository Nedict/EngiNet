const express = require("express");
const router = express.Router();
router.get("/health", (req, res) => res.json({ success: true, message: "EngiNet API is healthy", data: { status: "ok" } }));
router.use("/auth", require("./auth.routes"));
router.use("/profile", require("./profile.routes"));
module.exports = router;
