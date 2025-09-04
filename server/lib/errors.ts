import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from './logger';

// Base application error class
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly metadata?: Record<string, any>;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    isOperational: boolean = true,
    metadata?: Record<string, any>
  ) {
    super(message);
    
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    this.metadata = metadata;
    
    // Maintain proper stack trace
    Error.captureStackTrace(this, this.constructor);
    
    // Set the prototype explicitly for instanceof checks
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// Specific error classes
export class ValidationError extends AppError {
  constructor(message: string, metadata?: Record<string, any>) {
    super(message, 400, 'VALIDATION_ERROR', true, metadata);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'UNAUTHORIZED', true);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Access forbidden') {
    super(message, 403, 'FORBIDDEN', true);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND', true);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT', true);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED', true);
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, message?: string) {
    super(
      message || `External service ${service} is unavailable`,
      502,
      'EXTERNAL_SERVICE_ERROR',
      true,
      { service }
    );
    Object.setPrototypeOf(this, ExternalServiceError.prototype);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, originalError?: Error) {
    super(message, 500, 'DATABASE_ERROR', true, { originalError: originalError?.message });
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}

// Error response interface
interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    statusCode: number;
    correlationId: string;
    timestamp: string;
    metadata?: Record<string, any>;
    validation?: {
      field: string;
      message: string;
    }[];
  };
}

// Helper function to create safe error responses
function createErrorResponse(
  error: AppError,
  correlationId: string,
  includeStack: boolean = false
): ErrorResponse {
  const response: ErrorResponse = {
    success: false,
    error: {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      correlationId,
      timestamp: new Date().toISOString(),
      metadata: error.metadata
    }
  };

  // Include stack trace only in development
  if (includeStack && error.stack) {
    (response.error as any).stack = error.stack;
  }

  return response;
}

// Transform Zod validation errors
function transformZodError(error: ZodError): ValidationError {
  const validationErrors = error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message
  }));

  return new ValidationError('Validation failed', { validation: validationErrors });
}

// Transform database errors
function transformDatabaseError(error: any): AppError {
  // PostgreSQL error codes
  switch (error.code) {
    case '23505': // unique_violation
      return new ConflictError('Resource already exists');
    case '23503': // foreign_key_violation
      return new ValidationError('Referenced resource does not exist');
    case '23502': // not_null_violation
      return new ValidationError('Required field is missing');
    case '22001': // string_data_right_truncation
      return new ValidationError('Data too long for field');
    case '28P01': // invalid_password
      return new UnauthorizedError('Invalid credentials');
    case 'ECONNREFUSED':
    case 'ENOTFOUND':
      return new DatabaseError('Database connection failed');
    default:
      return new DatabaseError('Database operation failed', error);
  }
}

// Main error handling middleware
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const correlationId = (req as any).correlationId || 'unknown';
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  let appError: AppError;

  // Transform different error types to AppError
  if (error instanceof AppError) {
    appError = error;
  } else if (error instanceof ZodError) {
    appError = transformZodError(error);
  } else if (error.name === 'DatabaseError' || (error as any).code) {
    appError = transformDatabaseError(error);
  } else {
    // Unknown errors - don't expose internal details
    appError = new AppError(
      isDevelopment ? error.message : 'An unexpected error occurred',
      500,
      'INTERNAL_ERROR',
      false
    );
  }

  // Log the error
  logger.error(
    `Request failed: ${appError.message}`,
    {
      correlationId,
      userId: (req as any).user?.id,
      tenantId: (req as any).tenant?.id,
      endpoint: req.path,
      method: req.method
    },
    error,
    {
      statusCode: appError.statusCode,
      code: appError.code,
      isOperational: appError.isOperational
    }
  );

  // Create response
  const errorResponse = createErrorResponse(appError, correlationId, isDevelopment);

  // Set security headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  
  // Send response
  res.status(appError.statusCode).json(errorResponse);
}

// Async error wrapper
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// 404 handler
export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
  const error = new NotFoundError(`Route ${req.method} ${req.path}`);
  next(error);
}

// Unhandled promise rejection handler
export function handleUnhandledRejection() {
  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    logger.error(
      'Unhandled promise rejection',
      { correlationId: 'system' },
      reason instanceof Error ? reason : new Error(String(reason)),
      { promise: promise.toString() }
    );
    
    // In production, you might want to exit the process
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  });
}

// Uncaught exception handler
export function handleUncaughtException() {
  process.on('uncaughtException', (error: Error) => {
    logger.error(
      'Uncaught exception',
      { correlationId: 'system' },
      error
    );
    
    // Always exit on uncaught exception
    process.exit(1);
  });
}

// Graceful shutdown handler
export function handleGracefulShutdown() {
  const signals = ['SIGINT', 'SIGTERM', 'SIGUSR2'];
  
  signals.forEach(signal => {
    process.on(signal, () => {
      logger.info(`Received ${signal}, starting graceful shutdown`, { correlationId: 'system' });
      
      // Close server connections, database pools, etc.
      process.exit(0);
    });
  });
}

// Utility function to safely execute async operations
export async function safeAsync<T>(
  operation: () => Promise<T>,
  context: { correlationId?: string; operation?: string } = {}
): Promise<{ success: true; data: T } | { success: false; error: AppError }> {
  try {
    const data = await operation();
    return { success: true, data };
  } catch (error) {
    const appError = error instanceof AppError 
      ? error 
      : new AppError('Operation failed', 500, 'OPERATION_FAILED');
    
    logger.error(
      `Safe async operation failed: ${context.operation || 'unknown'}`,
      { correlationId: context.correlationId || 'unknown' },
      error as Error
    );
    
    return { success: false, error: appError };
  }
}
