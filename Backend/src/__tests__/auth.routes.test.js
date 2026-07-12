const request = require('supertest');
const app = require('../app');

jest.mock('../modules/auth/auth.service', () => ({
  register: jest.fn(),
  login: jest.fn(),
  getProfile: jest.fn(),
  updateProfile: jest.fn(),
  updateProfilePicture: jest.fn()
}));

jest.mock('../middlewares/auth.middleware', () => ({
  verifyToken: (req, res, next) => {
    req.user = { id: '123' };
    next();
  }
}));

const authService = require('../modules/auth/auth.service');

afterEach(() => {
  jest.clearAllMocks();
});

describe('Auth Routes', () => {
  describe('POST /api/auth/register', () => {
    it('should return 400 if fields are missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ username: 'test' });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('All fields are required');
    });

    it('should return 201 on successful registration', async () => {
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
      expect(res.headers['set-cookie']).toBeDefined();
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return 400 if fields are missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ identifier: 'test' });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('All fields are required');
    });

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
      expect(res.headers['set-cookie']).toBeDefined();
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

  describe('GET /api/auth/profile', () => {
    it('should return user profile when authenticated', async () => {
      authService.getProfile.mockResolvedValue({
        _id: '123',
        username: 'test',
        email: 'test@t.com',
        name: 'Test'
      });

      const res = await request(app)
        .get('/api/auth/profile');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.username).toBe('test');
    });
  });

  describe('PUT /api/auth/profile', () => {
    it('should update the profile successfully', async () => {
      authService.updateProfile.mockResolvedValue({
        _id: '123',
        username: 'newname',
        email: 'new@test.com',
        name: 'New Name'
      });

      const res = await request(app)
        .put('/api/auth/profile')
        .send({ username: 'newname', name: 'New Name' });

      expect(res.statusCode).toBe(200);
      expect(res.body.user.username).toBe('newname');
    });
  });

  describe('PUT /api/auth/profile/picture', () => {
    it('should update the profile picture successfully', async () => {
      authService.updateProfilePicture.mockResolvedValue({
        _id: '123',
        profilePicture: 'https://cloudinary/test.png'
      });

      const res = await request(app)
        .put('/api/auth/profile/picture')
        .attach('image', Buffer.from('fake-image'), 'profile.png');

      expect(res.statusCode).toBe(200);
      expect(res.body.user.profilePicture).toBe('https://cloudinary/test.png');
    });
  });
});
