import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SocialScheduler from '@/components/dashboard/social-scheduler';
import { useToast } from '@/hooks/use-toast';
import * as queryClient from '@/lib/queryClient';
import * as analytics from '@/lib/analytics';
import type { SocialPost } from '@shared/schema';

// Mock dependencies
vi.mock('@/hooks/use-toast');
vi.mock('@/lib/queryClient');
vi.mock('@/lib/analytics');

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  Calendar: () => <div data-testid="calendar-icon" />,
  Plus: () => <div data-testid="plus-icon" />,
  Facebook: () => <div data-testid="facebook-icon" />,
  Instagram: () => <div data-testid="instagram-icon" />,
  Twitter: () => <div data-testid="twitter-icon" />,
  Lightbulb: () => <div data-testid="lightbulb-icon" />,
  RefreshCw: () => <div data-testid="refresh-icon" />,
  Check: () => <div data-testid="check-icon" />,
  X: () => <div data-testid="x-icon" />,
}));

const mockToast = vi.fn();
const mockApiRequest = vi.fn();
const mockTrackEvent = vi.fn();

const mockSocialPosts: SocialPost[] = [
  {
    id: '1',
    tenantId: 'tenant-1',
    userId: 'user-1',
    content: 'Winter HVAC maintenance tips for homeowners',
    platform: 'facebook',
    status: 'published',
    scheduledFor: new Date('2024-01-15'),
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: '2',
    tenantId: 'tenant-1',
    userId: 'user-1',
    content: 'Check your furnace filters regularly for optimal performance',
    platform: 'instagram',
    status: 'scheduled',
    scheduledFor: new Date('2024-01-20'),
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
  },
  {
    id: '3',
    tenantId: 'tenant-1',
    userId: 'user-1',
    content: 'Emergency heating repair available 24/7 in the metro area',
    platform: 'twitter',
    status: 'draft',
    scheduledFor: null,
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
  },
];

const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
};

