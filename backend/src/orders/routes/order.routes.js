const express = require("express");

const router = express.Router();

const authenticate = require("../../middleware/auth.middleware");

const orderController = require("../controllers/order.controller");

router.get(
    "/my-orders",
    authenticate,
    orderController.getMyOrders
);

router.get(
    "/sales",
    authenticate,
    orderController.getMySales
);

router.get(
    "/:id",
    authenticate,
    orderController.getOrder
);

module.exports = router;
