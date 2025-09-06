import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthForm, { ForgotPasswordFormData } from '@/components/auth/AuthForm';

const ForgotPasswordPage: React.FC = () => {
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useAuth();

  const handleForgotPassword = async (data: ForgotPasswordFormData) => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await forgotPassword(data.email);
      setSuccess('Password reset instructions have been sent to your email address.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      mode="forgot-password"
      onSubmit={handleForgotPassword}
      loading={loading}
      error={error}
      success={success}
    />
  );
};

export default ForgotPasswordPage;
