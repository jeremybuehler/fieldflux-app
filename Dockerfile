FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

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

# Run database migrations on startup
RUN echo '#!/bin/sh\nnpm run db:push\nexec "$@"' > /app/entrypoint.sh && chmod +x /app/entrypoint.sh

# Start the application with entrypoint
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["npm", "start"]