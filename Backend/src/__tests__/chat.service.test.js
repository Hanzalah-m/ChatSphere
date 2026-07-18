const chatService = require('../modules/chat/chat.service');
const Chat = require('../models/chat');
const Message = require('../models/messege');
const ApiError = require('../utils/api.error');

jest.mock('../models/chat');
jest.mock('../models/messege');

afterEach(() => {
  jest.clearAllMocks();
});

describe('Chat Service', () => {
  describe('accessChat', () => {
    it('should throw an error when trying to chat with yourself', async () => {
      await expect(chatService.accessChat('user1', 'user1')).rejects.toThrow(ApiError);
      await expect(chatService.accessChat('user1', 'user1')).rejects.toThrow('You cannot start a chat with yourself');
    });

    it('should return an existing chat if one is already found', async () => {
      const mockChat = { _id: 'chat1', members: ['user1', 'user2'] };
      Chat.findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockChat)
      });

      const result = await chatService.accessChat('user1', 'user2');

      expect(Chat.findOne).toHaveBeenCalledWith({
        members: { $all: ['user1', 'user2'] }
      });
      expect(result).toEqual(mockChat);
    });

    it('should create a new chat if none exists', async () => {
      Chat.findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });
      Chat.create.mockResolvedValue({ _id: 'chat2', members: ['user1', 'user2'] });

      const result = await chatService.accessChat('user1', 'user2');

      expect(Chat.create).toHaveBeenCalledWith({ members: ['user1', 'user2'] });
      expect(result).toEqual({ _id: 'chat2', members: ['user1', 'user2'] });
    });
  });

  describe('fetchMessages', () => {
    it('should return messages sorted by creation time', async () => {
      const mockMessages = [{ _id: 'm2' }, { _id: 'm1' }];
      Message.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockMessages)
        })
      });

      const result = await chatService.fetchMessages('chat1');

      expect(Message.find).toHaveBeenCalledWith({ chatId: 'chat1' });
      expect(result).toEqual(mockMessages);
    });
  });
});
