const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/auth.middleware");

const notificationController = require("../controllers/notification.controller");

router.get(
    "/",
    authenticate,
    notificationController.getNotifications
);

router.get(
    "/unread",
    authenticate,
    notificationController.getUnreadNotifications
);

router.patch(
    "/:id/read",
    authenticate,
    notificationController.markAsRead
);

router.patch(
    "/read-all",
    authenticate,
    notificationController.markAllAsRead
);

router.delete(
    "/:id",
    authenticate,
    notificationController.deleteNotification
);

module.exports = router;
