import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation, useRoute, Link } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle, Mail, ArrowLeft } from "lucide-react";

const VerifyEmailPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  
  const { verifyEmail, resendVerificationEmail, isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();
  const [match, params] = useRoute('/verify-email/:token');

  useEffect(() => {
    const handleVerification = async () => {
      if (!match || !params?.token) {
        setError('Invalid or missing verification token.');
        setLoading(false);
        return;
      }

      try {
        await verifyEmail(params.token);
        setSuccess(true);
        setError('');
        
        // Redirect to dashboard after successful verification
        setTimeout(() => {
          setLocation('/dashboard');
        }, 3000);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Email verification failed.');
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    };

    handleVerification();
  }, [match, params, verifyEmail, setLocation]);

  const handleResendVerification = async () => {
    if (!isAuthenticated) {
      setError('You must be logged in to resend verification email.');
      return;
    }

    setResendLoading(true);
    setResendSuccess(false);

    try {
      await resendVerificationEmail();
      setResendSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend verification email.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4">
      <div className="w-full max-w-md">
        {/* Logo and branding */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
              style={{ backgroundColor: "#F97316" }}
            >
              FF
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">FieldFlux</h1>
              <p className="text-sm text-slate-600">Field Service Marketing</p>
            </div>
          </div>
        </div>

        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-slate-900">
                Email Verification
              </CardTitle>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
            </div>
            <CardDescription className="text-slate-600">
              {loading ? 'Verifying your email address...' : 
               success ? 'Your email has been successfully verified!' : 
               'Email verification failed'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
                <span className="ml-3 text-slate-600">Verifying your email...</span>
              </div>
            )}

            {/* Success State */}
            {success && !loading && (
              <Alert className="border-green-200 bg-green-50 text-green-800">
                <CheckCircle className="w-4 h-4" />
                <AlertDescription>
                  Your email address has been successfully verified! You will be redirected to the dashboard in a few seconds.
                </AlertDescription>
              </Alert>
            )}

            {/* Error State */}
            {error && !loading && (
              <Alert className="border-red-200 bg-red-50 text-red-800">
                <XCircle className="w-4 h-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Resend Email Success */}
            {resendSuccess && (
              <Alert className="border-blue-200 bg-blue-50 text-blue-800">
                <Mail className="w-4 h-4" />
                <AlertDescription>
                  A new verification email has been sent to your email address.
                </AlertDescription>
              </Alert>
            )}

            {/* Resend Email Option */}
            {error && !loading && isAuthenticated && user && !user.emailVerified && (
              <div className="space-y-3">
                <p className="text-sm text-slate-600 text-center">
                  Need a new verification link?
                </p>
                <Button
                  onClick={handleResendVerification}
                  disabled={resendLoading}
                  variant="outline"
                  className="w-full"
                >
                  {resendLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  <Mail className="w-4 h-4 mr-2" />
                  Resend Verification Email
                </Button>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            {success ? (
              <Button 
                onClick={() => setLocation('/dashboard')}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold"
              >
                Go to Dashboard
              </Button>
            ) : (
              <div className="flex flex-col items-center space-y-2 text-sm text-slate-600">
                <Link 
                  href="/login"
                  className="text-orange-600 hover:text-orange-700 underline font-medium"
                >
                  Back to Sign In
                </Link>
              </div>
            )}
          </CardFooter>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-slate-500">
          <p>&copy; 2024 FieldFlux. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
