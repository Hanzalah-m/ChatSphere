const Chat = require("../../models/chat");
const Message = require("../../models/messege");
const ApiError = require("../../utils/api.error");

const accessChat = async (currentUserId, targetUserId) => {
    // Don't let a user start a chat with themselves
    if (currentUserId.toString() === targetUserId.toString()) {
        throw new ApiError(400, "You cannot start a chat with yourself");
    }

    // Check if a chat between these two users already exists
    let chat = await Chat.findOne({
        members: { $all: [currentUserId, targetUserId] } 
    }).populate("members", "name username profilePicture");

    // If it doesn't exist, create a new one
    if (!chat) {
        chat = await Chat.create({
            members: [currentUserId, targetUserId]
        });
    }

    return chat;
};

const fetchMessages = async (chatId) => {
    const messages = await Message.find({ chatId })
        .sort({ createdAt: 1 }) 
        .populate("sender", "name username profilePicture");

    return messages;
};

const sendMessage = async (chatId, senderId, content) => {
    if (!content || !content.trim()) {
        throw new ApiError(400, "Message content cannot be empty");
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
        throw new ApiError(404, "Chat not found");
    }

    const message = await Message.create({
        chatId,
        sender: senderId,
        content: content.trim()
    });

    await Chat.findByIdAndUpdate(chatId, {
        latestMessage: {
            text: message.content,
            sentBy: senderId
        }
    });

    const populatedMessage = await message.populate("sender", "name username profilePicture");

    return populatedMessage;
};

const fetchChats = async (userId) => {
    const chats = await Chat.find({ members: userId })
        .populate("members", "name username profilePicture")
        .populate({
            path: "latestMessage.sentBy",
            select: "name username profilePicture"
        });

    const chatData = await Promise.all(chats.map(async (chat) => {
        const unreadCount = await Message.countDocuments({
            chatId: chat._id,
            sender: { $ne: userId },
            readBy: { $ne: userId }
        });

        return {
            ...chat.toObject(),
            unreadCount
        };
    }));

    return chatData;
};

const markChatAsRead = async (chatId, userId) => {
    const chat = await Chat.findById(chatId);
    if (!chat) {
        throw new ApiError(404, "Chat not found");
    }

    await Message.updateMany(
        {
            chatId,
            sender: { $ne: userId },
            readBy: { $ne: userId }
        },
        { $addToSet: { readBy: userId }, seen: true }
    );
};

module.exports = {
    accessChat,
    fetchMessages,
    sendMessage,
    fetchChats,
    markChatAsRead
};