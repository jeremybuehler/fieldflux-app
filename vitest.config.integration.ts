import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    name: 'integration',
    environment: 'node',
    setupFiles: ['./tests/setup/integration.setup.ts'],
    include: [
      'tests/integration/**/*.test.ts'
    ],
    exclude: [
      'tests/unit/**/*',
      'tests/e2e/**/*',
      'node_modules/**/*'
    ],
    globals: true,
    testTimeout: 30000,
    hookTimeout: 30000,
    maxConcurrency: 1, // Run integration tests sequentially
    pool: 'forks', // Use separate processes for isolation
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json'],
      exclude: [
        'node_modules/',
        'dist/',
        'tests/',
        'client/',
        '**/*.d.ts',
        '**/*.config.*'
      ]
    }
  },
  resolve: {
    alias: {
      '@server': resolve(__dirname, './server')
    }
  }
});
