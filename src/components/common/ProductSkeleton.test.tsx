import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductSkeleton, ProductGridSkeleton } from './ProductSkeleton';

/**
 * Feature: ecommerce-product-pages, Property 28: 加载状态指示器
 * Validates: Requirements 1.2, 5.4, 11.4
 */
describe('ProductSkeleton - Loading State', () => {
  it('Property 28: should display loading skeleton with all required elements', () => {
    render(<ProductSkeleton />);

    // 验证骨架屏元素存在
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should render ProductGridSkeleton with specified count', () => {
    const count = 8;
    render(<ProductGridSkeleton count={count} />);

    // 验证渲染了正确数量的骨架屏
    // ProductGridSkeleton 容器本身有一个 role="status"，所以总数是 count + 1
    const skeletons = document.querySelectorAll('[role="status"]');
    expect(skeletons.length).toBe(count + 1);
  });

  it('should have proper ARIA attributes for accessibility', () => {
    render(<ProductSkeleton />);

    // 验证 ARIA 属性
    const skeleton = screen.getByRole('status');
    expect(skeleton).toHaveAttribute('aria-label', '加载中');
  });

  it('should render grid layout for ProductGridSkeleton', () => {
    const { container } = render(<ProductGridSkeleton count={4} />);

    // 验证网格布局
    const grid = container.querySelector('.grid');
    expect(grid).toBeInTheDocument();
  });
});
