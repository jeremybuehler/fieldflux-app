/**
 * Storage extensions for JWT authentication and analytics features
 * These methods provide storage support for the analytics JWT authentication system
 */

import { logger } from './lib/logger';
import { db } from './db';
import crypto from 'crypto';

// Types for new storage entities
export interface ApiKeyRecord {
  id: string;
  userId: string;
  userEmail: string;
  keyHash: string;
  keyName: string;
  scopes: string[];
  isActive: boolean;
  createdAt: Date;
  lastUsedAt: Date | null;
  expiresAt: Date;
}

export interface TokenMetadata {
  jti: string;
  userId: string;
  type: 'access' | 'refresh' | 'api_key';
  issuedAt: Date;
  expiresAt: Date;
  isActive: boolean;
}

export interface RefreshTokenRecord {
  jti: string;
  userId: string;
  token: string;
  issuedAt: Date;
  expiresAt: Date;
  isActive: boolean;
}

export interface SessionActivity {
  sessionId: string;
  locations: string[];
  requestCount: number;
  lastActivity: Date;
}

export interface AnalyticsAccessLog {
  id: string;
  userId: string;
  endpoint: string;
  action: string;
  resourceId?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
  correlationId?: string;
  responseStatus?: number;
  responseSize?: number;
}

/**
 * Extended storage interface for analytics authentication
 */
export interface IAnalyticsStorage {
  // API Key methods
  getApiKey(keyHash: string): Promise<ApiKeyRecord | null>;
  createApiKey(apiKey: ApiKeyRecord): Promise<void>;
  updateApiKeyUsage(keyHash: string): Promise<void>;
  revokeApiKey(keyHash: string): Promise<void>;
  getUserApiKeys(userId: string): Promise<ApiKeyRecord[]>;

  // Token management methods
  isTokenRevoked(jti: string): Promise<boolean>;
  revokeToken(jti: string): Promise<void>;
  storeTokenMetadata(metadata: TokenMetadata): Promise<void>;
  getTokenMetadata(jti: string): Promise<TokenMetadata | null>;

  // Refresh token methods
  storeRefreshToken(refreshToken: RefreshTokenRecord): Promise<void>;
  getRefreshToken(jti: string): Promise<RefreshTokenRecord | null>;
  revokeRefreshToken(jti: string): Promise<void>;

  // Session management
  getSessionActivity(sessionId: string): Promise<SessionActivity>;
  revokeSession(sessionId: string): Promise<void>;
  getSession(sessionId: string): Promise<any>;
  updateSession(sessionId: string, updates: any): Promise<void>;

  // User tokens
  getUserTokens(userId: string): Promise<TokenMetadata[]>;

  // Analytics audit logging
  logAnalyticsAccess(logEntry: AnalyticsAccessLog): Promise<void>;
  getAnalyticsAccessLogs(userId: string, limit?: number): Promise<AnalyticsAccessLog[]>;
}

/**
 * In-memory implementation for analytics storage (development/testing)
 * In production, these should be backed by a database
 */
class MemoryAnalyticsStorage implements IAnalyticsStorage {
  private apiKeys: Map<string, ApiKeyRecord> = new Map();
  private revokedTokens: Set<string> = new Set();
  private tokenMetadata: Map<string, TokenMetadata> = new Map();
  private refreshTokens: Map<string, RefreshTokenRecord> = new Map();
  private sessionActivity: Map<string, SessionActivity> = new Map();
  private sessions: Map<string, any> = new Map();
  private analyticsLogs: AnalyticsAccessLog[] = [];

  async getApiKey(keyHash: string): Promise<ApiKeyRecord | null> {
    const apiKey = this.apiKeys.get(keyHash);
    
    if (apiKey && apiKey.expiresAt < new Date()) {
      // Clean up expired API key
      this.apiKeys.delete(keyHash);
      return null;
    }
    
    return apiKey || null;
  }

  async createApiKey(apiKey: ApiKeyRecord): Promise<void> {
    // Store by keyHash, not by hashing the ID again
    this.apiKeys.set(apiKey.keyHash, apiKey);
    logger.info('API key stored', { keyName: apiKey.keyName, userId: apiKey.userId });
  }

  async updateApiKeyUsage(keyHash: string): Promise<void> {
    const apiKey = this.apiKeys.get(keyHash);
    if (apiKey) {
      apiKey.lastUsedAt = new Date();
    }
  }

  async revokeApiKey(keyHash: string): Promise<void> {
    const apiKey = this.apiKeys.get(keyHash);
    if (apiKey) {
      apiKey.isActive = false;
      logger.info('API key revoked', { keyName: apiKey.keyName, userId: apiKey.userId });
    }
  }

  async getUserApiKeys(userId: string): Promise<ApiKeyRecord[]> {
    return Array.from(this.apiKeys.values()).filter(key => key.userId === userId);
  }

  async isTokenRevoked(jti: string): Promise<boolean> {
    return this.revokedTokens.has(jti);
  }

  async revokeToken(jti: string): Promise<void> {
    this.revokedTokens.add(jti);
    const metadata = this.tokenMetadata.get(jti);
    if (metadata) {
      metadata.isActive = false;
    }
    logger.info('Token revoked', { jti });
  }

