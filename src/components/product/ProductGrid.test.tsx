import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProductGrid } from './ProductGrid';
import { Product } from '@/types';
import * as fc from 'fast-check';

// Helper to wrap component with router
const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

// Arbitrary for generating random products
const productArbitrary = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
  price: fc.float({
    min: Math.fround(0.01),
    max: Math.fround(10000),
    noDefaultInfinity: true,
    noNaN: true,
  }),
  category: fc.constantFrom('电子产品', '服装', '食品', '图书', '家居'),
  image: fc.constant('https://via.placeholder.com/400'),
  description: fc.string({ minLength: 10, maxLength: 200 }),
  stock: fc.integer({ min: 0, max: 1000 }),
});

describe('ProductGrid', () => {
  /**
   * Feature: ecommerce-product-pages, Property 1: 商品网格渲染完整性
   * Validates: Requirements 1.1
   */
  it('should render all products in the grid', () => {
    fc.assert(
      fc.property(fc.array(productArbitrary, { minLength: 1, maxLength: 10 }), products => {
        const { container, unmount } = renderWithRouter(
          <ProductGrid products={products as Product[]} />
        );

        // Check that the grid container exists
        const grid = container.querySelector('.grid');
        expect(grid).toBeTruthy();

        // Check that the correct number of product cards are rendered
        const productCards = container.querySelectorAll('[class*="cursor-pointer"]');
        expect(productCards.length).toBe(products.length);

        // Clean up after each render
        unmount();

        return true;
      }),
      { numRuns: 50 }
    );
  });

  it('should show loading skeleton when isLoading is true', () => {
    renderWithRouter(<ProductGrid products={[]} isLoading={true} />);

    // Check for skeleton elements
    const skeletons = document.querySelectorAll('[class*="animate-pulse"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should show empty state when products array is empty', () => {
    renderWithRouter(<ProductGrid products={[]} isLoading={false} />);

    expect(screen.getByText('未找到商品')).toBeInTheDocument();
  });

  it('should call onResetFilters when reset button is clicked in empty state', () => {
    const onResetFilters = vi.fn();
    renderWithRouter(
      <ProductGrid products={[]} isLoading={false} onResetFilters={onResetFilters} />
    );

    const resetButton = screen.getByText('重置筛选');
    resetButton.click();

    expect(onResetFilters).toHaveBeenCalled();
  });

  /**
   * Feature: ecommerce-product-pages, Property 8: 空状态显示一致性
   * Validates: Requirements 1.4, 2.5, 11.5
   */
  it('should display empty state component when products array is empty', () => {
    fc.assert(
      fc.property(
        fc.boolean(), // isLoading flag
        isLoading => {
          // Only test when not loading
          if (isLoading) {
            return true;
          }

          const { unmount } = renderWithRouter(<ProductGrid products={[]} isLoading={false} />);

          // Check that empty state is displayed
          const emptyStateTitle = screen.queryAllByText('未找到商品');
          expect(emptyStateTitle.length).toBeGreaterThan(0);

          // Check that the description is present
          const emptyStateDescription = screen.queryAllByText(/没有符合条件的商品/);
          expect(emptyStateDescription.length).toBeGreaterThan(0);

          // Clean up after each render
          unmount();

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
