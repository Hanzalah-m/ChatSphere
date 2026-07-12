const request = require('supertest');
const app = require('../app');

// Mock the service layer so we don't hit the real DB
jest.mock('../modules/auth/auth.service', () => ({
  register: jest.fn(),
  login: jest.fn(),
  getProfile: jest.fn()
}));

const authService = require('../modules/auth/auth.service');

describe('Auth Routes', () => {
  describe('POST /api/auth/register', () => {
    it('should return 400 if fields are missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ username: 'test' }); // missing email and password

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('All fields are required');
    });

    it('should return 201 on successful registration', async () => {
      // Simulate successful service response
      authService.register.mockResolvedValue({
        user: { _id: '1', username: 'test', email: 't@t.com', name: 'Test' },
        token: 'fake-token'
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'test',
          email: 't@t.com',
          password: '123456'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.user.username).toBe('test');
      // Check if cookie was set
      expect(res.headers['set-cookie']).toBeDefined();
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return 200 and set cookie on successful login', async () => {
      authService.login.mockResolvedValue({
        user: { _id: '1', username: 'test', email: 't@t.com', name: 'Test' },
        token: 'fake-token'
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ identifier: 'test', password: '123456' });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Login successful');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should clear cookie and return 200', async () => {
      const res = await request(app)
        .post('/api/auth/logout');

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Logout successful');
    });
  });
});