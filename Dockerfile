# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for building)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Install curl for healthcheck
RUN apk add --no-cache curl

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/client/dist ./client/dist

# Copy necessary files for runtime
COPY migrations ./migrations
COPY shared ./shared

# Create entrypoint script for database migrations
RUN echo '#!/bin/sh\nnpm run db:push\nexec "$@"' > /app/entrypoint.sh && chmod +x /app/entrypoint.sh

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S fieldpulse -u 1001

# Change ownership of app directory
RUN chown -R fieldpulse:nodejs /app
USER fieldpulse

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/api/health || exit 1

# Start the application with entrypoint
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["npm", "start"]