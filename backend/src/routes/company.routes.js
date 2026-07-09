const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/auth.middleware");

const companyController = require("../controllers/company.controller");

router.post(
    "/",
    authenticate,
    companyController.createCompany
);

router.get(
    "/me",
    authenticate,
    companyController.getMyCompany
);

router.get(
    "/:id",
    authenticate,
    companyController.getCompanyById
);

router.put(
    "/:id",
    authenticate,
    companyController.updateCompany
);

router.delete(
    "/:id",
    authenticate,
    companyController.deleteCompany
);

router.patch(
    "/logo",
    authenticate,
    companyController.uploadLogo
);

router.patch(
    "/banner",
    authenticate,
    companyController.uploadBanner
);

module.exports = router;
