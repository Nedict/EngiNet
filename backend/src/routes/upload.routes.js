const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/auth.middleware");

const upload = require("../middleware/upload.middleware");

const uploadController = require("../controllers/upload.controller");

router.post(

    "/",

    authenticate,

    upload.single("file"),

    uploadController.upload

);

router.delete(

    "/",

    authenticate,

    uploadController.delete

);

module.exports = router;
