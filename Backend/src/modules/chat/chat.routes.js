const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middlewares/auth.middleware");
const { accessChatController, fetchMessagesController, sendMessageController, fetchChatsController, markChatAsReadController } = require("../../modules/chat/chat.controller");

// POST /api/chats/access/:userId
router.post("/access/:userId", verifyToken, accessChatController);

// GET /api/chats/messages/:chatId
router.get("/messages/:chatId", verifyToken, fetchMessagesController);

// POST /api/chats/messages/:chatId
router.post("/messages/:chatId", verifyToken, sendMessageController);

// GET /api/chats
router.get("/", verifyToken, fetchChatsController);

// POST /api/chats/read/:chatId
router.post("/read/:chatId", verifyToken, markChatAsReadController);

module.exports = router;