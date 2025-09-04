import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { ZodError, z } from 'zod';
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
} from '@server/lib/errors';

describe('Error Classes', () => {
  describe('AppError', () => {
    it('should create an error with default values', () => {
      const error = new AppError('Test error');
      
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(500);
      expect(error.code).toBe('INTERNAL_ERROR');
      expect(error.isOperational).toBe(true);
      expect(error.metadata).toBeUndefined();
    });

    it('should create an error with custom values', () => {
      const metadata = { userId: '123', action: 'create' };
      const error = new AppError('Custom error', 400, 'CUSTOM_ERROR', false, metadata);
      
      expect(error.message).toBe('Custom error');
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('CUSTOM_ERROR');
      expect(error.isOperational).toBe(false);
      expect(error.metadata).toEqual(metadata);
    });

    it('should be an instance of Error', () => {
      const error = new AppError('Test error');
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
    });
  });

  describe('Specific Error Classes', () => {
    it('ValidationError should have correct defaults', () => {
      const error = new ValidationError('Validation failed');
      
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.isOperational).toBe(true);
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

    it('NotFoundError should format message correctly', () => {
      const error = new NotFoundError('User');
      
      expect(error.message).toBe('User not found');
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
    const zodSchema = z.object({ name: z.string() });
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
              field: 'name',\n              message: 'Required'\n            }\n          ]\n        }\n      }\n    });\n  });\n\n  it('should handle database errors correctly', () => {\n    const dbError = new Error('Connection refused');\n    (dbError as any).code = 'ECONNREFUSED';\n    (mockReq as any).correlationId = 'test-correlation-id';\n\n    errorHandler(dbError, mockReq as Request, mockRes as Response, mockNext);\n\n    expect(mockRes.status).toHaveBeenCalledWith(500);\n    expect(mockRes.json).toHaveBeenCalledWith({\n      success: false,\n      error: {\n        message: 'Database connection failed',\n        code: 'DATABASE_ERROR',\n        statusCode: 500,\n        correlationId: 'test-correlation-id',\n        timestamp: expect.any(String),\n        metadata: {\n          originalError: 'Connection refused'\n        }\n      }\n    });\n  });\n\n  it('should handle unknown errors safely in production', () => {\n    const originalEnv = process.env.NODE_ENV;\n    process.env.NODE_ENV = 'production';\n\n    const unknownError = new Error('Internal server details');\n    (mockReq as any).correlationId = 'test-correlation-id';\n\n    errorHandler(unknownError, mockReq as Request, mockRes as Response, mockNext);\n\n    expect(mockRes.status).toHaveBeenCalledWith(500);\n    expect(mockRes.json).toHaveBeenCalledWith({\n      success: false,\n      error: {\n        message: 'An unexpected error occurred',\n        code: 'INTERNAL_ERROR',\n        statusCode: 500,\n        correlationId: 'test-correlation-id',\n        timestamp: expect.any(String)\n      }\n    });\n\n    process.env.NODE_ENV = originalEnv;\n  });\n\n  it('should include stack trace in development', () => {\n    const originalEnv = process.env.NODE_ENV;\n    process.env.NODE_ENV = 'development';\n\n    const error = new ValidationError('Test error');\n    (mockReq as any).correlationId = 'test-correlation-id';\n\n    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);\n\n    const callArgs = (mockRes.json as any).mock.calls[0][0];\n    expect(callArgs.error.stack).toBeDefined();\n\n    process.env.NODE_ENV = originalEnv;\n  });\n\n  it('should set proper security headers', () => {\n    const error = new AppError('Test error');\n    (mockReq as any).correlationId = 'test-correlation-id';\n\n    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);\n\n    expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');\n    expect(mockRes.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-store');\n  });\n});\n\ndescribe('Async Handler', () => {\n  it('should handle successful async functions', async () => {\n    const mockReq = {} as Request;\n    const mockRes = {} as Response;\n    const mockNext = vi.fn();\n\n    const asyncFunction = vi.fn().mockResolvedValue('success');\n    const wrappedFunction = asyncHandler(asyncFunction);\n\n    await wrappedFunction(mockReq, mockRes, mockNext);\n\n    expect(asyncFunction).toHaveBeenCalledWith(mockReq, mockRes, mockNext);\n    expect(mockNext).not.toHaveBeenCalled();\n  });\n\n  it('should pass errors to next function', async () => {\n    const mockReq = {} as Request;\n    const mockRes = {} as Response;\n    const mockNext = vi.fn();\n    const testError = new Error('Async error');\n\n    const asyncFunction = vi.fn().mockRejectedValue(testError);\n    const wrappedFunction = asyncHandler(asyncFunction);\n\n    await wrappedFunction(mockReq, mockRes, mockNext);\n\n    expect(asyncFunction).toHaveBeenCalledWith(mockReq, mockRes, mockNext);\n    expect(mockNext).toHaveBeenCalledWith(testError);\n  });\n});\n\ndescribe('Not Found Handler', () => {\n  it('should create NotFoundError with route information', () => {\n    const mockReq = {\n      method: 'GET',\n      path: '/api/nonexistent'\n    } as Request;\n    const mockRes = {} as Response;\n    const mockNext = vi.fn();\n\n    notFoundHandler(mockReq, mockRes, mockNext);\n\n    expect(mockNext).toHaveBeenCalledWith(\n      expect.objectContaining({\n        message: 'Route GET /api/nonexistent not found',\n        statusCode: 404,\n        code: 'NOT_FOUND'\n      })\n    );\n  });\n});\n\ndescribe('Safe Async', () => {\n  it('should return success for successful operations', async () => {\n    const operation = vi.fn().mockResolvedValue('test result');\n    \n    const result = await safeAsync(operation);\n    \n    expect(result).toEqual({\n      success: true,\n      data: 'test result'\n    });\n    expect(operation).toHaveBeenCalled();\n  });\n\n  it('should return error for failed operations', async () => {\n    const operation = vi.fn().mockRejectedValue(new ValidationError('Test error'));\n    \n    const result = await safeAsync(operation, { correlationId: 'test-id', operation: 'test-op' });\n    \n    expect(result).toEqual({\n      success: false,\n      error: expect.objectContaining({\n        message: 'Test error',\n        code: 'VALIDATION_ERROR'\n      })\n    });\n    expect(operation).toHaveBeenCalled();\n  });\n\n  it('should wrap unknown errors in AppError', async () => {\n    const operation = vi.fn().mockRejectedValue(new Error('Unknown error'));\n    \n    const result = await safeAsync(operation);\n    \n    expect(result).toEqual({\n      success: false,\n      error: expect.objectContaining({\n        message: 'Operation failed',\n        code: 'OPERATION_FAILED',\n        statusCode: 500\n      })\n    });\n  });\n});
