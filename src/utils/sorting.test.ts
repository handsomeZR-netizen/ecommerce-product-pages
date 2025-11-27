import { describe, it } from 'vitest';
import * as fc from 'fast-check';
import { sortProducts } from './sorting';
import { Product, SortOption } from '@/types';

// 商品生成器（与 filters.test.ts 中相同）
const productArbitrary = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 50 }),
  price: fc.float({
    min: Math.fround(0.01),
    max: Math.fround(10000),
    noNaN: true,
    noDefaultInfinity: true,
  }),
  category: fc.constantFrom('电子产品', '服装', '食品', '图书', '家居'),
  image: fc.webUrl(),
  description: fc.lorem({ maxCount: 1 }),
  stock: fc.integer({ min: 0, max: 1000 }),
  rating: fc.option(
    fc.float({ min: Math.fround(0), max: Math.fround(5), noNaN: true, noDefaultInfinity: true }),
    { nil: undefined }
  ),
  reviews: fc.option(fc.integer({ min: 0, max: 1000 }), { nil: undefined }),
}) as fc.Arbitrary<Product>;

describe('Sorting Functions - Property-Based Tests', () => {
  /**
   * Feature: ecommerce-product-pages, Property 9: 价格排序正确性
   * Validates: Requirements 3.1, 3.2
   */
  it('Property 9: should sort products by price correctly', () => {
    fc.assert(
      fc.property(
        fc.array(productArbitrary, { minLength: 0, maxLength: 100 }),
        fc.constantFrom<SortOption>('price-asc', 'price-desc'),
        (products, sortOption) => {
          const sorted = sortProducts(products, sortOption);

          // 验证排序顺序
          for (let i = 0; i < sorted.length - 1; i++) {
            if (sortOption === 'price-asc') {
              // 价格升序：每个元素应该小于等于下一个元素
              if (sorted[i].price > sorted[i + 1].price) {
                return false;
              }
            } else if (sortOption === 'price-desc') {
              // 价格降序：每个元素应该大于等于下一个元素
              if (sorted[i].price < sorted[i + 1].price) {
                return false;
              }
            }
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should not modify the original array', () => {
    fc.assert(
      fc.property(
        fc.array(productArbitrary, { minLength: 1, maxLength: 50 }),
        fc.constantFrom<SortOption>('price-asc', 'price-desc', 'rating', 'default'),
        (products, sortOption) => {
          const original = [...products];
          sortProducts(products, sortOption);

          // 验证原数组未被修改
          return products.every((p, i) => p.id === original[i].id);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain all products after sorting', () => {
    fc.assert(
      fc.property(
        fc.array(productArbitrary, { minLength: 0, maxLength: 100 }),
        fc.constantFrom<SortOption>('price-asc', 'price-desc', 'rating', 'default'),
        (products, sortOption) => {
          const sorted = sortProducts(products, sortOption);

          // 验证排序后的数组长度相同
          return sorted.length === products.length;
        }
      ),
      { numRuns: 100 }
    );
  });
});
