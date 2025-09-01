// Mock todo data for testing
export const mockTodos = [
  {
    id: 'todo-1',
    title: 'Buy groceries',
    description: 'Milk, bread, eggs, and fruits',
    completed: false,
    createdAt: '2024-01-15T09:00:00.000Z',
    updatedAt: '2024-01-15T09:00:00.000Z',
    userId: 'user-1',
    priority: 'medium' as const,
    dueDate: '2024-01-16T18:00:00.000Z',
  },
  {
    id: 'todo-2',
    title: 'Finish project report',
    description: 'Complete the quarterly analysis and submit to manager',
    completed: true,
    createdAt: '2024-01-14T10:30:00.000Z',
    updatedAt: '2024-01-15T16:45:00.000Z',
    userId: 'user-1',
    priority: 'high' as const,
    dueDate: '2024-01-15T17:00:00.000Z',
  },
  {
    id: 'todo-3',
    title: 'Call dentist',
    description: 'Schedule appointment for teeth cleaning',
    completed: false,
    createdAt: '2024-01-13T14:20:00.000Z',
    updatedAt: '2024-01-13T14:20:00.000Z',
    userId: 'user-1',
    priority: 'low' as const,
    dueDate: null,
  },
  {
    id: 'todo-4',
    title: 'Review code changes',
    description: 'Review pull requests for the new feature',
    completed: false,
    createdAt: '2024-01-15T11:15:00.000Z',
    updatedAt: '2024-01-15T11:15:00.000Z',
    userId: 'user-2',
    priority: 'high' as const,
    dueDate: '2024-01-16T09:00:00.000Z',
  },
  {
    id: 'todo-5',
    title: 'Plan weekend trip',
    description: 'Research destinations and book accommodation',
    completed: false,
    createdAt: '2024-01-12T19:30:00.000Z',
    updatedAt: '2024-01-14T12:00:00.000Z',
    userId: 'user-1',
    priority: 'low' as const,
    dueDate: '2024-01-20T23:59:59.000Z',
  },
];

export const mockTodoCreateRequest = {
  title: 'New test todo',
  description: 'This is a test todo for unit testing',
  priority: 'medium' as const,
  dueDate: '2024-01-20T12:00:00.000Z',
};

export const mockTodoUpdateRequest = {
  title: 'Updated test todo',
  description: 'This todo has been updated',
  completed: true,
  priority: 'high' as const,
};

// Helper functions for creating test data
export const createMockTodo = (overrides: Partial<any> = {}) => ({
  id: `todo-${Date.now()}`,
  title: 'Test Todo',
  description: 'Test description',
  completed: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  userId: 'user-1',
  priority: 'medium' as const,
  dueDate: null,
  ...overrides,
});

export const createMockTodoList = (count: number = 5) => {
  return Array.from({ length: count }, (_, index) =>
    createMockTodo({
      id: `todo-${index + 1}`,
      title: `Todo ${index + 1}`,
      completed: index % 3 === 0, // Make every third todo completed
    })
  );
};