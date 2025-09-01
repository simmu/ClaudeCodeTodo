import { mockTodos } from './todos';
import { mockUsers, mockAuthResponse } from './users';

// API response fixtures for different scenarios

// Success responses
export const mockApiResponses = {
  // Todos
  getTodos: {
    success: true,
    data: mockTodos,
    meta: {
      total: mockTodos.length,
      page: 1,
      limit: 10,
      hasNextPage: false,
    },
  },
  
  getTodo: {
    success: true,
    data: mockTodos[0],
  },
  
  createTodo: {
    success: true,
    data: mockTodos[0],
    message: 'Todo created successfully',
  },
  
  updateTodo: {
    success: true,
    data: { ...mockTodos[0], title: 'Updated Todo' },
    message: 'Todo updated successfully',
  },
  
  deleteTodo: {
    success: true,
    message: 'Todo deleted successfully',
  },
  
  // Auth
  login: mockAuthResponse,
  
  register: {
    success: true,
    data: mockUsers[0],
    message: 'User registered successfully',
  },
  
  refreshToken: {
    success: true,
    data: {
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
      expiresIn: 86400,
    },
  },
  
  // User profile
  getProfile: {
    success: true,
    data: mockUsers[0],
  },
  
  updateProfile: {
    success: true,
    data: { ...mockUsers[0], name: 'Updated Name' },
    message: 'Profile updated successfully',
  },
};

// Error responses
export const mockApiErrors = {
  // Generic errors
  badRequest: {
    success: false,
    error: 'Bad Request',
    message: 'The request could not be processed',
    statusCode: 400,
  },
  
  unauthorized: {
    success: false,
    error: 'Unauthorized',
    message: 'Authentication required',
    statusCode: 401,
  },
  
  forbidden: {
    success: false,
    error: 'Forbidden',
    message: 'Access denied',
    statusCode: 403,
  },
  
  notFound: {
    success: false,
    error: 'Not Found',
    message: 'Resource not found',
    statusCode: 404,
  },
  
  internalServerError: {
    success: false,
    error: 'Internal Server Error',
    message: 'Something went wrong on our end',
    statusCode: 500,
  },
  
  // Specific errors
  todoNotFound: {
    success: false,
    error: 'Todo Not Found',
    message: 'The requested todo does not exist',
    statusCode: 404,
  },
  
  invalidCredentials: {
    success: false,
    error: 'Invalid Credentials',
    message: 'Email or password is incorrect',
    statusCode: 401,
  },
  
  emailAlreadyExists: {
    success: false,
    error: 'Email Already Exists',
    message: 'An account with this email already exists',
    statusCode: 409,
  },
  
  validationError: {
    success: false,
    error: 'Validation Error',
    message: 'Invalid input data',
    statusCode: 422,
    details: {
      title: ['Title is required'],
      email: ['Please enter a valid email address'],
    },
  },
  
  // Network errors
  networkError: {
    success: false,
    error: 'Network Error',
    message: 'Unable to connect to the server',
  },
  
  timeoutError: {
    success: false,
    error: 'Timeout Error',
    message: 'Request timed out',
  },
};

// Sync-related responses
export const mockSyncResponses = {
  syncSuccess: {
    success: true,
    data: {
      synced: mockTodos.slice(0, 2),
      conflicts: [],
      timestamp: new Date().toISOString(),
    },
    message: 'Sync completed successfully',
  },
  
  syncWithConflicts: {
    success: true,
    data: {
      synced: mockTodos.slice(0, 1),
      conflicts: [
        {
          id: 'todo-2',
          localVersion: mockTodos[1],
          remoteVersion: { ...mockTodos[1], title: 'Different Title' },
          conflictType: 'content',
        },
      ],
      timestamp: new Date().toISOString(),
    },
    message: 'Sync completed with conflicts',
  },
  
  syncError: {
    success: false,
    error: 'Sync Error',
    message: 'Failed to synchronize data',
    statusCode: 500,
  },
};

// Helper functions
export const createMockResponse = (data: any, status: number = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  statusText: status === 200 ? 'OK' : 'Error',
  json: async () => data,
  text: async () => JSON.stringify(data),
  headers: new Headers({
    'Content-Type': 'application/json',
  }),
});

export const createMockErrorResponse = (error: any, status: number = 400) => ({
  ok: false,
  status,
  statusText: 'Error',
  json: async () => error,
  text: async () => JSON.stringify(error),
  headers: new Headers({
    'Content-Type': 'application/json',
  }),
});