import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import api from '../lib/api';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin' | 'staff';
  address?: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user on mount if token exists
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.data.user);
    } catch (error: any) {
      console.error('Failed to fetch user:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data.data;
      localStorage.setItem('token', token);
      setUser(user);
      toast.success(`Welcome back, ${user.name}!`);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(message);
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    try {
      const response = await api.post('/auth/register', { name, email, password, phone });
      const { user, token } = response.data.data;
      localStorage.setItem('token', token);
      setUser(user);
      toast.success(`Welcome to koshari101, ${user.name}!`);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
  }, []);

  const updateProfile = async (data: Partial<User>) => {
    try {
      const response = await api.put('/auth/profile', data);
      setUser(response.data.data.user);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateProfile,
    refreshUser: fetchUser
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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
