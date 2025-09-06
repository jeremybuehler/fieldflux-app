import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthForm, { RegisterFormData } from '@/components/auth/AuthForm';
import { useLocation } from 'wouter';

const RegisterPage: React.FC = () => {
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      setLocation('/dashboard');
    }
  }, [isAuthenticated, setLocation]);

  const handleRegister = async (data: RegisterFormData) => {
    setError('');
    setLoading(true);

    try {
      await register(data);
      // Success - redirect is handled by AuthContext
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      mode="register"
      onSubmit={handleRegister}
      loading={loading}
      error={error}
    />
  );
};

export default RegisterPage;
