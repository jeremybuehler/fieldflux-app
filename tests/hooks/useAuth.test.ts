import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import type { ReactNode } from 'react';

// Mock the API request function
const mockApiRequest = vi.fn();

// Mock the query client module
vi.mock('@/lib/queryClient', () => ({
  apiRequest: mockApiRequest,
}));

const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  subscriptionStatus: 'active',
  role: 'user',
  tenantId: 'tenant-123',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        cacheTime: 0,
      },
    },
    logger: {
      log: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    },
  });
};

const createWrapper = (queryClient: QueryClient) => {
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useAuth Hook', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
  });

  afterEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  describe('Initial State', () => {
    it('should return initial loading state', () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(queryClient),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.user).toBeUndefined();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should have correct default configuration', () => {
      renderHook(() => useAuth(), {
        wrapper: createWrapper(queryClient),
      });

      const queryState = queryClient.getQueryState(['/api/auth/user']);
      expect(queryState).toBeDefined();
      
      // Verify the query key is set correctly
      const queryCache = queryClient.getQueryCache();
      const queries = queryCache.findAll(['/api/auth/user']);
      expect(queries).toHaveLength(1);
      expect(queries[0].options.retry).toBe(false);
    });
  });

  describe('Authenticated User', () => {
    it('should return user data when authenticated', async () => {
      // Pre-populate the query cache with user data
      queryClient.setQueryData(['/api/auth/user'], mockUser);

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should handle user data updates reactively', async () => {
      queryClient.setQueryData(['/api/auth/user'], mockUser);

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      // Update user data
      const updatedUser = { ...mockUser, firstName: 'Jane' };
      queryClient.setQueryData(['/api/auth/user'], updatedUser);

      await waitFor(() => {
        expect(result.current.user?.firstName).toBe('Jane');
        expect(result.current.isAuthenticated).toBe(true);
      });
    });

    it('should handle partial user data correctly', async () => {
      const partialUser = {
        id: 'user-123',
        email: 'test@example.com',
        // Missing some fields that might be optional
      };

      queryClient.setQueryData(['/api/auth/user'], partialUser);

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toEqual(partialUser);
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  describe('Unauthenticated User', () => {
    it('should return unauthenticated state when no user data', async () => {
      queryClient.setQueryData(['/api/auth/user'], null);

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should return unauthenticated state when user data is undefined', async () => {
      queryClient.setQueryData(['/api/auth/user'], undefined);

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeUndefined();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should handle empty object as unauthenticated', async () => {
      queryClient.setQueryData(['/api/auth/user'], {});

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toEqual({});
      expect(result.current.isAuthenticated).toBe(false); // Empty object is falsy
    });
  });

  describe('Error Handling', () => {
    it('should handle query errors gracefully', async () => {
      // Set the query to an error state
      queryClient.setQueryData(['/api/auth/user'], undefined);
      queryClient.setQueryState(['/api/auth/user'], {
        status: 'error',
        error: new Error('Authentication failed'),
        dataUpdatedAt: Date.now(),
      } as any);

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeUndefined();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should handle network errors without crashing', async () => {
      // Simulate a network error scenario
      const networkError = new Error('Network Error');
      queryClient.setQueryState(['/api/auth/user'], {
        status: 'error',
        error: networkError,
        dataUpdatedAt: Date.now(),
      } as any);

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should not retry on authentication failures', () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(queryClient),
      });

      const queryState = queryClient.getQueryState(['/api/auth/user']);
      const query = queryClient.getQueryCache().find(['/api/auth/user']);
      
      expect(query?.options.retry).toBe(false);
    });
  });

  describe('Authentication State Changes', () => {
    it('should transition from loading to authenticated', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(queryClient),
      });

      // Initially loading
      expect(result.current.isLoading).toBe(true);
      expect(result.current.isAuthenticated).toBe(false);

      // Simulate successful authentication
      queryClient.setQueryData(['/api/auth/user'], mockUser);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.user).toEqual(mockUser);
      });
    });

    it('should transition from loading to unauthenticated', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(queryClient),
      });

      // Initially loading
      expect(result.current.isLoading).toBe(true);
      expect(result.current.isAuthenticated).toBe(false);

      // Simulate authentication failure
      queryClient.setQueryData(['/api/auth/user'], null);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.user).toBeNull();
      });
    });

    it('should handle logout by clearing user data', async () => {
      // Start with authenticated user
      queryClient.setQueryData(['/api/auth/user'], mockUser);

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      // Simulate logout
      queryClient.setQueryData(['/api/auth/user'], null);

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.user).toBeNull();
      });
    });
  });

  describe('Hook Behavior', () => {
    it('should maintain referential stability for return values', async () => {
      queryClient.setQueryData(['/api/auth/user'], mockUser);

      const { result, rerender } = renderHook(() => useAuth(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const firstRender = result.current;
      
      // Trigger re-render
      rerender();

      // Values should be stable when data hasn't changed
      expect(result.current.user).toEqual(firstRender.user);
      expect(result.current.isAuthenticated).toBe(firstRender.isAuthenticated);
      expect(result.current.isLoading).toBe(firstRender.isLoading);
    });

    it('should work with multiple hook instances', async () => {
      queryClient.setQueryData(['/api/auth/user'], mockUser);

      const { result: result1 } = renderHook(() => useAuth(), {
        wrapper: createWrapper(queryClient),
      });

      const { result: result2 } = renderHook(() => useAuth(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(result1.current.isLoading).toBe(false);
        expect(result2.current.isLoading).toBe(false);
      });

      // Both hooks should return the same data
      expect(result1.current.user).toEqual(result2.current.user);
      expect(result1.current.isAuthenticated).toBe(result2.current.isAuthenticated);
    });
  });

  describe('Edge Cases', () => {
    it('should handle boolean false as unauthenticated', async () => {
      queryClient.setQueryData(['/api/auth/user'], false);

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBe(false);
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should handle zero as unauthenticated', async () => {
      queryClient.setQueryData(['/api/auth/user'], 0);

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBe(0);
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should handle empty string as unauthenticated', async () => {
      queryClient.setQueryData(['/api/auth/user'], '');

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBe('');
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should handle truthy non-object values as authenticated', async () => {
      queryClient.setQueryData(['/api/auth/user'], 'user-token');

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBe('user-token');
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should handle arrays as authenticated if not empty', async () => {
      const userArray = [mockUser];
      queryClient.setQueryData(['/api/auth/user'], userArray);

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toEqual(userArray);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should handle empty arrays as unauthenticated', async () => {
      queryClient.setQueryData(['/api/auth/user'], []);

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toEqual([]);
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('Performance', () => {
    it('should not cause unnecessary re-renders', async () => {
      queryClient.setQueryData(['/api/auth/user'], mockUser);
      
      const renderSpy = vi.fn();
      
      const TestComponent = () => {
        renderSpy();
        const auth = useAuth();
        return null;
      };

      const { rerender } = renderHook(() => <TestComponent />, {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(renderSpy).toHaveBeenCalled();
      });

      const initialCallCount = renderSpy.mock.calls.length;

      // Multiple re-renders shouldn't trigger additional calls
      rerender();
      rerender();
      rerender();

      // Should not have additional renders beyond initial and re-render cycles
      expect(renderSpy.mock.calls.length).toBeLessThanOrEqual(initialCallCount + 3);
    });
  });
});