import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "wouter";
import { Loader2, Eye, EyeOff, ArrowLeft, Mail, Lock, User, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AuthFormProps {
  mode: 'login' | 'register' | 'forgot-password' | 'reset-password';
  onSubmit: (data: any) => Promise<void>;
  loading?: boolean;
  error?: string;
  success?: string;
  resetToken?: string;
  className?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  acceptTerms: boolean;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

const AuthForm: React.FC<AuthFormProps> = ({
  mode,
  onSubmit,
  loading = false,
  error,
  success,
  resetToken,
  className
}) => {
  const [formData, setFormData] = useState<any>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    rememberMe: false,
    acceptTerms: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Reset form when mode changes
  useEffect(() => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      rememberMe: false,
      acceptTerms: false
    });
    setValidationErrors({});
  }, [mode]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation for login, register, and reset
    if ((mode === 'login' || mode === 'register' || mode === 'reset-password') && !formData.password) {
      errors.password = 'Password is required';
    }

    // Strong password validation for register and reset
    if ((mode === 'register' || mode === 'reset-password') && formData.password) {
      if (formData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters long';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.password)) {
        errors.password = 'Password must include uppercase, lowercase, number, and special character';
      }
    }

    // Confirm password validation
    if ((mode === 'register' || mode === 'reset-password') && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // Name validation for register
    if (mode === 'register') {
      if (!formData.firstName.trim()) {
        errors.firstName = 'First name is required';
      }
      if (!formData.lastName.trim()) {
        errors.lastName = 'Last name is required';
      }
      if (!formData.acceptTerms) {
        errors.acceptTerms = 'You must accept the terms and conditions';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      let submitData: any = { email: formData.email };

      switch (mode) {
        case 'login':
          submitData = {
            email: formData.email,
            password: formData.password,
            rememberMe: formData.rememberMe
          };
          break;
        case 'register':
          submitData = {
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName
          };
          break;
        case 'forgot-password':
          submitData = { email: formData.email };
          break;
        case 'reset-password':
          submitData = {
            token: resetToken,
            password: formData.password
          };
          break;
      }

      await onSubmit(submitData);
    } catch (err) {
      // Error handled by parent component
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Welcome Back';
      case 'register': return 'Create Account';
      case 'forgot-password': return 'Reset Password';
      case 'reset-password': return 'Set New Password';
      default: return 'Authentication';
    }
  };

  const getDescription = () => {
    switch (mode) {
      case 'login': return 'Sign in to your FieldFlux account to continue';
      case 'register': return 'Create your FieldFlux account to get started';
      case 'forgot-password': return 'Enter your email address and we\'ll send you a reset link';
      case 'reset-password': return 'Enter your new password below';
      default: return '';
    }
  };

  const getButtonText = () => {
    if (loading) {
      switch (mode) {
        case 'login': return 'Signing In...';
        case 'register': return 'Creating Account...';
        case 'forgot-password': return 'Sending Email...';
        case 'reset-password': return 'Updating Password...';
        default: return 'Processing...';
      }
    }

    switch (mode) {
      case 'login': return 'Sign In';
      case 'register': return 'Create Account';
      case 'forgot-password': return 'Send Reset Link';
      case 'reset-password': return 'Update Password';
      default: return 'Submit';
    }
  };

  return (
    <div className={cn("flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4", className)}>
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
                {getTitle()}
              </CardTitle>
              {mode !== 'login' && (
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                </Link>
              )}
            </div>
            <CardDescription className="text-slate-600">
              {getDescription()}
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {/* Success Message */}
              {success && (
                <Alert className="border-green-200 bg-green-50 text-green-800">
                  <Shield className="w-4 h-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              {/* Error Message */}
              {error && (
                <Alert className="border-red-200 bg-red-50 text-red-800">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* First Name (Register only) */}
              {mode === 'register' && (
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium text-slate-700">
                    First Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={cn(
                        "pl-10",
                        validationErrors.firstName && "border-red-300 focus:border-red-500"
                      )}
                      placeholder="John"
                      disabled={loading}
                    />
                  </div>
                  {validationErrors.firstName && (
                    <p className="text-sm text-red-600">{validationErrors.firstName}</p>
                  )}
                </div>
              )}

              {/* Last Name (Register only) */}
              {mode === 'register' && (
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium text-slate-700">
                    Last Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={cn(
                        "pl-10",
                        validationErrors.lastName && "border-red-300 focus:border-red-500"
                      )}
                      placeholder="Doe"
                      disabled={loading}
                    />
                  </div>
                  {validationErrors.lastName && (
                    <p className="text-sm text-red-600">{validationErrors.lastName}</p>
                  )}
                </div>
              )}

              {/* Email */}
              {mode !== 'reset-password' && (
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={cn(
                        "pl-10",
                        validationErrors.email && "border-red-300 focus:border-red-500"
                      )}
                      placeholder="john@example.com"
                      disabled={loading}
                      autoComplete="email"
                    />
                  </div>
                  {validationErrors.email && (
                    <p className="text-sm text-red-600">{validationErrors.email}</p>
                  )}
                </div>
              )}

              {/* Password */}
              {(mode === 'login' || mode === 'register' || mode === 'reset-password') && (
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                    {mode === 'reset-password' ? 'New Password' : 'Password'}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={cn(
                        "pl-10 pr-10",
                        validationErrors.password && "border-red-300 focus:border-red-500"
                      )}
                      placeholder="Enter your password"
                      disabled={loading}
                      autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-slate-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-slate-400" />
                      )}
                    </Button>
                  </div>
                  {validationErrors.password && (
                    <p className="text-sm text-red-600">{validationErrors.password}</p>
                  )}
                </div>
              )}

              {/* Confirm Password */}
              {(mode === 'register' || mode === 'reset-password') && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={cn(
                        "pl-10 pr-10",
                        validationErrors.confirmPassword && "border-red-300 focus:border-red-500"
                      )}
                      placeholder="Confirm your password"
                      disabled={loading}
                      autoComplete="new-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={loading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4 text-slate-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-slate-400" />
                      )}
                    </Button>
                  </div>
                  {validationErrors.confirmPassword && (
                    <p className="text-sm text-red-600">{validationErrors.confirmPassword}</p>
                  )}
                </div>
              )}

              {/* Remember Me (Login only) */}
              {mode === 'login' && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => handleInputChange('rememberMe', !!checked)}
                    disabled={loading}
                  />
                  <Label 
                    htmlFor="rememberMe" 
                    className="text-sm text-slate-600 cursor-pointer"
                  >
                    Remember me for 30 days
                  </Label>
                </div>
              )}

              {/* Terms Acceptance (Register only) */}
              {mode === 'register' && (
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="acceptTerms"
                      checked={formData.acceptTerms}
                      onCheckedChange={(checked) => handleInputChange('acceptTerms', !!checked)}
                      disabled={loading}
                      className="mt-1"
                    />
                    <Label 
                      htmlFor="acceptTerms" 
                      className="text-sm text-slate-600 cursor-pointer leading-relaxed"
                    >
                      I agree to the{' '}
                      <Link href="/terms" className="text-orange-600 hover:text-orange-700 underline">
                        Terms of Service
                      </Link>
                      {' '}and{' '}
                      <Link href="/privacy" className="text-orange-600 hover:text-orange-700 underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                  {validationErrors.acceptTerms && (
                    <p className="text-sm text-red-600">{validationErrors.acceptTerms}</p>
                  )}
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3"
                disabled={loading}
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {getButtonText()}
              </Button>

              {/* Additional Links */}
              <div className="flex flex-col items-center space-y-2 text-sm text-slate-600">
                {mode === 'login' && (
                  <>
                    <Link 
                      href="/forgot-password"
                      className="text-orange-600 hover:text-orange-700 underline"
                    >
                      Forgot your password?
                    </Link>
                    <div className="flex items-center space-x-1">
                      <span>Don't have an account?</span>
                      <Link 
                        href="/register"
                        className="text-orange-600 hover:text-orange-700 underline font-medium"
                      >
                        Sign up
                      </Link>
                    </div>
                  </>
                )}

                {mode === 'register' && (
                  <div className="flex items-center space-x-1">
                    <span>Already have an account?</span>
                    <Link 
                      href="/login"
                      className="text-orange-600 hover:text-orange-700 underline font-medium"
                    >
                      Sign in
                    </Link>
                  </div>
                )}

                {mode === 'forgot-password' && (
                  <div className="flex items-center space-x-1">
                    <span>Remember your password?</span>
                    <Link 
                      href="/login"
                      className="text-orange-600 hover:text-orange-700 underline font-medium"
                    >
                      Sign in
                    </Link>
                  </div>
                )}
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-slate-500">
          <p>&copy; 2024 FieldFlux. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
