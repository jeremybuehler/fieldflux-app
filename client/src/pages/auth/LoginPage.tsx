import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthForm, { LoginFormData } from '@/components/auth/AuthForm';
import { useLocation } from 'wouter';

const LoginPage: React.FC = () => {
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      setLocation('/dashboard');
    }
  }, [isAuthenticated, setLocation]);

  const handleLogin = async (data: LoginFormData) => {
    setError('');
    setLoading(true);

    try {
      await login(data);
      // Success - redirect is handled by AuthContext
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      mode="login"
      onSubmit={handleLogin}
      loading={loading}
      error={error}
    />
  );
};

export default LoginPage;
