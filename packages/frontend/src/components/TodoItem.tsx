import React, { useState } from 'react';
import type { LocalTodo } from '../services/db';
import type { TodoPriority, TodoStatus } from '../../../../shared/src/types';

interface TodoItemProps {
  todo: LocalTodo;
  onUpdate: (id: number, updates: Partial<LocalTodo>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onToggle: (id: number) => Promise<void>;
}

export const TodoItem: React.FC<TodoItemProps> = ({ 
  todo, 
  onUpdate, 
  onDelete, 
  onToggle 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [editPriority, setEditPriority] = useState(todo.priority);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    if (!todo.id) return;
    setIsLoading(true);
    try {
      await onToggle(todo.id);
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!todo.id || !confirm('Are you sure you want to delete this todo?')) return;
    setIsLoading(true);
    try {
      await onDelete(todo.id);
    } catch (error) {
      console.error('Failed to delete todo:', error);
      setIsLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!todo.id || !editTitle.trim()) return;
    setIsLoading(true);
    try {
      await onUpdate(todo.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
        priority: editPriority
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update todo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setEditPriority(todo.priority);
    setIsEditing(false);
  };

  const priorityColors: Record<TodoPriority, string> = {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-red-100 text-red-800 border-red-200'
  };

  const statusColors: Record<TodoStatus, string> = {
    pending: 'bg-blue-50 border-blue-200',
    completed: 'bg-green-50 border-green-200',
    archived: 'bg-gray-50 border-gray-200'
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && todo.status !== 'completed';

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-4 transition-all ${
      statusColors[todo.status]
    } ${isOverdue ? 'border-red-300 bg-red-50' : ''}`}>
      <div className="flex items-start space-x-3">
        {/* Checkbox */}
        <button
          onClick={handleToggle}
          disabled={isLoading}
          className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
            todo.status === 'completed'
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 hover:border-green-500'
          } ${isLoading ? 'opacity-50' : ''}`}
        >
          {todo.status === 'completed' && (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Description..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <select
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value as TodoPriority)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveEdit}
                  disabled={!editTitle.trim() || isLoading}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={isLoading}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between">
                <h3 className={`text-lg font-medium ${
                  todo.status === 'completed' 
                    ? 'line-through text-gray-500' 
                    : 'text-gray-900'
                }`}>
                  {todo.title}
                </h3>
                <div className="flex items-center space-x-2 ml-2">
                  {/* Priority Badge */}
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${priorityColors[todo.priority]}`}>
                    {todo.priority}
                  </span>
                  {/* Sync Status */}
                  {todo.syncStatus === 'pending' && (
                    <span className="w-2 h-2 bg-orange-400 rounded-full" title="Pending sync" />
                  )}
                </div>
              </div>

              {todo.description && (
                <p className={`mt-1 text-sm ${
                  todo.status === 'completed' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {todo.description}
                </p>
              )}

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Created {formatDate(todo.createdAt)}</span>
                  {todo.dueDate && (
                    <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                      Due {formatDate(todo.dueDate)}
                    </span>
                  )}
                  {todo.tags.length > 0 && (
                    <div className="flex space-x-1">
                      {todo.tags.map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    disabled={isLoading}
                    className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};