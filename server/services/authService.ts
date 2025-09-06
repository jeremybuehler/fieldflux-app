import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { storage } from '../storage';
import { logger } from '../lib/logger';
import { AppError, ValidationError, UnauthorizedError } from '../lib/errors';
import type { Request, Response } from 'express';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  emailVerified: boolean;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  // Multi-tenant fields
  defaultTenantId?: string;
  // Subscription fields
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  subscriptionStatus: 'free' | 'active' | 'past_due' | 'canceled' | 'incomplete';
  subscriptionPlan: 'free' | 'starter' | 'professional' | 'enterprise';
  subscriptionCurrentPeriodEnd?: Date;
}

export interface AuthProvider {
  id: string;
  name: string;
  type: 'oauth' | 'saml' | 'local';
  enabled: boolean;
  config: Record<string, any>;
}

export interface AuthSession {
  id: string;
  userId: string;
  tenantId?: string;
  deviceInfo?: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt: Date;
  createdAt: Date;
  lastAccessedAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
  tenantId?: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  tenantId?: string;
  inviteToken?: string;
}

export interface PasswordResetRequest {
  email: string;
  tenantId?: string;
}

class AuthService {
  private readonly JWT_SECRET: string;
  private readonly JWT_EXPIRES_IN = '7d';
  private readonly RESET_TOKEN_EXPIRES_IN = 15 * 60 * 1000; // 15 minutes
  private readonly BCRYPT_ROUNDS = 12;

  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
    
