import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

// Import new error handling and logging infrastructure
import { 
  correlationMiddleware, 
  logger 
} from "./lib/logger";
import { 
  errorHandler, 
  notFoundHandler,
  handleUnhandledRejection,
  handleUncaughtException,
  handleGracefulShutdown
} from "./lib/errors";
import { rateLimiters, bypassRateLimit } from "./lib/rate-limit";

// Initialize error handlers
handleUnhandledRejection();
handleUncaughtException();
handleGracefulShutdown();

const app = express();

// Trust proxy for accurate IP addresses and rate limiting
app.set('trust proxy', 1);

// Basic middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Add correlation ID to all requests and structured logging
app.use(correlationMiddleware);

// Rate limiting for API routes
app.use('/api', bypassRateLimit); // Allow bypass in development
app.use('/api', rateLimiters.general);

(async () => {
  try {
    logger.info('Starting FieldFlux server', { correlationId: 'startup' });
    
    const server = await registerRoutes(app);
    logger.info('Routes registered successfully', { correlationId: 'startup' });

    // Add 404 handler for unmatched routes
    app.use(notFoundHandler);
    
    // Add centralized error handler (must be last)
    app.use(errorHandler);

    // Setup Vite in development or serve static files in production
    if (app.get("env") === "development") {
      logger.info('Setting up Vite development server', { correlationId: 'startup' });
      await setupVite(app, server);
    } else {
      logger.info('Serving static files for production', { correlationId: 'startup' });
      serveStatic(app);
    }

    // Server configuration for deployment
    const port = process.env.PORT || 8080;
    
    server.listen(port, () => {
      logger.info(`FieldFlux server listening on port ${port}`, {
        correlationId: 'startup',
        port,
        environment: process.env.NODE_ENV || 'development',
        version: process.env.npm_package_version || 'unknown'
      });
    }).on('error', (err) => {
      logger.error('Server failed to start', { correlationId: 'startup' }, err);
      process.exit(1);
    });
    
  } catch (error) {
    logger.error('Failed to initialize server', { correlationId: 'startup' }, error as Error);
    process.exit(1);
  }
});
