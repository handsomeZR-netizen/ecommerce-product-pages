import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '../button';
import { Card, CardContent } from '../card';
import { Skeleton } from '../skeleton';
import { Toaster } from '../sonner';

describe('shadcn/ui Components', () => {
  it('should render Button component', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('should render Card component', () => {
    render(
      <Card>
        <CardContent>Card content</CardContent>
      </Card>
    );
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('should render Skeleton component', () => {
    const { container } = render(<Skeleton className="test-skeleton" />);
    const skeleton = container.querySelector('.test-skeleton');
    expect(skeleton).toBeInTheDocument();
  });

  it('should render Toaster component without errors', () => {
    // Toaster component renders a portal, so we just verify it doesn't throw
    expect(() => render(<Toaster />)).not.toThrow();
  });
});
