import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';

// Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
  role: 'admin' | 'manager' | 'user';
  lastLogin?: string;
  createdAt: string;
  tenantMemberships: TenantMembership[];
}

export interface TenantMembership {
  id: string;
  role: 'owner' | 'admin' | 'member';
  tenant: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  refreshToken: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API functions
const authApi = {
  async fetchUser(): Promise<User> {
    const response = await fetch('/api/auth/user', {
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Not authenticated');
    }
    
    return response.json();
  },

  async login(credentials: LoginCredentials): Promise<User> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  },

  async register(userData: RegisterData): Promise<User> {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return response.json();
  },

  async logout(): Promise<void> {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }
  },

  async forgotPassword(email: string): Promise<void> {
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Password reset request failed');
    }
  },

  async resetPassword(token: string, password: string): Promise<void> {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Password reset failed');
    }
  },

  async refreshToken(): Promise<User> {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    return response.json();
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Profile update failed');
    }

    return response.json();
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const response = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ currentPassword, newPassword })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Password change failed');
    }
  },

  async resendVerificationEmail(): Promise<void> {
    const response = await fetch('/api/auth/resend-verification', {
      method: 'POST',
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to resend verification email');
    }
  },

  async verifyEmail(token: string): Promise<void> {
    const response = await fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Email verification failed');
    }
  }
};

// Auth Provider Component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  // Query for current user
  const {
    data: user = null,
    isLoading,
    error
  } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: authApi.fetchUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes (was cacheTime)
  });

  const isAuthenticated = !!user && !error;

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (userData) => {
      queryClient.setQueryData(['auth', 'user'], userData);
      setLocation('/dashboard');
    },
    onError: (error) => {
      console.error('Login failed:', error);
    }
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (userData) => {
      queryClient.setQueryData(['auth', 'user'], userData);
      setLocation('/dashboard');
    },
    onError: (error) => {
      console.error('Registration failed:', error);
    }
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.setQueryData(['auth', 'user'], null);
      queryClient.clear(); // Clear all cached data
      setLocation('/login');
    },
    onError: (error) => {
      console.error('Logout failed:', error);
      // Even if logout fails on server, clear client state
      queryClient.setQueryData(['auth', 'user'], null);
      queryClient.clear();
      setLocation('/login');
    }
  });

  // Forgot password mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: authApi.forgotPassword,
    onError: (error) => {
      console.error('Forgot password failed:', error);
    }
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      authApi.resetPassword(token, password),
    onSuccess: () => {
      setLocation('/login?message=password-reset-success');
    },
    onError: (error) => {
      console.error('Reset password failed:', error);
    }
  });

  // Refresh token mutation
  const refreshTokenMutation = useMutation({
    mutationFn: authApi.refreshToken,
    onSuccess: (userData) => {
      queryClient.setQueryData(['auth', 'user'], userData);
    },
    onError: () => {
      // If refresh fails, log out
      queryClient.setQueryData(['auth', 'user'], null);
      setLocation('/login');
    }
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (userData) => {
      queryClient.setQueryData(['auth', 'user'], userData);
    },
    onError: (error) => {
      console.error('Profile update failed:', error);
    }
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      authApi.changePassword(currentPassword, newPassword),
    onError: (error) => {
      console.error('Password change failed:', error);
    }
  });

  // Resend verification email mutation
  const resendVerificationEmailMutation = useMutation({
    mutationFn: authApi.resendVerificationEmail,
    onError: (error) => {
      console.error('Resend verification email failed:', error);
    }
  });

  // Verify email mutation
  const verifyEmailMutation = useMutation({
    mutationFn: authApi.verifyEmail,
    onSuccess: () => {
      // Refetch user data to update email verification status
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
    },
    onError: (error) => {
      console.error('Email verification failed:', error);
    }
  });

  // Context value
  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login: async (credentials: LoginCredentials) => {
      await loginMutation.mutateAsync(credentials);
    },
    register: async (userData: RegisterData) => {
      await registerMutation.mutateAsync(userData);
    },
    logout: async () => {
      await logoutMutation.mutateAsync();
    },
    forgotPassword: async (email: string) => {
      await forgotPasswordMutation.mutateAsync(email);
    },
    resetPassword: async (token: string, password: string) => {
      await resetPasswordMutation.mutateAsync({ token, password });
    },
    refreshToken: async () => {
      await refreshTokenMutation.mutateAsync();
    },
    updateProfile: async (data: Partial<User>) => {
      await updateProfileMutation.mutateAsync(data);
    },
    changePassword: async (currentPassword: string, newPassword: string) => {
      await changePasswordMutation.mutateAsync({ currentPassword, newPassword });
    },
    resendVerificationEmail: async () => {
      await resendVerificationEmailMutation.mutateAsync();
    },
    verifyEmail: async (token: string) => {
      await verifyEmailMutation.mutateAsync(token);
    }
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Hook for protecting routes
export const useRequireAuth = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation('/login');
    }
  }, [isAuthenticated, isLoading, setLocation]);

  return { isAuthenticated, isLoading };
};

export default AuthProvider;
