const chatService = require("../services/chat.service");

exports.createChat = (req, res) =>
    chatService.createChat(req, res);

exports.getChats = (req, res) =>
    chatService.getChats(req, res);

exports.getChat = (req, res) =>
    chatService.getChat(req, res);

exports.deleteChat = (req, res) =>
    chatService.deleteChat(req, res);
