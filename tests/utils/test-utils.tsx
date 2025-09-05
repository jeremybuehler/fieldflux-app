import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';

// Custom render function for tests
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        cacheTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
    logger: {
      log: () => {},
      warn: () => {},
      error: () => {},
    },
  });
}

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient;
  initialEntries?: string[];
}

export function renderWithProviders(
  ui: ReactElement,
  {
    queryClient = createTestQueryClient(),
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  }

  return {
    user: userEvent.setup(),
    queryClient,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

// Mock data generators
export const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  subscriptionStatus: 'active' as const,
  role: 'user' as const,
  tenantId: 'tenant-123',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const mockLead = {
  id: 'lead-123',
  tenantId: 'tenant-123',
  name: 'Jane Smith',
  email: 'jane@example.com',
  phone: '+1-555-123-4567',
  message: 'Need HVAC repair',
  source: 'google',
  status: 'new' as const,
  urgency: 'high' as const,
  serviceNeeded: 'Furnace repair',
  address: '123 Main St, City, State',
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
};

export const mockSocialPost = {
  id: 'post-123',
  tenantId: 'tenant-123',
  userId: 'user-123',
  content: 'Winter HVAC maintenance tips for homeowners',
  platform: 'facebook' as const,
  status: 'published' as const,
  scheduledFor: new Date('2024-01-15'),
  createdAt: new Date('2024-01-10'),
  updatedAt: new Date('2024-01-10'),
};

// Factory functions for creating test data
export function createMockUser(overrides: Partial<typeof mockUser> = {}) {
  return { ...mockUser, ...overrides };
}

export function createMockLead(overrides: Partial<typeof mockLead> = {}) {
  return { ...mockLead, ...overrides };
}

export function createMockSocialPost(overrides: Partial<typeof mockSocialPost> = {}) {
  return { ...mockSocialPost, ...overrides };
}

// Array generators for bulk data
export function createMockUsers(count: number, baseOverrides: Partial<typeof mockUser> = {}) {
  return Array.from({ length: count }, (_, index) =>
    createMockUser({
      id: `user-${index + 1}`,
      email: `user${index + 1}@example.com`,
      firstName: `User${index + 1}`,
      ...baseOverrides,
    })
  );
}

export function createMockLeads(count: number, baseOverrides: Partial<typeof mockLead> = {}) {
  return Array.from({ length: count }, (_, index) =>
    createMockLead({
      id: `lead-${index + 1}`,
      email: `lead${index + 1}@example.com`,
      name: `Lead ${index + 1}`,
      ...baseOverrides,
    })
  );
}

export function createMockSocialPosts(count: number, baseOverrides: Partial<typeof mockSocialPost> = {}) {
  const platforms = ['facebook', 'instagram', 'twitter'] as const;
  const statuses = ['draft', 'scheduled', 'published'] as const;
  
  return Array.from({ length: count }, (_, index) =>
    createMockSocialPost({
      id: `post-${index + 1}`,
      content: `Social media post content ${index + 1}`,
      platform: platforms[index % platforms.length],
      status: statuses[index % statuses.length],
      ...baseOverrides,
    })
  );
}

// API Mock helpers
export function mockSuccessResponse<T>(data: T) {
  return {
    ok: true,
    status: 200,
    json: () => Promise.resolve(data),
    headers: new Headers({ 'content-type': 'application/json' }),
  };
}

export function mockErrorResponse(status: number, message: string) {
  return {
    ok: false,
    status,
    statusText: getStatusText(status),
    json: () => Promise.resolve({ message }),
    headers: new Headers({ 'content-type': 'application/json' }),
  };
}

function getStatusText(status: number): string {
  const statusTexts: Record<number, string> = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    422: 'Unprocessable Entity',
    500: 'Internal Server Error',
  };
  return statusTexts[status] || 'Unknown Error';
}

// Form testing helpers
export async function fillForm(user: ReturnType<typeof userEvent.setup>, formData: Record<string, string>) {
  for (const [field, value] of Object.entries(formData)) {
    const input = document.querySelector(`[name="${field}"]`) as HTMLElement;
    if (input) {
      await user.clear(input);
      await user.type(input, value);
    }
  }
}

export async function submitForm(user: ReturnType<typeof userEvent.setup>, formSelector = 'form') {
  const submitButton = document.querySelector(`${formSelector} [type="submit"]`) as HTMLElement;
  if (submitButton) {
    await user.click(submitButton);
  }
}

// Wait helpers
export function waitForQueryToSettle(queryClient: QueryClient, queryKey: unknown[]) {
  return new Promise<void>((resolve) => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event.type === 'updated' && JSON.stringify(event.query.queryKey) === JSON.stringify(queryKey)) {
        if (!event.query.isFetching) {
          unsubscribe();
          resolve();
        }
      }
    });
  });
}

