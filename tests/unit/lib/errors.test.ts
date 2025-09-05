import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import {
  AppError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  ExternalServiceError,
  DatabaseError,
  errorHandler,
  asyncHandler,
  notFoundHandler,
  safeAsync
} from '../../../server/lib/errors';

describe('AppError and Custom Errors', () => {
  describe('AppError base class', () => {
    it('should create error with message and statusCode', () => {
      const error = new AppError('Test error', 500, 'TEST_ERROR');
      
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(500);
      expect(error.code).toBe('TEST_ERROR');
      expect(error.isOperational).toBe(true);
      expect(error.name).toBe('Error'); // AppError extends Error
    });

    it('should include metadata when provided', () => {
      const metadata = { userId: '123', action: 'create' };
      const error = new AppError('Test error', 500, 'TEST_ERROR', true, metadata);
      
      expect(error.metadata).toEqual(metadata);
    });

  });

  describe('Custom Error Classes', () => {
    it('ValidationError should have correct defaults', () => {
      const error = new ValidationError('Invalid input');
      
      expect(error.message).toBe('Invalid input');
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('VALIDATION_ERROR');
    });

    it('UnauthorizedError should have correct defaults', () => {
      const error = new UnauthorizedError();
      
      expect(error.message).toBe('Authentication required');
      expect(error.statusCode).toBe(401);
      expect(error.code).toBe('UNAUTHORIZED');
    });

    it('ForbiddenError should have correct defaults', () => {
      const error = new ForbiddenError();
      
      expect(error.message).toBe('Access forbidden');
      expect(error.statusCode).toBe(403);
      expect(error.code).toBe('FORBIDDEN');
    });

    it('NotFoundError should have correct defaults', () => {
      const error = new NotFoundError('Resource');
      
      expect(error.message).toBe('Resource not found');
      expect(error.statusCode).toBe(404);
      expect(error.code).toBe('NOT_FOUND');
    });

    it('ConflictError should have correct defaults', () => {
      const error = new ConflictError('Resource already exists');
      
      expect(error.message).toBe('Resource already exists');
      expect(error.statusCode).toBe(409);
      expect(error.code).toBe('CONFLICT');
    });

    it('RateLimitError should have correct defaults', () => {
      const error = new RateLimitError();
      
      expect(error.message).toBe('Rate limit exceeded');
      expect(error.statusCode).toBe(429);
      expect(error.code).toBe('RATE_LIMIT_EXCEEDED');
    });

    it('ExternalServiceError should include service metadata', () => {
      const error = new ExternalServiceError('OpenAI', 'API is down');
      
      expect(error.message).toBe('API is down');
      expect(error.statusCode).toBe(502);
      expect(error.code).toBe('EXTERNAL_SERVICE_ERROR');
      expect(error.metadata).toEqual({ service: 'OpenAI' });
    });

    it('DatabaseError should include original error', () => {
      const originalError = new Error('Connection failed');
      const error = new DatabaseError('DB operation failed', originalError);
      
      expect(error.message).toBe('DB operation failed');
      expect(error.statusCode).toBe(500);
      expect(error.code).toBe('DATABASE_ERROR');
      expect(error.metadata).toEqual({ originalError: 'Connection failed' });
    });
  });
});

describe('Error Handler Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      path: '/api/test',
      method: 'POST'
    };
    mockRes = {
      setHeader: vi.fn(),
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis()
    };
    mockNext = vi.fn();
  });

  it('should handle AppError correctly', () => {
    const error = new ValidationError('Invalid input');
    (mockReq as any).correlationId = 'test-correlation-id';

    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      error: {
        message: 'Invalid input',
        code: 'VALIDATION_ERROR',
        statusCode: 400,
        correlationId: 'test-correlation-id',
        timestamp: expect.any(String)
      }
    });
  });

  it('should handle ZodError correctly', () => {
    const zodError = new ZodError([
      {
        code: 'invalid_type',
        expected: 'string',
        received: 'undefined',
        path: ['name'],
        message: 'Required'
      }
    ]);

    (mockReq as any).correlationId = 'test-correlation-id';

    errorHandler(zodError, mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        statusCode: 400,
        correlationId: 'test-correlation-id',
        timestamp: expect.any(String),
        metadata: {
          validation: [
            {
              field: 'name',
              message: 'Required'
            }
          ]
        }
      }
    });
  });

  it('should handle database errors correctly', () => {
    const dbError = new Error('Connection refused');
    (dbError as any).code = 'ECONNREFUSED';
    (mockReq as any).correlationId = 'test-correlation-id';

    errorHandler(dbError, mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      error: {
        message: 'Database connection failed',
        code: 'DATABASE_ERROR',
        statusCode: 500,
        correlationId: 'test-correlation-id',
        timestamp: expect.any(String),
        metadata: {
          originalError: undefined
        }
      }
    });
  });

  it('should handle unknown errors safely in production', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const unknownError = new Error('Internal server details');
    (mockReq as any).correlationId = 'test-correlation-id';

    errorHandler(unknownError, mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      error: {
        message: 'An unexpected error occurred',
        code: 'INTERNAL_ERROR',
        statusCode: 500,
        correlationId: 'test-correlation-id',
        timestamp: expect.any(String)
      }
    });

    process.env.NODE_ENV = originalEnv;
  });
});

describe('Safe Async', () => {
  it('should return success for successful operations', async () => {
    const operation = vi.fn().mockResolvedValue('test result');
    
    const result = await safeAsync(operation);
    
    expect(result).toEqual({
      success: true,
      data: 'test result'
    });
    expect(operation).toHaveBeenCalled();
  });

  it('should return error for failed operations', async () => {
    const operation = vi.fn().mockRejectedValue(new ValidationError('Test error'));
    
    const result = await safeAsync(operation, { correlationId: 'test-id', operation: 'test-op' });
    
    expect(result).toEqual({
      success: false,
      error: expect.objectContaining({
        message: 'Test error',
        code: 'VALIDATION_ERROR'
      })
    });
    expect(operation).toHaveBeenCalled();
  });

  it('should wrap unknown errors in AppError', async () => {
    const operation = vi.fn().mockRejectedValue(new Error('Unknown error'));
    
    const result = await safeAsync(operation);
    
    expect(result).toEqual({
      success: false,
      error: expect.objectContaining({
        message: 'Operation failed',
        code: 'OPERATION_FAILED',
        statusCode: 500
      })
    });
  });
});
