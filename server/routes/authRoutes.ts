import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler, ValidationError } from '../lib/errors';
import { authService } from '../services/authService';
import { logger } from '../lib/logger';
import { 
  authenticateJWT, 
  requireEmailVerification, 
  AuthenticatedRequest 
} from '../middleware/authMiddleware';
import { rateLimiters } from '../lib/rate-limit';

const router = Router();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  tenantId: z.string().optional(),
  inviteToken: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
  tenantId: z.string().optional(),
  rememberMe: z.boolean().optional().default(false)
});

const passwordResetRequestSchema = z.object({
  email: z.string().email('Invalid email format'),
  tenantId: z.string().optional()
});

const passwordResetSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters')
});

const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  profileImageUrl: z.string().url('Invalid URL format').optional()
});

/**
 * POST /api/auth/register
 * Register a new user account
 */
router.post('/register', rateLimiters.auth, asyncHandler(async (req: any, res) => {
  const correlationId = req.correlationId;
  
  try {
    const validatedData = registerSchema.parse(req.body);
    const { user, token } = await authService.register(validatedData, correlationId);
    
    // Set HTTP-only cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          emailVerified: user.emailVerified,
          subscriptionStatus: user.subscriptionStatus,
          subscriptionPlan: user.subscriptionPlan
        },
        token,
        message: 'Registration successful. Please check your email to verify your account.'
      }
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Invalid registration data', { 
        validationErrors: error.errors 
      });
    }
    throw error;
  }
}));

/**
 * POST /api/auth/login
 * Authenticate user and create session
 */
router.post('/login', rateLimiters.auth, asyncHandler(async (req: any, res) => {
  const correlationId = req.correlationId;
  
  try {
    const validatedData = loginSchema.parse(req.body);
    const { user, token, session } = await authService.login(validatedData, req, correlationId);
    
    // Set HTTP-only cookie
    const cookieMaxAge = validatedData.rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 30 days or 1 day
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: cookieMaxAge
    });
    
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          emailVerified: user.emailVerified,
          subscriptionStatus: user.subscriptionStatus,
          subscriptionPlan: user.subscriptionPlan,
          lastLoginAt: user.lastLoginAt
        },
        token,
        session: {
          id: session.id,
          expiresAt: session.expiresAt
        },
        message: 'Login successful'
      }
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Invalid login data', { 
        validationErrors: error.errors 
      });
    }
    throw error;
  }
}));

/**
 * POST /api/auth/logout
 * Logout user and invalidate session
 */
router.post('/logout', authenticateJWT, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const correlationId = (req as any).correlationId;
  
  if (req.user?.sessionId) {
    await authService.logout(req.user.sessionId, correlationId);
  }
  
  // Clear cookie
  res.clearCookie('auth_token');
  
  res.json({
    success: true,
    message: 'Logout successful'
  });
}));

/**
 * POST /api/auth/refresh
 * Refresh JWT token using session
 */
router.post('/refresh', authenticateJWT, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const correlationId = (req as any).correlationId;
  
  if (!req.user?.sessionId) {
    throw new ValidationError('Session ID required for token refresh');
  }
  
  const { user, token, session } = await authService.refreshToken(req.user.sessionId, correlationId);
  
  // Update HTTP-only cookie
  res.cookie('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
  
  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        emailVerified: user.emailVerified,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionPlan: user.subscriptionPlan
      },
      token,
      session: {
        id: session.id,
        expiresAt: session.expiresAt
      }
    }
  });
}));

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
router.get('/me', authenticateJWT, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const correlationId = (req as any).correlationId;
  
  if (!req.user) {
    throw new ValidationError('User not found in request');
  }
  
  // Get fresh user data from storage
  const { storage } = await import('../storage');
  const user = await storage.getUser(req.user.id);
  
  if (!user) {
    throw new ValidationError('User not found');
  }
  
  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
        emailVerified: user.emailVerified,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionPlan: user.subscriptionPlan,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt
      }
    }
  });
}));

