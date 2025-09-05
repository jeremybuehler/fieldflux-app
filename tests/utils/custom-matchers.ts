import { expect } from 'vitest';

interface CustomMatchers<R = unknown> {
  toHaveValidStructure(expected: Record<string, string>): R;
}

declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}

// Custom matcher to validate object structure
expect.extend({
  toHaveValidStructure(received: any, expected: Record<string, string>) {
    const { isNot } = this;
    
    if (typeof received !== 'object' || received === null) {
      return {
        message: () => `Expected ${received} to be an object`,
        pass: false,
      };
    }

    const errors: string[] = [];

    // Check each expected property and type
    for (const [key, expectedType] of Object.entries(expected)) {
      if (!(key in received)) {
        errors.push(`Missing property: ${key}`);
        continue;
      }

      const actualType = typeof received[key];
      const actualValue = received[key];

      // Handle special cases
      if (expectedType === 'object') {
        if (actualType !== 'object' || actualValue === null) {
          errors.push(`Property ${key}: expected object, got ${actualType}`);
        }
      } else if (expectedType === 'array') {
        if (!Array.isArray(actualValue)) {
          errors.push(`Property ${key}: expected array, got ${actualType}`);
        }
      } else if (actualType !== expectedType) {
        errors.push(`Property ${key}: expected ${expectedType}, got ${actualType}`);
      }
    }

    const pass = errors.length === 0;

    return {
      message: () => {
        if (isNot && pass) {
          return `Expected object NOT to have valid structure, but it does`;
        }
        if (!isNot && !pass) {
          return `Expected object to have valid structure. Errors:\n${errors.join('\n')}`;
        }
        return '';
      },
      pass,
    };
  },
});

// Export types for TypeScript
export {};
