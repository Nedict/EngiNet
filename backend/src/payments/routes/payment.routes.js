const express = require("express");

const router = express.Router();

const authenticate = require("../../middleware/auth.middleware");

const paymentController = require("../controllers/payment.controller");

router.post(
    "/initialize",
    authenticate,
    paymentController.initializePayment
);

router.get(
    "/verify/:reference",
    authenticate,
    paymentController.verifyPayment
);

router.post(
    "/webhook",
    paymentController.webhook
);

module.exports = router;
