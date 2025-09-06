import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthForm, { ResetPasswordFormData } from '@/components/auth/AuthForm';
import { useLocation, useRoute } from 'wouter';

const ResetPasswordPage: React.FC = () => {
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string>('');
  const { resetPassword } = useAuth();
  const [, setLocation] = useLocation();
  const [match, params] = useRoute('/reset-password/:token');

  useEffect(() => {
    if (match && params?.token) {
      setToken(params.token);
    } else {
      // If no token in URL, redirect to forgot password
      setLocation('/forgot-password');
    }
  }, [match, params, setLocation]);

  const handleResetPassword = async (data: ResetPasswordFormData) => {
    if (!token) {
      setError('Invalid or missing reset token.');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await resetPassword(token, data.password);
      setSuccess('Your password has been successfully reset.');
      // Redirect handled by AuthContext
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return null; // Will redirect via useEffect
  }

  return (
    <AuthForm
      mode="reset-password"
      onSubmit={handleResetPassword}
      loading={loading}
      error={error}
      success={success}
      resetToken={token}
    />
  );
};

export default ResetPasswordPage;