/**
 * PUT /api/auth/profile
 * Update user profile
 */
router.put('/profile', authenticateJWT, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const correlationId = (req as any).correlationId;
  
  if (!req.user) {
    throw new ValidationError('Authentication required');
  }
  
  try {
    const validatedData = updateProfileSchema.parse(req.body);
    
    const { storage } = await import('../storage');
    const updatedUser = await storage.updateUser(req.user.id, {
      ...validatedData,
      updatedAt: new Date()
    });
    
    logger.info('User profile updated', {
      correlationId,
      userId: req.user.id,
      updatedFields: Object.keys(validatedData)
    });
    
    res.json({
      success: true,
      data: {
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          profileImageUrl: updatedUser.profileImageUrl,
          emailVerified: updatedUser.emailVerified,
          updatedAt: updatedUser.updatedAt
        }
      },
      message: 'Profile updated successfully'
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Invalid profile data', { 
        validationErrors: error.errors 
      });
    }
    throw error;
  }
}));

/**
 * POST /api/auth/change-password
 * Change user password
 */
router.post('/change-password', authenticateJWT, requireEmailVerification, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const correlationId = (req as any).correlationId;
  
  if (!req.user) {
    throw new ValidationError('Authentication required');
  }
  
  try {
    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
    
    // Verify current password
    const { storage } = await import('../storage');
    const hashedPassword = await storage.getUserPassword(req.user.id);
    if (!hashedPassword) {
      throw new ValidationError('Current password verification failed');
    }
    
    const bcrypt = await import('bcrypt');
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, hashedPassword);
    if (!isCurrentPasswordValid) {
      throw new ValidationError('Current password is incorrect');
    }
    
    // Hash new password and update
    const newHashedPassword = await bcrypt.hash(newPassword, 12);
    await storage.updateUserPassword(req.user.id, newHashedPassword);
    
    // Invalidate all existing sessions except current one for security
    if (req.user.sessionId) {
      const sessions = await authService.getUserSessions(req.user.id);
      const otherSessions = sessions.filter(s => s.id !== req.user!.sessionId);
      for (const session of otherSessions) {
        await authService.invalidateSession(session.id, correlationId);
      }
    }
    
    logger.info('Password changed successfully', {
      correlationId,
      userId: req.user.id,
      sessionsInvalidated: (await authService.getUserSessions(req.user.id)).length - 1
    });
    
    res.json({
      success: true,
      message: 'Password changed successfully. Other sessions have been invalidated.'
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Invalid password change data', { 
        validationErrors: error.errors 
      });
    }
    throw error;
  }
}));

/**
 * POST /api/auth/password-reset-request
 * Request password reset email
 */
router.post('/password-reset-request', rateLimiters.passwordReset, asyncHandler(async (req: any, res) => {
  const correlationId = req.correlationId;
  
  try {
    const validatedData = passwordResetRequestSchema.parse(req.body);
    await authService.requestPasswordReset(validatedData, correlationId);
    
    // Always return success for security (don't reveal if email exists)
    res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.'
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Invalid password reset request', { 
        validationErrors: error.errors 
      });
    }
    throw error;
  }
}));

/**
 * POST /api/auth/password-reset
 * Reset password using token
 */
router.post('/password-reset', rateLimiters.passwordReset, asyncHandler(async (req: any, res) => {
  const correlationId = req.correlationId;
  
  try {
    const { token, password } = passwordResetSchema.parse(req.body);
    const { user, token: authToken } = await authService.resetPassword(token, password, correlationId);
    
    // Set HTTP-only cookie
    res.cookie('auth_token', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          emailVerified: user.emailVerified
        },
        token: authToken
      },
      message: 'Password reset successful. You are now logged in.'
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Invalid password reset data', { 
        validationErrors: error.errors 
      });
    }
    throw error;
  }
}));

