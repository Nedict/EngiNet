const messageService = require("../services/message.service");

exports.getMessages = messageService.getMessages;
exports.sendMessage = messageService.sendMessage;
