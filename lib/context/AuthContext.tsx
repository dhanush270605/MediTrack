'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthContextType } from '../types';
import { api } from '../api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Map database snake_case keys to frontend camelCase User object
const mapUser = (dbUser: any): User => ({
  id: dbUser.id,
  email: dbUser.email,
  name: dbUser.full_name,
  role: dbUser.role as 'user' | 'caregiver',
  createdAt: new Date(dbUser.created_at || Date.now()),
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from token on initial load
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('meditrack_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        if (response.user) {
          setUser(mapUser(response.user));
        } else {
          localStorage.removeItem('meditrack_token');
        }
      } catch (err) {
        console.error('Session expired or invalid token');
        localStorage.removeItem('meditrack_token');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      
      const { token, user } = response;
      if (token) {
        localStorage.setItem('meditrack_token', token);
      }
      if (user) {
        setUser(mapUser(user));
      }
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    email: string,
    name: string,
    password: string,
    role: 'user' | 'caregiver'
  ) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/signup', {
        email,
        full_name: name,
        password,
        role,
      });

      const { token, user } = response;
      if (token) {
        localStorage.setItem('meditrack_token', token);
      }
      if (user) {
        setUser(mapUser(user));
      }
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('meditrack_token');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
