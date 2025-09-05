# FieldFlux Testing Framework

This directory contains comprehensive unit tests for the FieldFlux application, implementing best practices for testing React components, hooks, backend services, and utility functions.

## 🏗️ Testing Architecture

### Test Structure
```
tests/
├── components/           # React component tests
│   ├── dashboard/       # Dashboard component tests
│   └── forms/           # Form component tests
├── hooks/               # Custom React hooks tests
├── services/            # Backend service tests
├── lib/                 # Utility function tests
├── api/                 # API service layer tests
├── setup/               # Test configuration
└── utils/               # Testing utilities and helpers
```

### Key Features

- **🧪 Comprehensive Coverage**: Tests for components, hooks, services, and utilities
- **♿ Accessibility Testing**: Built-in accessibility validation and keyboard navigation tests
- **🎭 Realistic Mocking**: Proper mocking strategies for external dependencies
- **⚡ Performance Testing**: Render time measurement and performance validation
- **🔍 Edge Case Coverage**: Extensive testing of error conditions and boundary cases
- **📱 Responsive Testing**: Viewport size testing for mobile/desktop compatibility

## 🚀 Quick Start

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- SocialScheduler.test.tsx

# Run tests matching pattern
npm test -- --grep "validation"
```

### Writing Your First Test

```typescript
import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../utils/test-utils';
import MyComponent from '@/components/MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    const { getByRole } = renderWithProviders(<MyComponent />);
    
    expect(getByRole('button')).toBeInTheDocument();
  });
});
```

## 📋 Testing Patterns

### 1. React Component Testing

**Example**: `components/dashboard/SocialScheduler.test.tsx`

Key patterns demonstrated:
- Component rendering and structure validation
- User interaction testing with `userEvent`
- Form validation and submission
- Loading states and error handling
- Accessibility compliance testing
- Performance optimization validation

```typescript
// Test component rendering
it('should render the social scheduler component', () => {
  renderWithProviders(<SocialScheduler />);
  
  expect(screen.getByRole('heading', { name: /social scheduler/i }))
    .toBeInTheDocument();
});

// Test user interactions
it('should open dialog when create post button is clicked', async () => {
  const { user } = renderWithProviders(<SocialScheduler />);
  
  await user.click(screen.getByRole('button', { name: /create post/i }));
  
  expect(screen.getByRole('dialog')).toBeInTheDocument();
});
```

### 2. Custom Hook Testing

**Example**: `hooks/useAuth.test.ts`

Key patterns demonstrated:
- Hook behavior testing with `renderHook`
- State change validation
- Error handling scenarios
- Performance and stability testing

```typescript
// Test hook initial state
it('should return initial loading state', () => {
  const { result } = renderHook(() => useAuth(), {
    wrapper: createWrapper(queryClient),
  });

  expect(result.current.isLoading).toBe(true);
  expect(result.current.isAuthenticated).toBe(false);
});
```

### 3. Backend Service Testing

**Example**: `services/felixAI.test.ts`

Key patterns demonstrated:
- Service method testing with proper mocking
- API integration testing
- Error handling and resilience
- Multiple provider support testing

```typescript
// Test service method
it('should generate response using GPT-5', async () => {
  mockOpenAI.chat.completions.create.mockResolvedValue(mockResponse);

  const response = await felixAI.generateResponse(mockMessages, mockContext);

  expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith(
    expect.objectContaining({ model: 'gpt-5' })
  );
});
```

### 4. Form Validation Testing

**Example**: `components/forms/LeadForm.test.tsx`

Key patterns demonstrated:
- Input validation testing
- Error message display
- Accessibility compliance
- User experience flow testing

```typescript
// Test form validation
it('should show validation error for empty name', async () => {
  const { user } = renderWithProviders(<LeadForm />);
  
  await user.click(screen.getByRole('button', { name: /submit/i }));
  
  await waitFor(() => {
    expect(screen.getByText('Name is required')).toBeInTheDocument();
  });
});
```

### 5. API Service Testing

**Example**: `api/queryClient.test.ts`

Key patterns demonstrated:
- HTTP client testing
- Request/response handling
- Error scenario coverage
- Authentication and authorization

```typescript
// Test API request
it('should make POST request with data', async () => {
  const requestData = { name: 'John Doe' };
  mockFetch.mockResolvedValueOnce(mockSuccessResponse);

  await apiRequest('POST', '/api/users', requestData);

  expect(mockFetch).toHaveBeenCalledWith('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestData),
  });
});
```

## 🛠️ Testing Utilities

### Custom Render Functions

```typescript
// Render with providers
const { user } = renderWithProviders(<Component />);

// Create test query client
const queryClient = createTestQueryClient();
```

### Mock Data Generators

```typescript
// Single mock objects
const user = createMockUser({ name: 'John Doe' });
const lead = createMockLead({ urgency: 'high' });

// Bulk mock data
const users = createMockUsers(10);
const posts = createMockSocialPosts(5, { platform: 'facebook' });
```

### API Response Mocking

```typescript
// Success response
mockFetch.mockResolvedValueOnce(mockSuccessResponse(data));

