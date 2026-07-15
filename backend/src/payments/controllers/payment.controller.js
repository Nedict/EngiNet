const paymentService = require("../services/payment.service");

exports.initializePayment = (req, res) =>
    paymentService.initializePayment(req, res);

exports.verifyPayment = (req, res) =>
    paymentService.verifyPayment(req, res);

exports.webhook = (req, res) =>
    paymentService.webhook(req, res);
