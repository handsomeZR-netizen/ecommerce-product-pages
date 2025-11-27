import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from './Header';
import { useCartStore } from '@/store/cartStore';

// Wrapper component for Router
const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Header', () => {
  beforeEach(() => {
    // Clear cart before each test
    useCartStore.getState().clearCart();
  });

  it('should display cart badge with correct count', () => {
    // Add items to cart
    const mockProduct = {
      id: '1',
      name: 'Test Product',
      price: 100,
      category: '电子产品',
      image: 'test.jpg',
      description: 'Test',
      stock: 10,
    };

    useCartStore.getState().addItem(mockProduct);
    useCartStore.getState().addItem(mockProduct);

    render(<Header />, { wrapper: Wrapper });

    // Check if badge shows correct count
    const badge = screen.getByText('2');
    expect(badge).toBeInTheDocument();
  });

  it('should not display badge when cart is empty', () => {
    render(<Header />, { wrapper: Wrapper });

    // Badge should not be visible
    const badge = screen.queryByText('0');
    expect(badge).not.toBeInTheDocument();
  });

  it('should render logo link', () => {
    render(<Header />, { wrapper: Wrapper });

    const logo = screen.getByText('电商平台');
    expect(logo).toBeInTheDocument();
    expect(logo.closest('a')).toHaveAttribute('href', '/');
  });

  it('should render shopping cart icon', () => {
    render(<Header />, { wrapper: Wrapper });

    const cartButton = screen.getByRole('button');
    expect(cartButton).toBeInTheDocument();

    // Check if SVG icon is present
    const svg = cartButton.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
