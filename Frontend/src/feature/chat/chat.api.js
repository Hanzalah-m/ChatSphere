import api from "../../APIs";

// 1. Create or find a chat room with a clicked user
export const accessChatApi = async (userId) => {
    const response = await api.post(`/api/chats/access/${userId}`);
    return response.data.chat;
};

// 2. Get all messages for a specific chat room
export const fetchMessagesApi = async (chatId) => {
    const response = await api.get(`/api/chats/messages/${chatId}`);
    return response.data.messages;
};

// 3. Send a message in the selected chat room
export const sendMessageApi = async (chatId, content) => {
    const response = await api.post(`/api/chats/messages/${chatId}`, { content });
    return response.data.message;
};

// 4. Fetch all chat rooms for the current user
export const fetchChatsApi = async () => {
    const response = await api.get(`/api/chats`);
    return response.data.chats;
};

// 5. Mark all messages in a chat as read by the current user
export const markAsReadApi = async (chatId) => {
    const response = await api.post(`/api/chats/read/${chatId}`);
    return response.data;
};