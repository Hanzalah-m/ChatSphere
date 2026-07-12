const authService = require('../modules/auth/auth.service');
const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const ApiError = require('../utils/api.error');

// Mock external dependencies
jest.mock('../models/user.model');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mocked-jwt-token')
}));

describe('Auth Service', () => {
  describe('register', () => {
    it('should throw ApiError if user already exists', async () => {
      // Simulate database finding an existing user
      userModel.findOne.mockResolvedValue({ username: 'existinguser' });

      await expect(
        authService.register({ username: 'existinguser', email: 'e@e.com', password: '123456' })
      ).rejects.toThrow(ApiError);

      await expect(
        authService.register({ username: 'existinguser', email: 'e@e.com', password: '123456' })
      ).rejects.toThrow('Username or email already exists');
    });

    it('should create user and return token on successful register', async () => {
      // Simulate no user found
      userModel.findOne.mockResolvedValue(null);
      // Simulate password hashing
      bcrypt.hash.mockResolvedValue('hashed_password');
      // Simulate user creation
      userModel.create.mockResolvedValue({
        _id: '123',
        username: 'newuser',
        email: 'new@new.com'
      });

      const result = await authService.register({
        username: 'newuser',
        email: 'new@new.com',
        password: '123456'
      });

      expect(userModel.create).toHaveBeenCalled();
      expect(result.token).toBe('mocked-jwt-token');
      expect(result.user.username).toBe('newuser');
    });
  });

  describe('login', () => {
    it('should throw ApiError if user not found', async () => {
      userModel.findOne.mockResolvedValue(null);

      await expect(
        authService.login('nonexistent', '123456')
      ).rejects.toThrow('Invalid credentials');
    });

    it('should throw ApiError if password is incorrect', async () => {
      userModel.findOne.mockResolvedValue({ password: 'hashed' });
      bcrypt.compare.mockResolvedValue(false); // Password doesn't match

      await expect(
        authService.login('existinguser', 'wrongpassword')
      ).rejects.toThrow('Invalid credentials');
    });
  });
});