// Error response
mockFetch.mockResolvedValueOnce(mockErrorResponse(404, 'Not found'));
```

### Accessibility Testing

```typescript
// Check for accessibility violations
const violations = getAccessibilityViolations(container);
expect(violations).toHaveLength(0);
```

## 🎯 Testing Best Practices

### 1. Test Structure (AAA Pattern)

```typescript
it('should update user profile successfully', async () => {
  // Arrange
  const userData = { name: 'Updated Name' };
  const mockUpdate = vi.fn().mockResolvedValue(userData);
  
  // Act
  await userService.updateProfile(userData);
  
  // Assert
  expect(mockUpdate).toHaveBeenCalledWith(userData);
});
```

### 2. Descriptive Test Names

✅ **Good**:
```typescript
it('should show validation error when email format is invalid')
it('should call onSubmit with form data when validation passes')
it('should disable submit button during form submission')
```

❌ **Bad**:
```typescript
it('should work')
it('should test form')
it('should validate')
```

### 3. Comprehensive Error Testing

```typescript
describe('Error Handling', () => {
  it('should handle API errors gracefully', async () => {
    mockApiRequest.mockRejectedValue(new Error('Network error'));
    
    const response = await service.getData();
    
    expect(response.error).toBeDefined();
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Error',
      variant: 'destructive'
    });
  });
});
```

### 4. Edge Case Coverage

```typescript
describe('Edge Cases', () => {
  it('should handle empty content gracefully', () => {
    const component = renderWithProviders(<Component content="" />);
    expect(component.container).toBeInTheDocument();
  });

  it('should handle special characters in input', async () => {
    const { user } = renderWithProviders(<Form />);
    await user.type(input, 'José García-Smith');
    expect(input).toHaveValue('José García-Smith');
  });
});
```

### 5. Accessibility Testing

```typescript
describe('Accessibility', () => {
  it('should have proper ARIA labels', () => {
    renderWithProviders(<Component />);
    
    expect(screen.getByRole('button')).toHaveAttribute('aria-label');
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid');
  });

  it('should support keyboard navigation', async () => {
    const { user } = renderWithProviders(<Component />);
    
    await user.tab();
    expect(screen.getByRole('button')).toHaveFocus();
  });
});
```

## 🔧 Configuration

### Vitest Configuration

The testing framework uses Vitest with the following key configurations:

- **Environment**: jsdom for DOM testing
- **Setup Files**: Automatic setup for React Testing Library
- **Mocking**: Comprehensive mocking for external dependencies
- **Coverage**: Istanbul for coverage reporting

### Mock Setup

Global mocks are configured in `tests/setup/unit.setup.ts`:

- **Fetch API**: Global fetch mocking
- **React Router**: Navigation and routing mocks
- **External Libraries**: Third-party service mocks
- **Environment Variables**: Test environment configuration

## 📊 Coverage Goals

| Category | Target Coverage |
|----------|----------------|
| Components | ≥ 90% |
| Hooks | ≥ 95% |
| Services | ≥ 85% |
| Utilities | ≥ 95% |
| Overall | ≥ 90% |

### Running Coverage

```bash
npm run test:coverage
```

Coverage reports are generated in the `coverage/` directory with HTML reports available at `coverage/index.html`.

## 🚨 Common Testing Scenarios

### Testing Async Operations

```typescript
it('should handle async data loading', async () => {
  const mockData = { users: [] };
  mockApiRequest.mockResolvedValue(mockData);
  
  renderWithProviders(<UserList />);
  
  await waitFor(() => {
    expect(screen.getByText('No users found')).toBeInTheDocument();
  });
});
```

### Testing Error Boundaries

```typescript
it('should catch and display errors', () => {
  const ThrowError = () => {
    throw new Error('Test error');
  };
  
  const onError = vi.fn();
  
  render(
    <TestErrorBoundary onError={onError}>
      <ThrowError />
    </TestErrorBoundary>
  );
  
  expect(onError).toHaveBeenCalledWith(expect.any(Error));
  expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
});
```

### Testing Loading States

```typescript
it('should show loading state during data fetch', () => {
  // Mock never-resolving promise
  mockApiRequest.mockImplementation(() => new Promise(() => {}));
  
  renderWithProviders(<DataComponent />);
  
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});
```

### Testing Performance

```typescript
it('should render within performance budget', () => {
  const { time } = measureRenderTime(() => {
    renderWithProviders(<ComplexComponent />);
  });
  
  expect(time).toBeLessThan(100); // 100ms budget
});
```

## 🔍 Debugging Tests

### Debug Helpers

```typescript
import { debugElement, screen } from '../utils/test-utils';

// Debug specific element
debugElement(screen.getByRole('button'));

// Debug screen output
screen.debug();

// Debug specific element
screen.debug(screen.getByTestId('complex-element'));
```

### Common Issues

1. **Element Not Found**: Use `screen.debug()` to see actual DOM
2. **Async Timing**: Use `waitFor()` or `findBy*` queries
3. **Mock Issues**: Verify mock setup with `expect(mock).toHaveBeenCalled()`
4. **State Updates**: Ensure React state updates with `act()` when needed

## 📚 Resources

- [Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Vitest Documentation](https://vitest.dev/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)
- [MSW (Mock Service Worker)](https://mswjs.io/)
- [React Testing Patterns](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## 🤝 Contributing

When adding new tests:

1. Follow the established patterns in existing tests
2. Include accessibility testing for UI components
3. Test error conditions and edge cases
4. Use descriptive test names and organize with `describe` blocks
5. Add documentation for complex testing scenarios
6. Ensure tests are deterministic and don't rely on external state

---

**Happy Testing! 🧪✨**

This testing framework provides a solid foundation for maintaining code quality and preventing regressions in the FieldFlux application.