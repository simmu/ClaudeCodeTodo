import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock data generators
export const generateMockTodo = (overrides: Partial<any> = {}) => ({
  id: Math.random().toString(36).substring(7),
  title: 'Test Todo',
  description: 'Test description',
  completed: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  userId: 'user-123',
  ...overrides,
});

export const generateMockUser = (overrides: Partial<any> = {}) => ({
  id: Math.random().toString(36).substring(7),
  email: 'test@example.com',
  name: 'Test User',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

// Test wrapper providers
interface AllTheProvidersProps {
  children: ReactNode;
}

const AllTheProviders = ({ children }: AllTheProvidersProps) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </BrowserRouter>
  );
};

// Custom render function that includes providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything from React Testing Library
export * from '@testing-library/react';
export { customRender as render };

// Utility functions for async testing
export const waitForLoadingToFinish = () =>
  new Promise((resolve) => setTimeout(resolve, 0));

// Mock API response helpers
export const mockApiSuccess = (data: any) => ({
  ok: true,
  status: 200,
  json: async () => data,
  headers: new Headers(),
  redirected: false,
  statusText: 'OK',
  type: 'basic' as ResponseType,
  url: '',
  clone: jest.fn(),
  body: null,
  bodyUsed: false,
  arrayBuffer: jest.fn(),
  blob: jest.fn(),
  formData: jest.fn(),
  text: jest.fn(),
});

export const mockApiError = (status: number = 400, message: string = 'Bad Request') => ({
  ok: false,
  status,
  json: async () => ({ error: message }),
  headers: new Headers(),
  redirected: false,
  statusText: message,
  type: 'basic' as ResponseType,
  url: '',
  clone: jest.fn(),
  body: null,
  bodyUsed: false,
  arrayBuffer: jest.fn(),
  blob: jest.fn(),
  formData: jest.fn(),
  text: jest.fn(),
});

// Local storage test helpers
export const mockLocalStorage = () => {
  const store: { [key: string]: string } = {};
  
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach(key => delete store[key]);
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
  };
};

// Time-related test helpers
export const mockDate = (date: string | Date) => {
  const mockDate = new Date(date);
  const spy = jest.spyOn(global, 'Date').mockImplementation((...args) => {
    if (args.length === 0) {
      return mockDate;
    }
    return new (Date as any)(...args);
  });
  
  return spy;
};

// Network simulation helpers
export const simulateNetworkDelay = (ms: number = 100) =>
  new Promise(resolve => setTimeout(resolve, ms));

export const simulateNetworkError = () => {
  throw new Error('Network Error');
};