  async storeTokenMetadata(metadata: TokenMetadata): Promise<void> {
    this.tokenMetadata.set(metadata.jti, metadata);
  }

  async getTokenMetadata(jti: string): Promise<TokenMetadata | null> {
    return this.tokenMetadata.get(jti) || null;
  }

  async storeRefreshToken(refreshToken: RefreshTokenRecord): Promise<void> {
    this.refreshTokens.set(refreshToken.jti, refreshToken);
  }

  async getRefreshToken(jti: string): Promise<RefreshTokenRecord | null> {
    const token = this.refreshTokens.get(jti);
    
    if (token && token.expiresAt < new Date()) {
      // Clean up expired refresh token
      this.refreshTokens.delete(jti);
      return null;
    }
    
    return token || null;
  }

  async revokeRefreshToken(jti: string): Promise<void> {
    const token = this.refreshTokens.get(jti);
    if (token) {
      token.isActive = false;
    }
  }

  async getSessionActivity(sessionId: string): Promise<SessionActivity> {
    return this.sessionActivity.get(sessionId) || {
      sessionId,
      locations: [],
      requestCount: 0,
      lastActivity: new Date()
    };
  }

  async revokeSession(sessionId: string): Promise<void> {
    this.sessions.delete(sessionId);
    this.sessionActivity.delete(sessionId);
    logger.info('Session revoked', { sessionId });
  }

  async getSession(sessionId: string): Promise<any> {
    const session = this.sessions.get(sessionId);
    if (!session) return null;
    
    // Check if session is expired
    if (session.expiresAt && session.expiresAt < new Date()) {
      this.sessions.delete(sessionId);
      return null;
    }
    
    return session;
  }

  async updateSession(sessionId: string, updates: any): Promise<void> {
    const existingSession = this.sessions.get(sessionId) || {};
    this.sessions.set(sessionId, { ...existingSession, ...updates });
    
    // Update activity
    const activity = await this.getSessionActivity(sessionId);
    activity.requestCount++;
    activity.lastActivity = new Date();
    this.sessionActivity.set(sessionId, activity);
  }

  async getUserTokens(userId: string): Promise<TokenMetadata[]> {
    return Array.from(this.tokenMetadata.values())
      .filter(token => token.userId === userId)
      .concat(
        Array.from(this.refreshTokens.values())
          .filter(token => token.userId === userId)
          .map(token => ({
            jti: token.jti,
            userId: token.userId,
            type: 'refresh' as const,
            issuedAt: token.issuedAt,
            expiresAt: token.expiresAt,
            isActive: token.isActive
          }))
      )
      .concat(
        Array.from(this.apiKeys.values())
          .filter(key => key.userId === userId)
          .map(key => ({
            jti: key.id,
            userId: key.userId,
            type: 'api_key' as const,
            issuedAt: key.createdAt,
            expiresAt: key.expiresAt,
            isActive: key.isActive
          }))
      );
  }

  async logAnalyticsAccess(logEntry: AnalyticsAccessLog): Promise<void> {
    this.analyticsLogs.push({
      ...logEntry,
      id: logEntry.id || crypto.randomUUID()
    });
    
    // Keep only last 10000 entries to prevent memory bloat
    if (this.analyticsLogs.length > 10000) {
      this.analyticsLogs = this.analyticsLogs.slice(-5000);
    }
  }

  async getAnalyticsAccessLogs(userId: string, limit = 100): Promise<AnalyticsAccessLog[]> {
    return this.analyticsLogs
      .filter(log => log.metadata?.userId === userId)
      .slice(-limit)
      .reverse();
  }

  // Cleanup expired entries
  cleanup(): void {
    const now = new Date();
    
    // Clean up expired API keys
    for (const [hash, apiKey] of this.apiKeys.entries()) {
      if (apiKey.expiresAt < now) {
        this.apiKeys.delete(hash);
      }
    }
    
    // Clean up expired refresh tokens
    for (const [jti, token] of this.refreshTokens.entries()) {
      if (token.expiresAt < now) {
        this.refreshTokens.delete(jti);
      }
    }
    
    // Clean up expired token metadata
    for (const [jti, metadata] of this.tokenMetadata.entries()) {
      if (metadata.expiresAt < now) {
        this.tokenMetadata.delete(jti);
      }
    }
    
    logger.debug('Cleaned up expired analytics tokens and keys');
  }
}

// Global instance
let analyticsStorage: IAnalyticsStorage;

// Initialize based on environment
if (process.env.NODE_ENV === 'production') {
  // In production, you would use a database-backed implementation
  logger.warn('Using in-memory analytics storage - not suitable for production');
  analyticsStorage = new MemoryAnalyticsStorage();
} else {
  // Development/testing uses in-memory storage
  analyticsStorage = new MemoryAnalyticsStorage();
  
  // Setup cleanup interval for development
  setInterval(() => {
    (analyticsStorage as MemoryAnalyticsStorage).cleanup();
  }, 60 * 60 * 1000); // Every hour
}

export { analyticsStorage };

// Extend the main storage interface
declare module './storage' {
  interface IStorage extends IAnalyticsStorage {}
}

// Provide an explicit hook to attach analytics methods to a storage instance
export function attachAnalyticsExtensions(target: any) {
  if (!target) return;
  Object.assign(target, analyticsStorage);
}
