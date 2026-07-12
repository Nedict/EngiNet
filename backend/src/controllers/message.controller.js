const messageService = require("../services/message.service");

exports.sendMessage = (req, res) =>
    messageService.sendMessage(req, res);

exports.getMessages = (req, res) =>
    messageService.getMessages(req, res);

exports.editMessage = (req, res) =>
    messageService.editMessage(req, res);

exports.deleteMessage = (req, res) =>
    messageService.deleteMessage(req, res);
