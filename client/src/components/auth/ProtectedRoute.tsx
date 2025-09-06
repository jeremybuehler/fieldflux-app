import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'manager' | 'user';
  requireEmailVerified?: boolean;
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole = 'user',
  requireEmailVerified = false,
  fallbackPath = '/login'
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    React.useEffect(() => {
      setLocation(fallbackPath);
    }, [setLocation, fallbackPath]);
    
    return null;
  }

  // Email verification required but not verified
  if (requireEmailVerified && user && !user.emailVerified) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="p-6 bg-amber-50 border border-amber-200 rounded-lg">
            <h2 className="text-xl font-semibold text-amber-800 mb-2">
              Email Verification Required
            </h2>
            <p className="text-amber-700 mb-4">
              Please verify your email address to continue. Check your inbox for a verification email.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => window.location.reload()}
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md font-medium"
              >
                I've Verified My Email
              </button>
              <p className="text-sm text-amber-600">
                Didn't receive an email? Check your spam folder or contact support.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Role-based access control
  if (user && requiredRole) {
    const roleHierarchy = {
      user: 0,
      manager: 1,
      admin: 2
    };

    const userRoleLevel = roleHierarchy[user.role] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

    if (userRoleLevel < requiredRoleLevel) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
          <div className="max-w-md w-full text-center space-y-4">
            <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
              <h2 className="text-xl font-semibold text-red-800 mb-2">
                Access Denied
              </h2>
              <p className="text-red-700 mb-4">
                You don't have sufficient permissions to access this page. Required role: {requiredRole}.
              </p>
              <button
                onClick={() => setLocation('/dashboard')}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  // All checks passed, render children
  return <>{children}</>;
};

export default ProtectedRoute;
