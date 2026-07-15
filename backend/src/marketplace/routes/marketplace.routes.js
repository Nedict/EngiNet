const express = require("express");

const router = express.Router();

const authenticate = require("../../middleware/auth.middleware");

const marketplaceController = require("../controllers/marketplace.controller");

router.post(
    "/",
    authenticate,
    marketplaceController.createListing
);

router.get(
    "/",
    marketplaceController.getListings
);

router.get(
    "/:id",
    marketplaceController.getListing
);

router.put(
    "/:id",
    authenticate,
    marketplaceController.updateListing
);

router.delete(
    "/:id",
    authenticate,
    marketplaceController.deleteListing
);

module.exports = router;
