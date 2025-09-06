import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen, userEvent } from '@tests/utils/test-utils';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('should render with default props', () => {
    renderWithProviders(<Button>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary');
  });

  it('should handle click events', async () => {
    const handleClick = vi.fn();
    const { user } = renderWithProviders(
      <Button onClick={handleClick}>Click me</Button>
    );
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('should be disabled when disabled prop is true', () => {
    renderWithProviders(<Button disabled>Disabled</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:pointer-events-none');
  });

  it('should render different variants', () => {
    const { rerender } = renderWithProviders(<Button variant="secondary">Secondary</Button>);
    
    expect(screen.getByRole('button')).toHaveClass('bg-secondary');
    
    rerender(<Button variant="destructive">Destructive</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-destructive');
    
    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole('button')).toHaveClass('border-input');
  });

  it('should render different sizes', () => {
    const { rerender } = renderWithProviders(<Button size="sm">Small</Button>);
    
    expect(screen.getByRole('button')).toHaveClass('h-9');
    
    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-11');
  });

  it('should forward refs correctly', () => {
    const ref = vi.fn();
    renderWithProviders(<Button ref={ref}>Button</Button>);
    
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
  });

  it('should render as different elements when asChild is true', () => {
    renderWithProviders(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    );
    
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
  });
});
