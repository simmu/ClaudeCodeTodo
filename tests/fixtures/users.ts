// Mock user data for testing
export const mockUsers = [
  {
    id: 'user-1',
    email: 'john.doe@example.com',
    name: 'John Doe',
    createdAt: '2024-01-10T08:00:00.000Z',
    updatedAt: '2024-01-15T12:30:00.000Z',
    isEmailVerified: true,
    role: 'user' as const,
  },
  {
    id: 'user-2',
    email: 'jane.smith@example.com',
    name: 'Jane Smith',
    createdAt: '2024-01-12T10:15:00.000Z',
    updatedAt: '2024-01-14T16:45:00.000Z',
    isEmailVerified: true,
    role: 'user' as const,
  },
  {
    id: 'admin-1',
    email: 'admin@example.com',
    name: 'Admin User',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-15T18:20:00.000Z',
    isEmailVerified: true,
    role: 'admin' as const,
  },
];

export const mockUserRegistrationRequest = {
  email: 'newuser@example.com',
  name: 'New User',
  password: 'securePassword123!',
  confirmPassword: 'securePassword123!',
};

export const mockUserLoginRequest = {
  email: 'john.doe@example.com',
  password: 'password123',
};

export const mockUserUpdateRequest = {
  name: 'John Updated',
  email: 'john.updated@example.com',
};

// JWT token fixtures
export const mockJwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEiLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNzA1MzI2MDAwLCJleHAiOjE3MDU0MTI0MDB9.test-signature';

export const mockRefreshToken = 'refresh-token-example-123456789';

export const mockAuthResponse = {
  user: mockUsers[0],
  accessToken: mockJwtToken,
  refreshToken: mockRefreshToken,
  expiresIn: 86400, // 24 hours
};

// Helper functions for creating test data
export const createMockUser = (overrides: Partial<any> = {}) => ({
  id: `user-${Date.now()}`,
  email: 'test@example.com',
  name: 'Test User',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isEmailVerified: false,
  role: 'user' as const,
  ...overrides,
});

export const createMockAuthState = (overrides: Partial<any> = {}) => ({
  isAuthenticated: true,
  user: mockUsers[0],
  token: mockJwtToken,
  refreshToken: mockRefreshToken,
  isLoading: false,
  error: null,
  ...overrides,
});