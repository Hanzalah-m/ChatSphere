const request = require('supertest');
const app = require('../app');
const ApiError = require('../utils/api.error');

jest.mock('../modules/chat/chat.service', () => ({
  accessChat: jest.fn(),
  fetchMessages: jest.fn()
}));

jest.mock('../middlewares/auth.middleware', () => ({
  verifyToken: (req, res, next) => {
    req.user = { id: '123' };
    next();
  }
}));

const chatService = require('../modules/chat/chat.service');

afterEach(() => {
  jest.clearAllMocks();
});

describe('Chat Routes', () => {
  describe('POST /api/chats/access/:userId', () => {
    it('should return 400 when trying to chat with yourself', async () => {
      chatService.accessChat.mockRejectedValue(new ApiError(400, 'You cannot start a chat with yourself'));

      const res = await request(app)
        .post('/api/chats/access/123');

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('You cannot start a chat with yourself');
    });

    it('should return 200 and a chat on success', async () => {
      chatService.accessChat.mockResolvedValue({
        _id: 'chat1',
        members: ['123', '456']
      });

      const res = await request(app)
        .post('/api/chats/access/456');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.chat._id).toBe('chat1');
    });
  });
});
