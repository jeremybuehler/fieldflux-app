import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup/vitest.setup.ts'],
    include: [
      'tests/unit/**/*.test.ts',
      'tests/unit/**/*.test.tsx',
      'tests/components/**/*.test.tsx',
      'tests/hooks/**/*.test.ts',
      'tests/lib/**/*.test.ts',
      'tests/services/**/*.test.ts',
      'tests/api/**/*.test.ts',
      'client/src/**/*.test.ts',
      'client/src/**/*.test.tsx',
      'server/**/*.test.ts'
    ],
    exclude: [
      'tests/integration/**/*',
      'tests/e2e/**/*',
      'tests/performance/**/*',
      'node_modules/**/*'
    ],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: [
        'client/src/**/*.{ts,tsx}',
        'server/**/*.{ts,js}',
        'shared/**/*.{ts,js}'
      ],
      exclude: [
        'node_modules/',
        'dist/',
        'tests/',
        'coverage/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/index.ts',
        '**/*.stories.*',
        'client/src/pages/demo.tsx', // Demo page
        'server/index.ts', // Entry point
        'server/serverless.ts' // Serverless entry
      ],
      thresholds: {
        global: {
          branches: 60,
          functions: 60,
          lines: 60,
          statements: 60
        }
      },
      all: true
    },
    testTimeout: 10000,
    hookTimeout: 10000,
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './client/src'),
      '@server': resolve(__dirname, './server'),
      '@shared': resolve(__dirname, './shared'),
      '@tests': resolve(__dirname, './tests')
    }
  },
  define: {
    global: 'globalThis'
  }
});
