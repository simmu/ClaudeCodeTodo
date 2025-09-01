import { beforeAll, afterAll, beforeEach, afterEach } from '@jest/globals';

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.DATABASE_URL = 'file:./test.db';

// Mock console methods in test environment
const originalConsole = { ...console };

beforeAll(() => {
  // Suppress console.log in tests unless debugging
  if (!process.env.DEBUG_TESTS) {
    console.log = jest.fn();
    console.info = jest.fn();
  }
});

afterAll(() => {
  // Restore console methods
  console.log = originalConsole.log;
  console.info = originalConsole.info;
});

beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();
});

afterEach(() => {
  // Clean up after each test
  jest.restoreAllMocks();
});

// Mock fetch for external API calls
global.fetch = jest.fn();

// Mock timers if needed
export const mockTimers = () => {
  jest.useFakeTimers();
};

export const restoreTimers = () => {
  jest.useRealTimers();
};