const orderService = require("../services/order.service");

exports.getMyOrders = (req, res) =>
    orderService.getMyOrders(req, res);

exports.getMySales = (req, res) =>
    orderService.getMySales(req, res);

exports.getOrder = (req, res) =>
    orderService.getOrder(req, res);
