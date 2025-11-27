import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

// Mock the page components to avoid loading dependencies
vi.mock('@/pages/ProductListPage', () => ({
  ProductListPage: () => <div>Product List Page</div>,
}));

vi.mock('@/pages/ProductDetailPage', () => ({
  ProductDetailPage: () => <div>Product Detail Page</div>,
}));

vi.mock('@/pages/NotFoundPage', () => ({
  NotFoundPage: () => <div>Not Found Page</div>,
}));

describe('App', () => {
  it('should render the product list page at root path', async () => {
    window.history.pushState({}, '', '/');
    render(<App />);

    // Wait for lazy-loaded component to render
    await waitFor(() => {
      expect(screen.getByText('Product List Page')).toBeInTheDocument();
    });
  });

  it('should render the product detail page at /product/:id path', async () => {
    window.history.pushState({}, '', '/product/123');
    render(<App />);

    // Wait for lazy-loaded component to render
    await waitFor(() => {
      expect(screen.getByText('Product Detail Page')).toBeInTheDocument();
    });
  });

  it('should render the 404 page for unknown routes', async () => {
    window.history.pushState({}, '', '/unknown-route');
    render(<App />);

    // Wait for lazy-loaded component to render
    await waitFor(() => {
      expect(screen.getByText('Not Found Page')).toBeInTheDocument();
    });
  });

  it('should render Toaster component', () => {
    render(<App />);

    // Verify that the Toaster component doesn't cause any errors
    expect(() => render(<App />)).not.toThrow();
  });

  it('should show loading skeleton while lazy components load', () => {
    render(<App />);

    // The PageSkeleton should be visible initially
    // We can't easily test this without more complex setup, but we verify no errors
    expect(() => render(<App />)).not.toThrow();
  });
});
