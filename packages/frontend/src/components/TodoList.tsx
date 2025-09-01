import React, { useState, useMemo } from 'react';
import { TodoItem } from './TodoItem';
import type { LocalTodo } from '../services/db';
import type { TodoStatus, TodoPriority } from '../../../../shared/src/types';

interface TodoListProps {
  todos: LocalTodo[];
  onUpdate: (id: number, updates: Partial<LocalTodo>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onToggle: (id: number) => Promise<void>;
  onClearCompleted?: () => Promise<void>;
  loading?: boolean;
}

type FilterType = 'all' | 'pending' | 'completed' | 'archived';
type SortType = 'newest' | 'oldest' | 'priority' | 'dueDate';

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onUpdate,
  onDelete,
  onToggle,
  onClearCompleted,
  loading = false
}) => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('newest');

  const filteredAndSortedTodos = useMemo(() => {
    // Filter todos
    let filtered = todos;
    if (filter !== 'all') {
      filtered = todos.filter(todo => todo.status === filter);
    }

    // Sort todos
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'priority':
          const priorityOrder: Record<TodoPriority, number> = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        default:
          return 0;
      }
    });

    return sorted;
  }, [todos, filter, sortBy]);

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.status === 'completed').length;
    const pending = todos.filter(todo => todo.status === 'pending').length;
    const archived = todos.filter(todo => todo.status === 'archived').length;
    return { total, completed, pending, archived };
  }, [todos]);

  const filterOptions: { value: FilterType; label: string; count: number }[] = [
    { value: 'all', label: 'All', count: stats.total },
    { value: 'pending', label: 'Pending', count: stats.pending },
    { value: 'completed', label: 'Completed', count: stats.completed },
    { value: 'archived', label: 'Archived', count: stats.archived },
  ];

  const sortOptions: { value: SortType; label: string }[] = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'priority', label: 'Priority' },
    { value: 'dueDate', label: 'Due Date' },
  ];

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Filter:</span>
          <div className="flex space-x-1">
            {filterOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  filter === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                } border ${
                  filter === option.value ? 'border-blue-600' : 'border-gray-300'
                }`}
              >
                {option.label} ({option.count})
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortType)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {stats.completed > 0 && onClearCompleted && (
            <button
              onClick={onClearCompleted}
              className="px-3 py-1 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
            >
              Clear Completed ({stats.completed})
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading todos...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredAndSortedTodos.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === 'all' ? 'No todos yet' : `No ${filter} todos`}
          </h3>
          <p className="text-gray-600">
            {filter === 'all' 
              ? 'Create your first todo to get started!'
              : `You don't have any ${filter} todos.`
            }
          </p>
        </div>
      )}

      {/* Todo Items */}
      {!loading && filteredAndSortedTodos.length > 0 && (
        <div className="space-y-3">
          {filteredAndSortedTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}

      {/* Stats Summary */}
      {!loading && stats.total > 0 && (
        <div className="text-center text-sm text-gray-600 py-4">
          Showing {filteredAndSortedTodos.length} of {stats.total} todos
          {stats.completed > 0 && (
            <span> • {stats.completed} completed</span>
          )}
          {stats.pending > 0 && (
            <span> • {stats.pending} pending</span>
          )}
        </div>
      )}
    </div>
  );
};