/**
 * GET /api/auth/verify-email/:token
 * Verify email address
 */
router.get('/verify-email/:token', asyncHandler(async (req: any, res) => {
  const correlationId = req.correlationId;
  const { token } = req.params;
  
  if (!token) {
    throw new ValidationError('Verification token is required');
  }
  
  const { user, token: authToken } = await authService.verifyEmail(token, correlationId);
  
  // Set HTTP-only cookie
  res.cookie('auth_token', authToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
  
  // Redirect to dashboard or return JSON based on Accept header
  if (req.headers.accept && req.headers.accept.includes('application/json')) {
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          emailVerified: user.emailVerified
        },
        token: authToken
      },
      message: 'Email verified successfully'
    });
  } else {
    res.redirect('/dashboard?verified=true');
  }
}));

/**
 * POST /api/auth/resend-verification
 * Resend email verification
 */
router.post('/resend-verification', authenticateJWT, rateLimiters.emailSending, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const correlationId = (req as any).correlationId;
  
  if (!req.user) {
    throw new ValidationError('Authentication required');
  }
  
  if (req.user.emailVerified) {
    throw new ValidationError('Email is already verified');
  }
  
  // Create new verification token
  const crypto = await import('crypto');
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  
  const { storage } = await import('../storage');
  await storage.createEmailVerificationToken(req.user.id, verificationToken, expiresAt);
  
  // TODO: Send verification email
  logger.info('Email verification resent', {
    correlationId,
    userId: req.user.id,
    email: req.user.email
  });
  
  res.json({
    success: true,
    message: 'Verification email sent'
  });
}));

/**
 * GET /api/auth/sessions
 * Get user's active sessions
 */
router.get('/sessions', authenticateJWT, asyncHandler(async (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    throw new ValidationError('Authentication required');
  }
  
  const sessions = await authService.getUserSessions(req.user.id);
  
  // Don't expose sensitive session data
  const safeSessions = sessions.map(session => ({
    id: session.id,
    deviceInfo: session.deviceInfo,
    ipAddress: session.ipAddress,
    createdAt: session.createdAt,
    lastAccessedAt: session.lastAccessedAt,
    expiresAt: session.expiresAt,
    isCurrent: session.id === req.user?.sessionId
  }));
  
  res.json({
    success: true,
    data: {
      sessions: safeSessions
    }
  });
}));

/**
 * DELETE /api/auth/sessions/:sessionId
 * Invalidate specific session
 */
router.delete('/sessions/:sessionId', authenticateJWT, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const correlationId = (req as any).correlationId;
  const { sessionId } = req.params;
  
  if (!req.user) {
    throw new ValidationError('Authentication required');
  }
  
  // Verify session belongs to user
  const sessions = await authService.getUserSessions(req.user.id);
  const session = sessions.find(s => s.id === sessionId);
  
  if (!session) {
    throw new ValidationError('Session not found');
  }
  
  await authService.invalidateSession(sessionId, correlationId);
  
  res.json({
    success: true,
    message: 'Session invalidated successfully'
  });
}));

/**
 * DELETE /api/auth/sessions
 * Invalidate all sessions except current
 */
router.delete('/sessions', authenticateJWT, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const correlationId = (req as any).correlationId;
  
  if (!req.user) {
    throw new ValidationError('Authentication required');
  }
  
  // Get all sessions and invalidate all except current
  const sessions = await authService.getUserSessions(req.user.id);
  const otherSessions = sessions.filter(s => s.id !== req.user?.sessionId);
  
  for (const session of otherSessions) {
    await authService.invalidateSession(session.id, correlationId);
  }
  
  logger.info('All other sessions invalidated', {
    correlationId,
    userId: req.user.id,
    sessionsInvalidated: otherSessions.length
  });
  
  res.json({
    success: true,
    message: `${otherSessions.length} sessions invalidated successfully`
  });
}));

export default router;
