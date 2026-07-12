const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/auth.middleware");

const chatController = require("../controllers/chat.controller");

router.post(
    "/",
    authenticate,
    chatController.createChat
);

router.get(
    "/",
    authenticate,
    chatController.getChats
);

router.get(
    "/:chatId",
    authenticate,
    chatController.getChat
);

router.delete(
    "/:chatId",
    authenticate,
    chatController.deleteChat
);

module.exports = router;
