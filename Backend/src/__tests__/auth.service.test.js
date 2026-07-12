const authService = require('../modules/auth/auth.service');
const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const ApiError = require('../utils/api.error');

// Mock external dependencies
jest.mock('../models/user.model');
jest.mock('../config/uploadHelper', () => ({ uploadToCloudinary: jest.fn() }));
jest.mock('bcryptjs');
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mocked-jwt-token')
}));

const { uploadToCloudinary } = require('../config/uploadHelper');

const createQuery = (result) => ({ select: jest.fn().mockResolvedValue(result) });

afterEach(() => {
  jest.clearAllMocks();
});

describe('Auth Service', () => {
  describe('register', () => {
    it('should throw ApiError if user already exists', async () => {
      userModel.findOne.mockResolvedValue({ username: 'existinguser' });

      await expect(
        authService.register({ username: 'existinguser', email: 'e@e.com', password: '123456' })
      ).rejects.toThrow(ApiError);

      await expect(
        authService.register({ username: 'existinguser', email: 'e@e.com', password: '123456' })
      ).rejects.toThrow('Username or email already exists');
    });

    it('should create user and return token on successful register', async () => {
      userModel.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashed_password');
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

      expect(userModel.create).toHaveBeenCalledWith({
        username: 'newuser',
        email: 'new@new.com',
        password: 'hashed_password',
        profilePicture: undefined,
        name: undefined
      });
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
      bcrypt.compare.mockResolvedValue(false);

      await expect(
        authService.login('existinguser', 'wrongpassword')
      ).rejects.toThrow('Invalid credentials');
    });

    it('should return user and token on successful login', async () => {
      userModel.findOne.mockResolvedValue({ _id: '123', password: 'hashed' });
      bcrypt.compare.mockResolvedValue(true);

      const result = await authService.login('existinguser', 'password123');

      expect(result.token).toBe('mocked-jwt-token');
      expect(result.user._id).toBe('123');
    });
  });

  describe('getProfile', () => {
    it('should return a user when found', async () => {
      const mockUser = { _id: '123', username: 'testuser', email: 'test@test.com' };
      userModel.findById.mockReturnValue(createQuery(mockUser));

      const result = await authService.getProfile('123');

      expect(userModel.findById).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockUser);
    });

    it('should throw ApiError if user not found', async () => {
      userModel.findById.mockReturnValue(createQuery(null));

      await expect(authService.getProfile('123')).rejects.toThrow('User not found');
    });
  });

  describe('updateProfile', () => {
    it('should partially update only provided fields', async () => {
      const updatedUser = { _id: '123', username: 'testuser', name: 'New Name' };
      userModel.findByIdAndUpdate.mockReturnValue(createQuery(updatedUser));

      const result = await authService.updateProfile('123', { name: 'New Name' });

      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '123',
        { name: 'New Name' },
        { new: true, runValidators: true }
      );
      expect(result).toEqual(updatedUser);
    });

    it('should throw ApiError if user not found', async () => {
      userModel.findByIdAndUpdate.mockReturnValue(createQuery(null));

      await expect(authService.updateProfile('123', { email: 'new@test.com' }))
        .rejects.toThrow('User not found');
    });
  });

  describe('updateProfilePicture', () => {
    it('should throw ApiError when no file is provided', async () => {
      await expect(authService.updateProfilePicture('123', null))
        .rejects.toThrow('No file provided');
    });

    it('should upload file and update profile picture', async () => {
      const updatedUser = { _id: '123', profilePicture: 'https://cloudinary/test.png' };
      uploadToCloudinary.mockResolvedValue('https://cloudinary/test.png');
      userModel.findByIdAndUpdate.mockReturnValue(createQuery(updatedUser));

      const result = await authService.updateProfilePicture('123', { path: '/tmp/test.png' });

      expect(uploadToCloudinary).toHaveBeenCalledWith('/tmp/test.png');
      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '123',
        { profilePicture: 'https://cloudinary/test.png' },
        { new: true }
      );
      expect(result).toEqual(updatedUser);
    });

    it('should throw ApiError if user not found after upload', async () => {
      uploadToCloudinary.mockResolvedValue('https://cloudinary/test.png');
      userModel.findByIdAndUpdate.mockReturnValue(createQuery(null));

      await expect(authService.updateProfilePicture('123', { path: '/tmp/test.png' }))
        .rejects.toThrow('User not found');
    });
  });
});
