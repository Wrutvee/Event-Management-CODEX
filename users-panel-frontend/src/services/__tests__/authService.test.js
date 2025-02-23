import authService from '../authService';

describe('Auth Service Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  test('validateToken should return false when no token exists', () => {
    expect(authService.validateToken()).toBe(false);
  });

  test('getCurrentUser should return null when no user exists', () => {
    expect(authService.getCurrentUser()).toBeNull();
  });

  test('login should store token and user data', async () => {
    const mockResponse = {
      token: 'fake-token',
      refreshToken: 'fake-refresh-token',
      user: { id: 1, name: 'Test User' }
    };

    // Mock API call
    jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })
    );

    await authService.login({ 
      email: 'test@example.com', 
      password: 'password123',
      remember: true 
    });

    expect(localStorage.getItem('authToken')).toBe(mockResponse.token);
    expect(localStorage.getItem('user')).toBeTruthy();
  });
});