const notificationService = require("../services/notification.service");

exports.getNotifications = (req, res) =>
    notificationService.getNotifications(req, res);

exports.getUnreadNotifications = (req, res) =>
    notificationService.getUnreadNotifications(req, res);

exports.markAsRead = (req, res) =>
    notificationService.markAsRead(req, res);

exports.markAllAsRead = (req, res) =>
    notificationService.markAllAsRead(req, res);

exports.deleteNotification = (req, res) =>
    notificationService.deleteNotification(req, res);