const renderWithProviders = (component: React.ReactElement) => {
  const testQueryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={testQueryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('SocialScheduler Component', () => {
  beforeEach(() => {
    vi.mocked(useToast).mockReturnValue({ toast: mockToast });
    vi.mocked(queryClient.apiRequest).mockImplementation(mockApiRequest);
    vi.mocked(analytics.trackEvent).mockImplementation(mockTrackEvent);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render the social scheduler component with correct structure', () => {
      renderWithProviders(<SocialScheduler />);
      
      expect(screen.getByRole('heading', { name: /social scheduler/i })).toBeInTheDocument();
      expect(screen.getByTestId('calendar-icon')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create post/i })).toBeInTheDocument();
    });

    it('should display loading state correctly', () => {
      // Mock useQuery to return loading state
      const mockQueryClient = createTestQueryClient();
      mockQueryClient.setQueryData(['/api/social/posts'], undefined);
      
      render(
        <QueryClientProvider client={mockQueryClient}>
          <SocialScheduler />
        </QueryClientProvider>
      );

      expect(screen.getByText(/social scheduler/i)).toBeInTheDocument();
      // Loading skeletons should be present
      expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
    });

    it('should display empty state when no posts exist', async () => {
      const mockQueryClient = createTestQueryClient();
      mockQueryClient.setQueryData(['/api/social/posts'], []);
      
      render(
        <QueryClientProvider client={mockQueryClient}>
          <SocialScheduler />
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/no social posts yet/i)).toBeInTheDocument();
        expect(screen.getByText(/create your first social media post/i)).toBeInTheDocument();
      });
    });

    it('should display posts when data is available', async () => {
      const mockQueryClient = createTestQueryClient();
      mockQueryClient.setQueryData(['/api/social/posts'], mockSocialPosts);
      
      render(
        <QueryClientProvider client={mockQueryClient}>
          <SocialScheduler />
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/winter hvac maintenance tips/i)).toBeInTheDocument();
        expect(screen.getByText(/check your furnace filters/i)).toBeInTheDocument();
      });
    });
  });

  describe('Platform Icons and Colors', () => {
    it('should display correct platform icons for each post', async () => {
      const mockQueryClient = createTestQueryClient();
      mockQueryClient.setQueryData(['/api/social/posts'], mockSocialPosts);
      
      render(
        <QueryClientProvider client={mockQueryClient}>
          <SocialScheduler />
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('facebook-icon')).toBeInTheDocument();
        expect(screen.getByTestId('instagram-icon')).toBeInTheDocument();
        expect(screen.getByTestId('twitter-icon')).toBeInTheDocument();
      });
    });

    it('should apply correct status badges', async () => {
      const mockQueryClient = createTestQueryClient();
      mockQueryClient.setQueryData(['/api/social/posts'], mockSocialPosts);
      
      render(
        <QueryClientProvider client={mockQueryClient}>
          <SocialScheduler />
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('published')).toBeInTheDocument();
        expect(screen.getByText('scheduled')).toBeInTheDocument();
        expect(screen.getByText('draft')).toBeInTheDocument();
      });
    });
  });

  describe('Dialog Functionality', () => {
    it('should open dialog when create post button is clicked', async () => {
      const user = userEvent.setup();
      renderWithProviders(<SocialScheduler />);
      
      const createButton = screen.getByRole('button', { name: /create post/i });
      await user.click(createButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /generate social media post/i })).toBeInTheDocument();
      });
    });

    it('should have form fields in dialog', async () => {
      const user = userEvent.setup();
      renderWithProviders(<SocialScheduler />);
      
      await user.click(screen.getByRole('button', { name: /create post/i }));

      await waitFor(() => {
        expect(screen.getByLabelText(/post topic/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/platform/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /generate post/i })).toBeInTheDocument();
      });
    });
  });

  describe('Form Validation', () => {
    it('should show validation error when topic is empty', async () => {
      const user = userEvent.setup();
      renderWithProviders(<SocialScheduler />);
      
      await user.click(screen.getByRole('button', { name: /create post/i }));

      const generateButton = screen.getByRole('button', { name: /generate post/i });
      await user.click(generateButton);

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Missing Information',
        description: 'Please enter a topic and select a platform.',
        variant: 'destructive',
      });
    });

    it('should show validation error when platform is not selected', async () => {
      const user = userEvent.setup();
      renderWithProviders(<SocialScheduler />);
      
      await user.click(screen.getByRole('button', { name: /create post/i }));
      
      const topicInput = screen.getByLabelText(/post topic/i);
      await user.type(topicInput, 'Test topic');
      
      const generateButton = screen.getByRole('button', { name: /generate post/i });
      await user.click(generateButton);

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Missing Information',
        description: 'Please enter a topic and select a platform.',
        variant: 'destructive',
      });
    });
  });

  describe('Post Generation', () => {
    it('should call API to generate post with correct data', async () => {
      const user = userEvent.setup();
      
      mockApiRequest.mockResolvedValueOnce({
        json: () => Promise.resolve({ success: true, postId: 'new-post-1' })
      });

      renderWithProviders(<SocialScheduler />);
      
      await user.click(screen.getByRole('button', { name: /create post/i }));
      
      const topicInput = screen.getByLabelText(/post topic/i);
      await user.type(topicInput, 'HVAC maintenance tips');
      
      // Select platform
      const platformSelect = screen.getByRole('combobox');
      await user.click(platformSelect);
      await user.click(screen.getByRole('option', { name: /facebook/i }));
      
      const generateButton = screen.getByRole('button', { name: /generate post/i });
      await user.click(generateButton);

      await waitFor(() => {
        expect(mockApiRequest).toHaveBeenCalledWith(
          'POST',
          '/api/social/generate-post',
          {
            topic: 'HVAC maintenance tips',
            platform: 'facebook'
          }
        );
      });
    });

    it('should show success toast and track event on successful generation', async () => {
      const user = userEvent.setup();
      
      mockApiRequest.mockResolvedValueOnce({
        json: () => Promise.resolve({ success: true })
      });

      renderWithProviders(<SocialScheduler />);
      
      await user.click(screen.getByRole('button', { name: /create post/i }));
      
      await user.type(screen.getByLabelText(/post topic/i), 'Test topic');
      
      const platformSelect = screen.getByRole('combobox');
      await user.click(platformSelect);
      await user.click(screen.getByRole('option', { name: /instagram/i }));
      
      await user.click(screen.getByRole('button', { name: /generate post/i }));

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Social Post Generated',
          description: 'Your social media post has been created and scheduled.',
        });
        
        expect(mockTrackEvent).toHaveBeenCalledWith(
          'social_post_generated',
          'content',
          'ai_generation'
        );
      });
    });

    it('should handle API errors gracefully', async () => {
      const user = userEvent.setup();
      
      mockApiRequest.mockRejectedValueOnce(new Error('Network error'));

      renderWithProviders(<SocialScheduler />);
      
      await user.click(screen.getByRole('button', { name: /create post/i }));
      
      await user.type(screen.getByLabelText(/post topic/i), 'Test topic');
      
      const platformSelect = screen.getByRole('combobox');
      await user.click(platformSelect);
      await user.click(screen.getByRole('option', { name: /twitter/i }));
      
      await user.click(screen.getByRole('button', { name: /generate post/i }));

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Generation Failed',
          description: 'Failed to generate social post. Please try again.',
          variant: 'destructive',
        });
      });
    });
  });

  describe('Content Truncation', () => {
    it('should truncate long content in post display', async () => {
      const longContentPost: SocialPost = {
        ...mockSocialPosts[0],
        content: 'This is a very long social media post content that should be truncated when displayed in the component because it exceeds the 50 character limit'
      };

      const mockQueryClient = createTestQueryClient();
      mockQueryClient.setQueryData(['/api/social/posts'], [longContentPost]);
      
      render(
        <QueryClientProvider client={mockQueryClient}>
          <SocialScheduler />
        </QueryClientProvider>
      );

      await waitFor(() => {
        const truncatedText = screen.getByText(/this is a very long social media post content th\.\.\./i);
        expect(truncatedText).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', () => {
      renderWithProviders(<SocialScheduler />);
      
      expect(screen.getByRole('heading', { name: /social scheduler/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create post/i })).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      renderWithProviders(<SocialScheduler />);
      
      const createButton = screen.getByRole('button', { name: /create post/i });
      
      await user.tab();
      expect(createButton).toHaveFocus();
      
      await user.keyboard('{Enter}');
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('should have semantic HTML structure', () => {
      renderWithProviders(<SocialScheduler />);
      
      const main = screen.getByRole('heading', { name: /social scheduler/i }).closest('[role="region"]');
      expect(main).toBeInTheDocument();
    });
  });

  describe('Performance Considerations', () => {
    it('should limit displayed posts to 3 items', async () => {
      const manyPosts = Array.from({ length: 10 }, (_, index) => ({
        ...mockSocialPosts[0],
        id: `post-${index}`,
        content: `Post content ${index}`,
      }));

      const mockQueryClient = createTestQueryClient();
      mockQueryClient.setQueryData(['/api/social/posts'], manyPosts);
      
      render(
        <QueryClientProvider client={mockQueryClient}>
          <SocialScheduler />
        </QueryClientProvider>
      );

      await waitFor(() => {
        const displayedPosts = screen.getAllByText(/post content/i);
        expect(displayedPosts).toHaveLength(3);
      });
    });

    it('should not render all posts at once for performance', async () => {
      const manyPosts = Array.from({ length: 100 }, (_, index) => ({
        ...mockSocialPosts[0],
        id: `post-${index}`,
        content: `Post content ${index}`,
      }));

      const mockQueryClient = createTestQueryClient();
      mockQueryClient.setQueryData(['/api/social/posts'], manyPosts);
      
      render(
        <QueryClientProvider client={mockQueryClient}>
          <SocialScheduler />
        </QueryClientProvider>
      );

      await waitFor(() => {
        // Should only render first 3 posts
        const displayedPosts = screen.getAllByText(/post content/i);
        expect(displayedPosts).toHaveLength(3);
        expect(screen.queryByText(/post content 99/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle posts without scheduled dates', async () => {
      const postWithoutSchedule: SocialPost = {
        ...mockSocialPosts[0],
        scheduledFor: null,
      };

      const mockQueryClient = createTestQueryClient();
      mockQueryClient.setQueryData(['/api/social/posts'], [postWithoutSchedule]);
      
      render(
        <QueryClientProvider client={mockQueryClient}>
          <SocialScheduler />
        </QueryClientProvider>
      );

      await waitFor(() => {
        // Should fall back to createdAt date
        expect(screen.getByText('1/10/2024')).toBeInTheDocument();
      });
    });

    it('should handle unknown platform gracefully', async () => {
      const unknownPlatformPost: SocialPost = {
        ...mockSocialPosts[0],
        platform: 'unknown' as any,
      };

      const mockQueryClient = createTestQueryClient();
      mockQueryClient.setQueryData(['/api/social/posts'], [unknownPlatformPost]);
      
      render(
        <QueryClientProvider client={mockQueryClient}>
          <SocialScheduler />
        </QueryClientProvider>
      );

      await waitFor(() => {
        // Should default to Facebook icon
        expect(screen.getByTestId('facebook-icon')).toBeInTheDocument();
      });
    });

    it('should handle empty content gracefully', async () => {
      const emptyContentPost: SocialPost = {
        ...mockSocialPosts[0],
        content: '',
      };

      const mockQueryClient = createTestQueryClient();
      mockQueryClient.setQueryData(['/api/social/posts'], [emptyContentPost]);
      
      render(
        <QueryClientProvider client={mockQueryClient}>
          <SocialScheduler />
        </QueryClientProvider>
      );

      await waitFor(() => {
        // Component should render without crashing
        expect(screen.getByRole('heading', { name: /social scheduler/i })).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('should show generating state during post creation', async () => {
      const user = userEvent.setup();
      
      // Mock a delayed API response
      mockApiRequest.mockImplementation(() => new Promise(() => {})); // Never resolves

      renderWithProviders(<SocialScheduler />);
      
      await user.click(screen.getByRole('button', { name: /create post/i }));
      
      await user.type(screen.getByLabelText(/post topic/i), 'Test topic');
      
      const platformSelect = screen.getByRole('combobox');
      await user.click(platformSelect);
      await user.click(screen.getByRole('option', { name: /facebook/i }));
      
      const generateButton = screen.getByRole('button', { name: /generate post/i });
      await user.click(generateButton);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /generating\.\.\./i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /generating\.\.\./i })).toBeDisabled();
      });
    });
  });
});