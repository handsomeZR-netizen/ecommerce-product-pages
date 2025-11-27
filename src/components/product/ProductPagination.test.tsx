import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductPagination } from './ProductPagination';
import { PaginationState } from '@/types';
import * as fc from 'fast-check';

describe('ProductPagination', () => {
  /**
   * Feature: ecommerce-product-pages, Property 11: 分页控件显示条件
   * Validates: Requirements 4.1
   */
  it('should hide pagination controls when products fit in one page', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 12 }), // totalProducts <= pageSize
        fc.integer({ min: 12, max: 50 }), // pageSize
        (totalProducts, pageSize) => {
          // Only test when totalProducts <= pageSize
          if (totalProducts > pageSize) {
            return true;
          }

          const pagination: PaginationState = {
            currentPage: 1,
            pageSize: pageSize,
            totalItems: totalProducts,
          };

          const { container } = render(
            <ProductPagination
              pagination={pagination}
              totalProducts={totalProducts}
              onPageChange={vi.fn()}
            />
          );

          // Pagination should not be rendered (returns null)
          expect(container.firstChild).toBeNull();

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should show pagination controls when products exceed one page', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 13, max: 100 }), // totalProducts > pageSize
        fc.integer({ min: 1, max: 12 }), // pageSize
        (totalProducts, pageSize) => {
          // Only test when totalProducts > pageSize
          if (totalProducts <= pageSize) {
            return true;
          }

          const pagination: PaginationState = {
            currentPage: 1,
            pageSize: pageSize,
            totalItems: totalProducts,
          };

          const { container } = render(
            <ProductPagination
              pagination={pagination}
              totalProducts={totalProducts}
              onPageChange={vi.fn()}
            />
          );

          // Pagination should be rendered
          expect(container.firstChild).not.toBeNull();

          // Should have previous and next buttons
          const buttons = container.querySelectorAll('button');
          expect(buttons.length).toBeGreaterThan(0);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should render correct page numbers', () => {
    const pagination: PaginationState = {
      currentPage: 1,
      pageSize: 12,
      totalItems: 50,
    };

    render(<ProductPagination pagination={pagination} totalProducts={50} onPageChange={vi.fn()} />);

    // Should show page 1 button
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should disable previous button on first page', () => {
    const pagination: PaginationState = {
      currentPage: 1,
      pageSize: 12,
      totalItems: 50,
    };

    render(<ProductPagination pagination={pagination} totalProducts={50} onPageChange={vi.fn()} />);

    const prevButton = screen.getByLabelText('上一页');
    expect(prevButton).toBeDisabled();
  });

  it('should disable next button on last page', () => {
    const pagination: PaginationState = {
      currentPage: 5,
      pageSize: 12,
      totalItems: 50,
    };

    render(<ProductPagination pagination={pagination} totalProducts={50} onPageChange={vi.fn()} />);

    const nextButton = screen.getByLabelText('下一页');
    expect(nextButton).toBeDisabled();
  });
});
