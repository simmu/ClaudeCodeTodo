import { useState, useEffect, useCallback } from 'react';
import { todoService } from '../services/db';
import type { LocalTodo } from '../services/db';
import type { CreateTodo } from '../../../../shared/src/types';

export const useTodos = (userId: string) => {
  const [todos, setTodos] = useState<LocalTodo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const todosData = await todoService.getAllTodos(userId);
      setTodos(todosData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load todos');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      loadTodos();
    }
  }, [userId, loadTodos]);

  const addTodo = async (todoData: CreateTodo) => {
    try {
      setError(null);
      const newTodo = await todoService.addTodo({ ...todoData, userId });
      setTodos(prev => [newTodo, ...prev]);
      return newTodo;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add todo';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateTodo = async (id: number, updates: Partial<LocalTodo>) => {
    try {
      setError(null);
      await todoService.updateTodo(id, updates);
      setTodos(prev => prev.map(todo => 
        todo.id === id ? { ...todo, ...updates, updatedAt: new Date() } : todo
      ));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update todo';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      setError(null);
      await todoService.deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete todo';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const toggleTodo = async (id: number) => {
    try {
      setError(null);
      await todoService.toggleTodo(id);
      setTodos(prev => prev.map(todo => {
        if (todo.id === id) {
          return {
            ...todo,
            status: todo.status === 'completed' ? 'pending' : 'completed',
            updatedAt: new Date()
          };
        }
        return todo;
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle todo';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const clearCompleted = async () => {
    try {
      setError(null);
      await todoService.clearCompleted(userId);
      setTodos(prev => prev.filter(todo => todo.status !== 'completed'));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear completed todos';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const todosStats = {
    total: todos.length,
    completed: todos.filter(todo => todo.status === 'completed').length,
    pending: todos.filter(todo => todo.status === 'pending').length,
    archived: todos.filter(todo => todo.status === 'archived').length
  };

  return {
    todos,
    loading,
    error,
    todosStats,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    clearCompleted,
    refresh: loadTodos
  };
};