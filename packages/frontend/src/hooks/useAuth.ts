import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/db';
import type { LocalUser } from '../services/db';

// Mock authentication for offline-first approach
// In a real app, this would integrate with backend auth
export const useAuth = () => {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const currentUser = await userService.getCurrentUser();
      setUser(currentUser || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email: string, _password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock login logic - in real app, this would call backend
      // For now, just create/find user by email
      let currentUser = await userService.getCurrentUser();
      
      if (!currentUser || currentUser.email !== email) {
        // Create new user for this session
        currentUser = await userService.addUser({
          email,
          name: email.split('@')[0] // Use part before @ as name
        });
      }
      
      setUser(currentUser);
      return currentUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, _password: string, name: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock registration logic
      const newUser = await userService.addUser({
        email,
        name
      });
      
      setUser(newUser);
      return newUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      setUser(null);
      // In a real app, this would clear tokens, etc.
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Logout failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateProfile = async (updates: Partial<Pick<LocalUser, 'name' | 'email'>>) => {
    try {
      setError(null);
      if (user?.id) {
        await userService.updateUser(user.id, updates);
        setUser(prev => prev ? { ...prev, ...updates, updatedAt: new Date() } : null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Profile update failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    refresh: loadUser
  };
};