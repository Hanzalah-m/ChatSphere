describe('backend config loading', () => {
  afterEach(() => {
    jest.resetModules();
  });

  it('loads the JWT secret from the environment file when config is required', () => {
    delete process.env.JWT_SECRET;

    const config = require('../config');

    expect(config.JWT_SECRET).toBeDefined();
    expect(typeof config.JWT_SECRET).toBe('string');
  });
});
