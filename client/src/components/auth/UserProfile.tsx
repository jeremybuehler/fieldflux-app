import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Loader2, User, Mail, Shield, Check, X } from "lucide-react";

const UserProfile: React.FC = () => {
  const { user, updateProfile, changePassword, resendVerificationEmail } = useAuth();
  
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || ''
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState({
    profile: false,
    password: false,
    verification: false
  });
  
  const [messages, setMessages] = useState({
    profile: { success: '', error: '' },
    password: { success: '', error: '' },
    verification: { success: '', error: '' }
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, profile: true }));
    setMessages(prev => ({ 
      ...prev, 
      profile: { success: '', error: '' } 
    }));

    try {
      await updateProfile({
        firstName: profileForm.firstName,
        lastName: profileForm.lastName
      });
      
      setMessages(prev => ({ 
        ...prev, 
        profile: { success: 'Profile updated successfully!', error: '' } 
      }));
    } catch (error) {
      setMessages(prev => ({ 
        ...prev, 
        profile: { 
          success: '', 
          error: error instanceof Error ? error.message : 'Failed to update profile' 
        } 
      }));
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessages(prev => ({ 
        ...prev, 
        password: { success: '', error: 'Passwords do not match' } 
      }));
      return;
    }

    setLoading(prev => ({ ...prev, password: true }));
    setMessages(prev => ({ 
      ...prev, 
      password: { success: '', error: '' } 
    }));

    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setMessages(prev => ({ 
        ...prev, 
        password: { success: 'Password changed successfully!', error: '' } 
      }));
    } catch (error) {
      setMessages(prev => ({ 
        ...prev, 
        password: { 
          success: '', 
          error: error instanceof Error ? error.message : 'Failed to change password' 
        } 
      }));
    } finally {
      setLoading(prev => ({ ...prev, password: false }));
    }
  };

  const handleResendVerification = async () => {
    setLoading(prev => ({ ...prev, verification: true }));
    setMessages(prev => ({ 
      ...prev, 
      verification: { success: '', error: '' } 
    }));

    try {
      await resendVerificationEmail();
      setMessages(prev => ({ 
        ...prev, 
        verification: { success: 'Verification email sent!', error: '' } 
      }));
    } catch (error) {
      setMessages(prev => ({ 
        ...prev, 
        verification: { 
          success: '', 
          error: error instanceof Error ? error.message : 'Failed to send verification email' 
        } 
      }));
    } finally {
      setLoading(prev => ({ ...prev, verification: false }));
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <User className="w-8 h-8 text-orange-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Profile Information</span>
            </CardTitle>
            <CardDescription>
              Update your personal information and account details
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleProfileUpdate}>
            <CardContent className="space-y-4">
              {messages.profile.success && (
                <Alert className="border-green-200 bg-green-50 text-green-800">
                  <Check className="w-4 h-4" />
                  <AlertDescription>{messages.profile.success}</AlertDescription>
                </Alert>
              )}
              
              {messages.profile.error && (
                <Alert className="border-red-200 bg-red-50 text-red-800">
                  <X className="w-4 h-4" />
                  <AlertDescription>{messages.profile.error}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profileForm.firstName}
                    onChange={(e) => setProfileForm(prev => ({
                      ...prev,
                      firstName: e.target.value
                    }))}
                    disabled={loading.profile}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profileForm.lastName}
                    onChange={(e) => setProfileForm(prev => ({
                      ...prev,
                      lastName: e.target.value
                    }))}
                    disabled={loading.profile}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileForm.email}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500">
                  Email address cannot be changed. Contact support if needed.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Email Status:</span>
                {user.emailVerified ? (
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <Check className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <X className="w-3 h-3 mr-1" />
                    Unverified
                  </Badge>
                )}
              </div>

              {!user.emailVerified && (
                <div className="space-y-2">
                  {messages.verification.success && (
                    <Alert className="border-blue-200 bg-blue-50 text-blue-800">
                      <Mail className="w-4 h-4" />
                      <AlertDescription>{messages.verification.success}</AlertDescription>
                    </Alert>
                  )}
                  
                  {messages.verification.error && (
                    <Alert className="border-red-200 bg-red-50 text-red-800">
                      <X className="w-4 h-4" />
                      <AlertDescription>{messages.verification.error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleResendVerification}
                    disabled={loading.verification}
                  >
                    {loading.verification && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    <Mail className="w-4 h-4 mr-2" />
                    Resend Verification Email
                  </Button>
                </div>
              )}
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit" 
                disabled={loading.profile}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {loading.profile && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Update Profile
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Security Settings</span>
            </CardTitle>
            <CardDescription>
              Change your password and manage account security
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handlePasswordChange}>
            <CardContent className="space-y-4">
              {messages.password.success && (
                <Alert className="border-green-200 bg-green-50 text-green-800">
                  <Check className="w-4 h-4" />
                  <AlertDescription>{messages.password.success}</AlertDescription>
                </Alert>
              )}
              
              {messages.password.error && (
                <Alert className="border-red-200 bg-red-50 text-red-800">
                  <X className="w-4 h-4" />
                  <AlertDescription>{messages.password.error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(prev => ({
                    ...prev,
                    currentPassword: e.target.value
                  }))}
                  disabled={loading.password}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({
                    ...prev,
                    newPassword: e.target.value
                  }))}
                  disabled={loading.password}
                />
                <p className="text-xs text-gray-500">
                  Password must be at least 8 characters with uppercase, lowercase, number, and special character.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({
                    ...prev,
                    confirmPassword: e.target.value
                  }))}
                  disabled={loading.password}
                />
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit" 
                disabled={loading.password || !passwordForm.currentPassword || !passwordForm.newPassword}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {loading.password && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Change Password
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Your account details and membership status
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Account Role</Label>
              <p className="text-sm font-semibold capitalize">{user.role}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-500">Member Since</Label>
              <p className="text-sm font-semibold">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-500">Last Login</Label>
              <p className="text-sm font-semibold">
                {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
              </p>
            </div>
          </div>

          {user.tenantMemberships && user.tenantMemberships.length > 0 && (
            <>
              <Separator />
              <div>
                <Label className="text-sm font-medium text-gray-500 mb-2 block">
                  Organization Memberships
                </Label>
                <div className="space-y-2">
                  {user.tenantMemberships.map((membership) => (
                    <div key={membership.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{membership.tenant.name}</p>
                        <p className="text-sm text-gray-600">@{membership.tenant.slug}</p>
                      </div>
                      <Badge variant="secondary" className="capitalize">
                        {membership.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
