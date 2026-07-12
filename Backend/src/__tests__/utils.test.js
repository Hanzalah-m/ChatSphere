const { formatUser } = require('../utils/helpers');
const ApiError = require('../utils/api.error');

describe('Utils', () => {
  describe('formatUser', () => {
    it('should format a user object correctly', () => {
      const mockUser = {
        _id: '123abc',
        username: 'testuser',
        email: 'test@test.com',
        password: 'hashedpassword123', // should be omitted
        profilePicture: 'pic.jpg',
        name: 'Test User'
      };

      const result = formatUser(mockUser);

      expect(result).toEqual({
        id: '123abc',
        username: 'testuser',
        email: 'test@test.com',
        profilePicture: 'pic.jpg',
        name: 'Test User'
      });
      expect(result).not.toHaveProperty('password');
    });

    it('should return null if no user is passed', () => {
      expect(formatUser(null)).toBeNull();
    });
  });

  describe('ApiError', () => {
    it('should create an error with status code and message', () => {
      const error = new ApiError(400, 'Bad Request');
      
      expect(error).toBeInstanceOf(Error);
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe('Bad Request');
    });
  });
});