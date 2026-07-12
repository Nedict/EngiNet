const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/auth.middleware");

const messageController = require("../controllers/message.controller");

router.post(
    "/:chatId",
    authenticate,
    messageController.sendMessage
);

router.get(
    "/:chatId",
    authenticate,
    messageController.getMessages
);

router.put(
    "/:messageId",
    authenticate,
    messageController.editMessage
);

router.delete(
    "/:messageId",
    authenticate,
    messageController.deleteMessage
);

module.exports = router;