// Accessibility testing helpers
export function getAccessibilityViolations(container: HTMLElement) {
  const violations: string[] = [];
  
  // Check for missing alt text on images
  const images = container.querySelectorAll('img:not([alt])');
  if (images.length > 0) {
    violations.push(`Found ${images.length} images without alt text`);
  }
  
  // Check for form inputs without labels
  const inputs = container.querySelectorAll('input, select, textarea');
  inputs.forEach((input) => {
    const id = input.getAttribute('id');
    const ariaLabel = input.getAttribute('aria-label');
    const ariaLabelledby = input.getAttribute('aria-labelledby');
    
    if (id) {
      const label = container.querySelector(`label[for="${id}"]`);
      if (!label && !ariaLabel && !ariaLabelledby) {
        violations.push(`Input with id "${id}" has no associated label`);
      }
    }
  });
  
  // Check for buttons without accessible names
  const buttons = container.querySelectorAll('button:not([aria-label]):not([title])');
  buttons.forEach((button) => {
    if (!button.textContent?.trim()) {
      violations.push('Found button without accessible name');
    }
  });
  
  return violations;
}

// Performance testing helpers
export function measureRenderTime<T>(renderFn: () => T): { result: T; time: number } {
  const start = performance.now();
  const result = renderFn();
  const end = performance.now();
  
  return {
    result,
    time: end - start,
  };
}

// Error boundary for testing error scenarios
export class TestErrorBoundary extends React.Component<
  { children: React.ReactNode; onError?: (error: Error) => void },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return <div data-testid="error-boundary">Something went wrong</div>;
    }

    return this.props.children;
  }
}

// Mock localStorage for testing
export function createMockLocalStorage() {
  const store: Record<string, string> = {};
  
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = String(value);
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach(key => delete store[key]);
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
  };
}

// Date and time helpers for testing
export function mockDate(dateString: string) {
  const mockDate = new Date(dateString);
  const originalDate = global.Date;
  
  global.Date = class extends Date {
    constructor(...args: any[]) {
      if (args.length === 0) {
        return mockDate;
      }
      return super(...args);
    }
    
    static now() {
      return mockDate.getTime();
    }
  } as any;
  
  return () => {
    global.Date = originalDate;
  };
}

// Viewport size helpers for responsive testing
export function setViewportSize(width: number, height: number) {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  
  window.dispatchEvent(new Event('resize'));
}

// Common viewport sizes
export const viewportSizes = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1920, height: 1080 },
  smallMobile: { width: 320, height: 568 },
  largeMobile: { width: 414, height: 896 },
};

// Debug helpers
export function debugElement(element: HTMLElement | null) {
  if (!element) {
    console.log('Element is null or undefined');
    return;
  }
  
  console.log('Element:', element.tagName);
  console.log('Classes:', element.className);
  console.log('Attributes:', Array.from(element.attributes).map(attr => `${attr.name}="${attr.value}"`));
  console.log('Text content:', element.textContent);
  console.log('Inner HTML:', element.innerHTML);
}

// Re-export common testing utilities
export * from '@testing-library/react';
export { userEvent };

// Type helpers
export type MockFunction<T extends (...args: any[]) => any> = T & {
  mockImplementation: (fn: T) => MockFunction<T>;
  mockReturnValue: (value: ReturnType<T>) => MockFunction<T>;
  mockResolvedValue: (value: Awaited<ReturnType<T>>) => MockFunction<T>;
  mockRejectedValue: (error: any) => MockFunction<T>;
  mockClear: () => void;
  mockReset: () => void;
  mock: {
    calls: Parameters<T>[];
    results: Array<{ type: 'return' | 'throw'; value: any }>;
  };
};

export type MockObject<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? MockFunction<T[K]> : T[K];
};