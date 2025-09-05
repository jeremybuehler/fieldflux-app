import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiRequest, queryClient } from '@/lib/queryClient';

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock console methods to avoid noise in tests
const originalConsole = console;
beforeEach(() => {
  console.error = vi.fn();
  console.warn = vi.fn();
});

afterEach(() => {
  console.error = originalConsole.error;
  console.warn = originalConsole.warn;
});

describe('API Query Client', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('apiRequest function', () => {
    describe('Successful Requests', () => {
      it('should make GET request successfully', async () => {
        const mockResponse = { data: 'test data' };
        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockResponse),
          headers: new Headers({ 'content-type': 'application/json' }),
        });

        const response = await apiRequest('GET', '/api/test');

        expect(mockFetch).toHaveBeenCalledWith('/api/test', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        expect(data).toEqual(mockResponse);
      });

      it('should make POST request with data', async () => {
        const requestData = { name: 'John Doe', email: 'john@example.com' };
        const mockResponse = { id: '123', ...requestData };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 201,
          json: () => Promise.resolve(mockResponse),
          headers: new Headers({ 'content-type': 'application/json' }),
        });

        const response = await apiRequest('POST', '/api/users', requestData);

        expect(mockFetch).toHaveBeenCalledWith('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        const data = await response.json();
        expect(data).toEqual(mockResponse);
      });

      it('should make PUT request with data', async () => {
        const updateData = { name: 'Updated Name' };
        const mockResponse = { id: '123', ...updateData };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockResponse),
          headers: new Headers({ 'content-type': 'application/json' }),
        });

        await apiRequest('PUT', '/api/users/123', updateData);

        expect(mockFetch).toHaveBeenCalledWith('/api/users/123', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        });
      });

      it('should make DELETE request', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 204,
          json: () => Promise.resolve({}),
          headers: new Headers(),
        });

        await apiRequest('DELETE', '/api/users/123');

        expect(mockFetch).toHaveBeenCalledWith('/api/users/123', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      });
    });

    describe('Custom Headers', () => {
      it('should include custom headers', async () => {
        const customHeaders = {
          'Authorization': 'Bearer token123',
          'X-Custom-Header': 'custom-value'
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve({}),
          headers: new Headers(),
        });

        await apiRequest('GET', '/api/protected', undefined, customHeaders);

        expect(mockFetch).toHaveBeenCalledWith('/api/protected', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer token123',
            'X-Custom-Header': 'custom-value',
          },
        });
      });

      it('should override default Content-Type header', async () => {
        const customHeaders = {
          'Content-Type': 'application/x-www-form-urlencoded'
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve({}),
          headers: new Headers(),
        });

        await apiRequest('POST', '/api/form', 'form=data', customHeaders);

        expect(mockFetch).toHaveBeenCalledWith('/api/form', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: 'form=data',
        });
      });
    });

    describe('Request Body Handling', () => {
      it('should not include body for GET requests', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve({}),
          headers: new Headers(),
        });

        await apiRequest('GET', '/api/test', { data: 'should be ignored' });

        expect(mockFetch).toHaveBeenCalledWith('/api/test', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // No body property
        });
      });

      it('should handle string data without JSON stringification', async () => {
        const stringData = 'raw string data';

        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve({}),
          headers: new Headers(),
        });

        await apiRequest('POST', '/api/raw', stringData);

        expect(mockFetch).toHaveBeenCalledWith('/api/raw', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: stringData,
        });
      });

      it('should stringify object data', async () => {
        const objectData = { key: 'value', number: 123 };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve({}),
          headers: new Headers(),
        });

        await apiRequest('POST', '/api/object', objectData);

        expect(mockFetch).toHaveBeenCalledWith('/api/object', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(objectData),
        });
      });

      it('should handle null and undefined data', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve({}),
          headers: new Headers(),
        });

        await apiRequest('POST', '/api/null', null);

        expect(mockFetch).toHaveBeenCalledWith('/api/null', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: 'null',
        });
      });
    });

    describe('Error Handling', () => {
      it('should throw error for HTTP error status codes', async () => {
        const errorResponse = { message: 'Not found', code: 'NOT_FOUND' };
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 404,
          statusText: 'Not Found',
          json: () => Promise.resolve(errorResponse),
          headers: new Headers({ 'content-type': 'application/json' }),
        });

        await expect(apiRequest('GET', '/api/nonexistent')).rejects.toThrow('HTTP error! status: 404');
      });

      it('should handle 500 server errors', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
          json: () => Promise.resolve({ message: 'Server error' }),
          headers: new Headers(),
        });

        await expect(apiRequest('POST', '/api/error')).rejects.toThrow('HTTP error! status: 500');
      });

      it('should handle 401 unauthorized errors', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 401,
          statusText: 'Unauthorized',
          json: () => Promise.resolve({ message: 'Unauthorized access' }),
          headers: new Headers(),
        });

        await expect(apiRequest('GET', '/api/protected')).rejects.toThrow('HTTP error! status: 401');
      });

      it('should handle 422 validation errors', async () => {
        const validationErrors = {
          message: 'Validation failed',
          errors: {
            email: ['Email is required'],
            name: ['Name must be at least 2 characters']
          }
        };

        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 422,
          statusText: 'Unprocessable Entity',
          json: () => Promise.resolve(validationErrors),
          headers: new Headers(),
        });

        await expect(apiRequest('POST', '/api/users', {})).rejects.toThrow('HTTP error! status: 422');
      });

      it('should handle network errors', async () => {
        mockFetch.mockRejectedValueOnce(new Error('Network error'));

        await expect(apiRequest('GET', '/api/test')).rejects.toThrow('Network error');
      });

      it('should handle timeout errors', async () => {
        mockFetch.mockRejectedValueOnce(new Error('Request timeout'));

        await expect(apiRequest('GET', '/api/slow')).rejects.toThrow('Request timeout');
      });

      it('should handle fetch being unavailable', async () => {
        const originalFetch = global.fetch;
        global.fetch = undefined as any;

        try {
          await expect(apiRequest('GET', '/api/test')).rejects.toThrow();
        } finally {
          global.fetch = originalFetch;
        }
      });
    });

    describe('Response Types', () => {
      it('should handle JSON responses', async () => {
        const jsonData = { message: 'success', data: [1, 2, 3] };
        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve(jsonData),
          text: () => Promise.resolve(JSON.stringify(jsonData)),
          headers: new Headers({ 'content-type': 'application/json' }),
        });

        const response = await apiRequest('GET', '/api/json');
        const data = await response.json();

        expect(data).toEqual(jsonData);
      });

      it('should handle text responses', async () => {
        const textData = 'plain text response';
        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.reject(new Error('Not JSON')),
          text: () => Promise.resolve(textData),
          headers: new Headers({ 'content-type': 'text/plain' }),
        });

        const response = await apiRequest('GET', '/api/text');
        const text = await response.text();

        expect(text).toBe(textData);
      });

      it('should handle empty responses', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 204,
          json: () => Promise.resolve(null),
          text: () => Promise.resolve(''),
          headers: new Headers(),
        });

        const response = await apiRequest('DELETE', '/api/users/123');
        
        expect(response.status).toBe(204);
      });

      it('should handle blob responses', async () => {
        const blobData = new Blob(['binary data'], { type: 'application/octet-stream' });
        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          blob: () => Promise.resolve(blobData),
          headers: new Headers({ 'content-type': 'application/octet-stream' }),
        });

        const response = await apiRequest('GET', '/api/file');
        const blob = await response.blob();

        expect(blob).toBeInstanceOf(Blob);
      });
    });

    describe('URL Handling', () => {
      it('should handle relative URLs', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve({}),
          headers: new Headers(),
        });

        await apiRequest('GET', '/api/relative');

        expect(mockFetch).toHaveBeenCalledWith('/api/relative', expect.any(Object));
      });

      it('should handle absolute URLs', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve({}),
          headers: new Headers(),
        });

        await apiRequest('GET', 'https://api.example.com/external');

        expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/external', expect.any(Object));
      });

      it('should handle URLs with query parameters', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve({}),
          headers: new Headers(),
        });

        await apiRequest('GET', '/api/search?q=test&limit=10');

        expect(mockFetch).toHaveBeenCalledWith('/api/search?q=test&limit=10', expect.any(Object));
      });
    });

    describe('HTTP Methods', () => {
      const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const;

      methods.forEach(method => {
        it(`should support ${method} method`, async () => {
          mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: () => Promise.resolve({}),
            headers: new Headers(),
          });

          await apiRequest(method, '/api/test');

          expect(mockFetch).toHaveBeenCalledWith('/api/test', 
            expect.objectContaining({ method })
          );
        });
      });
    });

    describe('Authentication', () => {
      it('should include authentication headers when provided', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve({}),
          headers: new Headers(),
        });

        await apiRequest('GET', '/api/protected', undefined, {
          'Authorization': 'Bearer jwt-token-here'
        });

        expect(mockFetch).toHaveBeenCalledWith('/api/protected', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer jwt-token-here',
          },
        });
      });

      it('should handle cookie-based authentication', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve({}),
          headers: new Headers(),
        });

        await apiRequest('GET', '/api/session', undefined, {
          'Cookie': 'session_id=abc123'
        });

        expect(mockFetch).toHaveBeenCalledWith('/api/session', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': 'session_id=abc123',
          },
        });
      });
    });

    describe('Edge Cases', () => {
      it('should handle extremely large payloads', async () => {
        const largeData = {
          data: 'a'.repeat(10000),
          array: new Array(1000).fill({ key: 'value' })
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ received: true }),
          headers: new Headers(),
        });

        await expect(apiRequest('POST', '/api/large', largeData)).resolves.toBeDefined();
      });

      it('should handle special characters in URLs', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve({}),
          headers: new Headers(),
        });

        await apiRequest('GET', '/api/search?q=test%20query&filter=ñ');

        expect(mockFetch).toHaveBeenCalledWith('/api/search?q=test%20query&filter=ñ', expect.any(Object));
      });

      it('should handle concurrent requests', async () => {
        const responses = [
          { ok: true, status: 200, json: () => Promise.resolve({ id: 1 }), headers: new Headers() },
          { ok: true, status: 200, json: () => Promise.resolve({ id: 2 }), headers: new Headers() },
          { ok: true, status: 200, json: () => Promise.resolve({ id: 3 }), headers: new Headers() }
        ];

        mockFetch
          .mockResolvedValueOnce(responses[0])
          .mockResolvedValueOnce(responses[1])
          .mockResolvedValueOnce(responses[2]);

        const promises = [
          apiRequest('GET', '/api/users/1'),
          apiRequest('GET', '/api/users/2'),
          apiRequest('GET', '/api/users/3')
        ];

        const results = await Promise.all(promises);
        expect(results).toHaveLength(3);
        expect(mockFetch).toHaveBeenCalledTimes(3);
      });

      it('should handle malformed JSON responses gracefully', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.reject(new SyntaxError('Unexpected token')),
          text: () => Promise.resolve('malformed json {'),
          headers: new Headers({ 'content-type': 'application/json' }),
        });

        const response = await apiRequest('GET', '/api/malformed');
        
        // The response should still be returned, allowing the caller to handle the JSON parsing error
        await expect(response.json()).rejects.toThrow('Unexpected token');
      });
    });

    describe('Performance', () => {
      it('should handle rapid successive requests', async () => {
        const startTime = Date.now();
        
        // Mock fast responses
        for (let i = 0; i < 10; i++) {
          mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: () => Promise.resolve({ id: i }),
            headers: new Headers(),
          });
        }

        const requests = Array.from({ length: 10 }, (_, i) => 
          apiRequest('GET', `/api/fast/${i}`)
        );

        await Promise.all(requests);
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        // Should complete reasonably quickly (less than 1 second for 10 mock requests)
        expect(duration).toBeLessThan(1000);
        expect(mockFetch).toHaveBeenCalledTimes(10);
      });
    });
  });

  describe('Query Client Configuration', () => {
    it('should have correct default options', () => {
      const defaultOptions = queryClient.getDefaultOptions();
      
      expect(defaultOptions.queries?.staleTime).toBe(1000 * 60 * 5); // 5 minutes
      expect(defaultOptions.queries?.retry).toBe(false);
      expect(defaultOptions.mutations?.retry).toBe(false);
    });

    it('should have appropriate cache settings', () => {
      const cache = queryClient.getQueryCache();
      expect(cache).toBeDefined();
      
      const mutationCache = queryClient.getMutationCache();
      expect(mutationCache).toBeDefined();
    });
  });

  describe('Integration Scenarios', () => {
    it('should work with TanStack Query hooks', async () => {
      const mockData = { users: [{ id: 1, name: 'John' }] };
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockData),
        headers: new Headers(),
      });

      // Simulate what a useQuery hook would do
      const queryFn = async () => {
        const response = await apiRequest('GET', '/api/users');
        return response.json();
      };

      const result = await queryFn();
      expect(result).toEqual(mockData);
    });

    it('should handle authentication errors in mutations', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: () => Promise.resolve({ message: 'Authentication required' }),
        headers: new Headers(),
      });

      // Simulate what a useMutation hook would do
      const mutationFn = async (userData: any) => {
        const response = await apiRequest('POST', '/api/users', userData);
        return response.json();
      };

      await expect(mutationFn({ name: 'John' })).rejects.toThrow('HTTP error! status: 401');
    });

    it('should support optimistic updates pattern', async () => {
      const existingData = [{ id: 1, name: 'John' }];
      const newUser = { id: 2, name: 'Jane' };
      
      // First call - get existing data
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(existingData),
        headers: new Headers(),
      });

      // Second call - create new user
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: () => Promise.resolve(newUser),
        headers: new Headers(),
      });

      // Simulate optimistic update pattern
      const getUsers = async () => {
        const response = await apiRequest('GET', '/api/users');
        return response.json();
      };

      const createUser = async (userData: any) => {
        const response = await apiRequest('POST', '/api/users', userData);
        return response.json();
      };

      const users = await getUsers();
      expect(users).toEqual(existingData);

      const createdUser = await createUser(newUser);
      expect(createdUser).toEqual(newUser);
    });
  });
});