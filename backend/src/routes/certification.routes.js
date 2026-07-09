const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/auth.middleware");

const certificationController = require("../controllers/certification.controller");

router.post(
    "/",
    authenticate,
    certificationController.createCertification
);

router.get(
    "/me",
    authenticate,
    certificationController.getMyCertifications
);

router.put(
    "/:id",
    authenticate,
    certificationController.updateCertification
);

router.delete(
    "/:id",
    authenticate,
    certificationController.deleteCertification
);

module.exports = router;
