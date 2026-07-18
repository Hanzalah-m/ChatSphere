const ApiError = require("../../utils/api.error");
const { accessChat, fetchMessages, sendMessage, fetchChats, markChatAsRead } = require("../../modules/chat/chat.service");
const formatUser = require("../../utils/helpers");

const accessChatController = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const chat = await accessChat(req.user.id, userId);

        res.json({
            success: true,
            chat
        });

    } catch (error) {
        next(error);
    }
};

const fetchMessagesController = async (req, res, next) => {
    try {
        const { chatId } = req.params;
        const messages = await fetchMessages(chatId);

        res.json({
            success: true,
            messages
        });
    } catch (error) {
        next(error);
    }
};

const sendMessageController = async (req, res, next) => {
    try {
        const { chatId } = req.params;
        const { content } = req.body;
        const message = await sendMessage(chatId, req.user.id, content);

        res.json({
            success: true,
            message
        });
    } catch (error) {
        next(error);
    }
};

const markChatAsReadController = async (req, res, next) => {
    try {
        const { chatId } = req.params;
        await markChatAsRead(chatId, req.user.id);

        res.json({
            success: true,
            message: "Chat marked as read"
        });
    } catch (error) {
        next(error);
    }
};

const fetchChatsController = async (req, res, next) => {
    try {
        const chats = await fetchChats(req.user.id);

        res.json({
            success: true,
            chats
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    accessChatController,
    fetchMessagesController,
    sendMessageController,
    fetchChatsController,
    markChatAsReadController
};