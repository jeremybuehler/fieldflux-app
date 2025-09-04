import { randomUUID } from 'crypto';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  correlationId: string;
  userId?: string;
  tenantId?: string;
  endpoint?: string;
  method?: string;
  userAgent?: string;
  ip?: string;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context: LogContext;
  metadata?: Record<string, any>;
  error?: {
    name: string;
    message: string;
    stack?: string;
    code?: string;
  };
  performance?: {
    duration?: number;
    memory?: number;
  };
}

class Logger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  private formatLog(entry: LogEntry): string {
    if (this.isDevelopment) {
      // Human-readable format for development
      const timestamp = new Date(entry.timestamp).toLocaleTimeString();
      const level = entry.level.toUpperCase().padEnd(5);
      const correlation = entry.context.correlationId.slice(0, 8);
      const endpoint = entry.context.endpoint ? ` [${entry.context.method} ${entry.context.endpoint}]` : '';
      
      let message = `${timestamp} ${level} [${correlation}]${endpoint} ${entry.message}`;
      
      if (entry.metadata && Object.keys(entry.metadata).length > 0) {
        message += `\n  Metadata: ${JSON.stringify(entry.metadata, null, 2)}`;
      }
      
      if (entry.error) {
        message += `\n  Error: ${entry.error.name}: ${entry.error.message}`;
        if (entry.error.stack) {
          message += `\n  Stack: ${entry.error.stack}`;
        }
      }
      
      return message;
    } else {
      // JSON format for production (structured logging)
      return JSON.stringify(entry);
    }
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context: Partial<LogContext>,
    metadata?: Record<string, any>,
    error?: Error
  ): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: {
        correlationId: context.correlationId || randomUUID(),
        ...context
      },
      metadata
    };

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
        code: (error as any).code
      };
    }

    return entry;
  }

  debug(message: string, context: Partial<LogContext> = {}, metadata?: Record<string, any>) {
    const entry = this.createLogEntry('debug', message, context, metadata);
    console.debug(this.formatLog(entry));
  }

  info(message: string, context: Partial<LogContext> = {}, metadata?: Record<string, any>) {
    const entry = this.createLogEntry('info', message, context, metadata);
    console.info(this.formatLog(entry));
  }

  warn(message: string, context: Partial<LogContext> = {}, metadata?: Record<string, any>) {
    const entry = this.createLogEntry('warn', message, context, metadata);
    console.warn(this.formatLog(entry));
  }

  error(message: string, context: Partial<LogContext> = {}, error?: Error, metadata?: Record<string, any>) {
    const entry = this.createLogEntry('error', message, context, metadata, error);
    console.error(this.formatLog(entry));
  }

  // Request lifecycle logging
  logRequest(req: any, correlationId?: string) {
    const context: LogContext = {
      correlationId: correlationId || randomUUID(),
      endpoint: req.path,
      method: req.method,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress,
      userId: req.user?.id,
      tenantId: req.tenant?.id
    };

    this.info('Request started', context, {
      query: req.query,
      body: this.sanitizeBody(req.body),
      headers: this.sanitizeHeaders(req.headers)
    });

    return context;
  }

  logResponse(context: LogContext, statusCode: number, duration: number, error?: Error) {
    const metadata = {
      statusCode,
      duration: `${duration}ms`,
      memory: process.memoryUsage().heapUsed / 1024 / 1024 // MB
    };

    if (error) {
      this.error('Request failed', context, error, metadata);
    } else if (statusCode >= 400) {
      this.warn('Request completed with client error', context, metadata);
    } else {
      this.info('Request completed successfully', context, metadata);
    }
  }

  // Performance monitoring
  performance(message: string, context: Partial<LogContext>, duration: number, metadata?: Record<string, any>) {
    const entry = this.createLogEntry('info', message, context, metadata);
    entry.performance = { duration };
    console.info(this.formatLog(entry));
  }

  private sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') return body;
    
    const sensitiveFields = ['password', 'token', 'key', 'secret', 'auth', 'credential'];
    const sanitized = { ...body };
    
    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    }
    
    return sanitized;
  }

  private sanitizeHeaders(headers: any): any {
    if (!headers || typeof headers !== 'object') return headers;
    
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key', 'x-auth-token'];
    const sanitized = { ...headers };
    
    for (const header of sensitiveHeaders) {
      if (sanitized[header]) {
        sanitized[header] = '[REDACTED]';
      }
    }
    
    return sanitized;
  }
}

// Singleton instance
export const logger = new Logger();

// Express middleware for request correlation
export function correlationMiddleware(req: any, res: any, next: any) {
  const correlationId = req.headers['x-correlation-id'] || randomUUID();
  req.correlationId = correlationId;
  res.setHeader('x-correlation-id', correlationId);
  
  const startTime = Date.now();
  const context = logger.logRequest(req, correlationId);
  
  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(...args: any[]) {
    const duration = Date.now() - startTime;
    logger.logResponse(context, res.statusCode, duration);
    originalEnd.apply(this, args);
  };
  
  next();
}

// Structured error logging helper
export function logError(error: Error, context: Partial<LogContext>, message?: string) {
  logger.error(message || 'Unhandled error occurred', context, error);
}

// Performance timing decorator
export function timed(target: any, propertyName: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;
  descriptor.value = async function(...args: any[]) {
    const start = Date.now();
    try {
      const result = await method.apply(this, args);
      const duration = Date.now() - start;
      logger.performance(
        `Method ${propertyName} completed`,
        { correlationId: randomUUID() },
        duration,
        { method: propertyName, args: args.length }
      );
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      logger.error(
        `Method ${propertyName} failed`,
        { correlationId: randomUUID() },
        error as Error,
        { method: propertyName, duration, args: args.length }
      );
      throw error;
    }
  };
}