    if (process.env.NODE_ENV === 'production' && this.JWT_SECRET === 'dev-secret-change-in-production') {
      throw new Error('JWT_SECRET must be set in production environment');
    }
  }

  /**
   * Register a new user with email/password
   */
  async register(credentials: RegisterCredentials, correlationId: string): Promise<{ user: User; token: string }> {
    const { email, password, firstName, lastName, tenantId, inviteToken } = credentials;

    // Validate input
    if (!email || !password) {
      throw new ValidationError('Email and password are required');
    }

    if (!this.isValidEmail(email)) {
      throw new ValidationError('Invalid email format');
    }

    if (!this.isValidPassword(password)) {
      throw new ValidationError('Password must be at least 8 characters with uppercase, lowercase, number, and special character');
    }

    // Check if user already exists
    const existingUser = await this.getUserByEmail(email, tenantId);
    if (existingUser) {
      throw new ValidationError('User with this email already exists');
    }

    // Validate invite token if provided
    if (inviteToken && tenantId) {
      const isValidInvite = await this.validateInviteToken(inviteToken, tenantId, email);
      if (!isValidInvite) {
        throw new ValidationError('Invalid or expired invite token');
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, this.BCRYPT_ROUNDS);

    // Create user
    const userId = crypto.randomUUID();
    const now = new Date();
    
    const user: User = {
      id: userId,
      email: email.toLowerCase().trim(),
      firstName,
      lastName,
      emailVerified: false,
      isActive: true,
      createdAt: now,
      updatedAt: now,
      defaultTenantId: tenantId,
      subscriptionStatus: 'free',
      subscriptionPlan: 'free'
    };

    await storage.createUser(user, hashedPassword);

    // Create tenant membership if tenantId provided
    if (tenantId) {
      const role = inviteToken ? 'member' : 'owner'; // Owner if self-registration, member if invited
      await storage.createMembership(tenantId, userId, role);
    }

    // Generate JWT token
    const token = this.generateJWT(user);

    // Send verification email
    await this.sendVerificationEmail(user, correlationId);

    logger.info('User registered successfully', {
      correlationId,
      userId,
      email,
      tenantId,
      hasInvite: !!inviteToken
    });

    return { user, token };
  }

  /**
   * Authenticate user with email/password
   */
  async login(credentials: LoginCredentials, req: Request, correlationId: string): Promise<{ user: User; token: string; session: AuthSession }> {
    const { email, password, tenantId, rememberMe = false } = credentials;

    if (!email || !password) {
      throw new ValidationError('Email and password are required');
    }

    // Get user by email (scoped to tenant if provided)
    const user = await this.getUserByEmail(email, tenantId);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedError('Account is deactivated');
    }

    // Verify password
    const hashedPassword = await storage.getUserPassword(user.id);
    if (!hashedPassword) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Update last login
    user.lastLoginAt = new Date();
    await storage.updateUser(user.id, { lastLoginAt: user.lastLoginAt });

    // Create session
    const session = await this.createSession(user.id, tenantId, req, rememberMe);

    // Generate JWT token
    const token = this.generateJWT(user, session);

    logger.info('User logged in successfully', {
      correlationId,
      userId: user.id,
      email,
      tenantId,
      sessionId: session.id,
      rememberMe
    });

    return { user, token, session };
  }

  /**
   * Logout user and invalidate session
   */
  async logout(sessionId: string, correlationId: string): Promise<void> {
    await storage.invalidateSession(sessionId);
    
    logger.info('User logged out', {
      correlationId,
      sessionId
    });
  }

  /**
   * Refresh JWT token using session
   */
  async refreshToken(sessionId: string, correlationId: string): Promise<{ user: User; token: string; session: AuthSession }> {
    const session = await storage.getSession(sessionId);
    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedError('Invalid or expired session');
    }

    const user = await storage.getUser(session.userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedError('User not found or deactivated');
    }

    // Update session last accessed
    session.lastAccessedAt = new Date();
    await storage.updateSession(sessionId, { lastAccessedAt: session.lastAccessedAt });

    // Generate new JWT token
    const token = this.generateJWT(user, session);

    logger.info('Token refreshed', {
      correlationId,
      userId: user.id,
      sessionId
    });

    return { user, token, session };
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(request: PasswordResetRequest, correlationId: string): Promise<void> {
    const { email, tenantId } = request;

    const user = await this.getUserByEmail(email, tenantId);
    if (!user) {
      // Return success even if user doesn't exist (security best practice)
      logger.warn('Password reset requested for non-existent user', {
        correlationId,
        email,
        tenantId
      });
      return;
    }

    if (!user.isActive) {
      logger.warn('Password reset requested for deactivated user', {
        correlationId,
        userId: user.id,
        email
      });
      return;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + this.RESET_TOKEN_EXPIRES_IN);

    await storage.createPasswordResetToken(user.id, resetToken, expiresAt);

    // Send reset email
    await this.sendPasswordResetEmail(user, resetToken, correlationId);

    logger.info('Password reset token created', {
      correlationId,
      userId: user.id,
      email
    });
  }

  /**
   * Reset password using reset token
   */
  async resetPassword(resetToken: string, newPassword: string, correlationId: string): Promise<{ user: User; token: string }> {
    if (!this.isValidPassword(newPassword)) {
      throw new ValidationError('Password must be at least 8 characters with uppercase, lowercase, number, and special character');
    }

    const resetRecord = await storage.getPasswordResetToken(resetToken);
    if (!resetRecord || resetRecord.expiresAt < new Date()) {
      throw new ValidationError('Invalid or expired reset token');
    }

    const user = await storage.getUser(resetRecord.userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedError('User not found or deactivated');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, this.BCRYPT_ROUNDS);

    // Update password and invalidate reset token
    await storage.updateUserPassword(user.id, hashedPassword);
    await storage.invalidatePasswordResetToken(resetToken);

    // Invalidate all existing sessions for security
    await storage.invalidateAllUserSessions(user.id);

    // Generate new JWT token
    const token = this.generateJWT(user);

    logger.info('Password reset successfully', {
      correlationId,
      userId: user.id,
      email: user.email
    });

    return { user, token };
  }

  /**
   * Verify email address
   */
  async verifyEmail(verificationToken: string, correlationId: string): Promise<{ user: User; token: string }> {
    const verificationRecord = await storage.getEmailVerificationToken(verificationToken);
    if (!verificationRecord || verificationRecord.expiresAt < new Date()) {
      throw new ValidationError('Invalid or expired verification token');
    }

    const user = await storage.getUser(verificationRecord.userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    // Mark email as verified
    user.emailVerified = true;
    user.updatedAt = new Date();
    await storage.updateUser(user.id, { emailVerified: true, updatedAt: user.updatedAt });

    // Invalidate verification token
    await storage.invalidateEmailVerificationToken(verificationToken);

    // Generate JWT token
    const token = this.generateJWT(user);

    logger.info('Email verified successfully', {
      correlationId,
      userId: user.id,
      email: user.email
    });

    return { user, token };
  }

  /**
   * Get user sessions
   */
  async getUserSessions(userId: string): Promise<AuthSession[]> {
    return await storage.getUserSessions(userId);
  }

  /**
   * Invalidate specific session
   */
  async invalidateSession(sessionId: string, correlationId: string): Promise<void> {
    await storage.invalidateSession(sessionId);
    
    logger.info('Session invalidated', {
      correlationId,
      sessionId
    });
  }

  /**
   * Invalidate all user sessions (useful for security events)
   */
  async invalidateAllUserSessions(userId: string, correlationId: string): Promise<void> {
    await storage.invalidateAllUserSessions(userId);
    
    logger.info('All user sessions invalidated', {
      correlationId,
      userId
    });
  }

  // Private helper methods

  private generateJWT(user: User, session?: AuthSession): string {
    const payload = {
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      emailVerified: user.emailVerified,
      tenantId: user.defaultTenantId,
      sessionId: session?.id,
      iat: Math.floor(Date.now() / 1000)
    };

    return jwt.sign(payload, this.JWT_SECRET, { 
      expiresIn: this.JWT_EXPIRES_IN,
      issuer: 'fieldflux',
      audience: 'fieldflux-app'
    });
  }

  private async createSession(userId: string, tenantId: string | undefined, req: Request, rememberMe: boolean): Promise<AuthSession> {
    const sessionId = crypto.randomUUID();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + (rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000)); // 30 days or 1 day

    const session: AuthSession = {
      id: sessionId,
      userId,
      tenantId,
      deviceInfo: req.get('User-Agent'),
      ipAddress: req.ip || req.connection?.remoteAddress,
      userAgent: req.get('User-Agent'),
      expiresAt,
      createdAt: now,
      lastAccessedAt: now
    };

    await storage.createSession(session);
    return session;
  }

  private async getUserByEmail(email: string, tenantId?: string): Promise<User | null> {
    return await storage.getUserByEmail(email.toLowerCase().trim(), tenantId);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPassword(password: string): boolean {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  private async validateInviteToken(inviteToken: string, tenantId: string, email: string): Promise<boolean> {
    const invite = await storage.getInviteToken(inviteToken);
    return invite && 
           invite.tenantId === tenantId && 
           invite.email === email && 
           invite.expiresAt > new Date() &&
           !invite.acceptedAt;
  }

  private async sendVerificationEmail(user: User, correlationId: string): Promise<void> {
    try {
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await storage.createEmailVerificationToken(user.id, verificationToken, expiresAt);

      // TODO: Integrate with email service
      logger.info('Email verification token created', {
        correlationId,
        userId: user.id,
        email: user.email,
        verificationToken: verificationToken.substring(0, 8) + '...' // Log partial token for debugging
      });
    } catch (error) {
      logger.error('Failed to send verification email', {
        correlationId,
        userId: user.id,
        email: user.email
      }, error as Error);
    }
  }

  private async sendPasswordResetEmail(user: User, resetToken: string, correlationId: string): Promise<void> {
    try {
      // TODO: Integrate with email service
      logger.info('Password reset email would be sent', {
        correlationId,
        userId: user.id,
        email: user.email,
        resetToken: resetToken.substring(0, 8) + '...' // Log partial token for debugging
      });
    } catch (error) {
      logger.error('Failed to send password reset email', {
        correlationId,
        userId: user.id,
        email: user.email
      }, error as Error);
    }
  }
}

export const authService = new AuthService();
