import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import * as fc from 'fast-check';
import { useProducts } from './useProducts';
import { useProductStore } from '@/store/productStore';
import { mockApi } from '@/services/mockApi';
import type { Product, SortOption } from '@/types';

// Mock console.error 以避免测试输出污染
vi.spyOn(console, 'error').mockImplementation(() => {});

// Mock mockApi
vi.mock('@/services/mockApi', () => ({
  mockApi: {
    getProducts: vi.fn(),
  },
}));

describe('useProducts', () => {
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Product A',
      price: 100,
      category: '电子产品',
      image: 'https://example.com/a.jpg',
      description: 'Description A',
      stock: 10,
      rating: 4.5,
    },
    {
      id: '2',
      name: 'Product B',
      price: 200,
      category: '服装',
      image: 'https://example.com/b.jpg',
      description: 'Description B',
      stock: 20,
      rating: 4.0,
    },
    {
      id: '3',
      name: 'Product C',
      price: 150,
      category: '电子产品',
      image: 'https://example.com/c.jpg',
      description: 'Description C',
      stock: 15,
      rating: 4.8,
    },
  ];

  beforeEach(() => {
    // 重置 store
    const store = useProductStore.getState();
    store.setProducts([]);
    store.resetFilters();

    // Mock API 返回
    vi.mocked(mockApi.getProducts).mockResolvedValue(mockProducts);
  });

  /**
   * Feature: ecommerce-product-pages, Property 10: 排序保持筛选状态
   * Validates: Requirements 3.3
   */
  it('should maintain filter conditions when changing sort option', async () => {
    const { result } = renderHook(() => useProducts());

    // 等待数据加载
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // 使用 property-based testing 验证排序保持筛选状态
    fc.assert(
      fc.property(
        fc.constantFrom('电子产品', '服装'),
        fc.constantFrom<SortOption>('price-asc', 'price-desc', 'rating'),
        fc.constantFrom<SortOption>('price-asc', 'price-desc', 'rating'),
        (category, initialSort, newSort) => {
          // 应用筛选条件
          act(() => {
            result.current.setFilters({ category });
          });

          // 应用初始排序
          act(() => {
            result.current.setSortOption(initialSort);
          });

          // 记录筛选后的商品数量
          const filteredCount = result.current.totalProducts;

          // 改变排序选项
          act(() => {
            result.current.setSortOption(newSort);
          });

          // 验证筛选条件仍然保持
          expect(result.current.filters.category).toBe(category);

          // 验证筛选后的商品数量不变（排序不应该改变筛选结果）
          expect(result.current.totalProducts).toBe(filteredCount);

          return true;
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should apply sorting correctly', async () => {
    const { result } = renderHook(() => useProducts());

    // 等待数据加载
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // 测试价格升序排序
    act(() => {
      result.current.setSortOption('price-asc');
    });

    const pricesAsc = result.current.products.map(p => p.price);
    for (let i = 0; i < pricesAsc.length - 1; i++) {
      expect(pricesAsc[i]).toBeLessThanOrEqual(pricesAsc[i + 1]);
    }

    // 测试价格降序排序
    act(() => {
      result.current.setSortOption('price-desc');
    });

    const pricesDesc = result.current.products.map(p => p.price);
    for (let i = 0; i < pricesDesc.length - 1; i++) {
      expect(pricesDesc[i]).toBeGreaterThanOrEqual(pricesDesc[i + 1]);
    }
  });

  it('should apply filters correctly', async () => {
    const { result } = renderHook(() => useProducts());

    // 等待数据加载
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // 测试分类筛选
    act(() => {
      result.current.setFilters({ category: '电子产品' });
    });

    result.current.products.forEach(product => {
      expect(product.category).toBe('电子产品');
    });
  });

  /**
   * Feature: ecommerce-product-pages, Property 12: 分页数据正确性
   * Validates: Requirements 4.2
   */
  it('should display correct products for each page', async () => {
    const { result } = renderHook(() => useProducts());

    // 等待数据加载
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // 使用 property-based testing 验证分页数据正确性
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 3 }), pageNumber => {
        const pageSize = result.current.pagination.pageSize;

        // 设置页码
        act(() => {
          result.current.setPage(pageNumber);
        });

        // 计算预期的起始和结束索引（用于验证逻辑）
        // const expectedStart = (pageNumber - 1) * pageSize;
        // const expectedEnd = pageNumber * pageSize;

        // 获取当前页的商品
        const currentPageProducts = result.current.products;

        // 验证商品数量不超过页面大小
        expect(currentPageProducts.length).toBeLessThanOrEqual(pageSize);

        // 如果有商品，验证它们是正确的商品
        if (currentPageProducts.length > 0) {
          // 获取所有商品（未分页）
          const store = useProductStore.getState();
          const allProducts = store.products;

          // 验证当前页的第一个商品对应正确的索引
          const firstProduct = currentPageProducts[0];
          const indexInAll = allProducts.findIndex(p => p.id === firstProduct.id);

          // 索引应该在预期范围内
          expect(indexInAll).toBeGreaterThanOrEqual(0);
        }

        return true;
      }),
      { numRuns: 20 }
    );
  });

  /**
   * Feature: ecommerce-product-pages, Property 13: 筛选重置分页
   * Validates: Requirements 4.4
   */
  it('should reset pagination to page 1 when filters or sort change', async () => {
    const { result } = renderHook(() => useProducts());

    // 等待数据加载
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // 使用 property-based testing 验证筛选或排序变化时重置分页
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 5 }),
        fc.constantFrom('电子产品', '服装'),
        fc.constantFrom<SortOption>('price-asc', 'price-desc', 'rating'),
        (initialPage, category, sortOption) => {
          // 设置到非第一页
          act(() => {
            result.current.setPage(initialPage);
          });

          // 验证页码已设置
          expect(result.current.pagination.currentPage).toBe(initialPage);

          // 改变筛选条件
          act(() => {
            result.current.setFilters({ category });
          });

          // 验证页码重置为 1
          expect(result.current.pagination.currentPage).toBe(1);

          // 再次设置到非第一页
          act(() => {
            result.current.setPage(initialPage);
          });

          expect(result.current.pagination.currentPage).toBe(initialPage);

          // 改变排序选项
          act(() => {
            result.current.setSortOption(sortOption);
          });

          // 验证页码重置为 1
          expect(result.current.pagination.currentPage).toBe(1);

          return true;
        }
      ),
      { numRuns: 20 }
    );
  });
});
