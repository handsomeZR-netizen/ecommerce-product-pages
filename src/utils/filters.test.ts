import { describe, it } from 'vitest';
import * as fc from 'fast-check';
import { filterByPriceRange, filterByCategory, applyMultipleFilters } from './filters';
import { Product } from '@/types';

// 商品生成器
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

describe('Filter Functions - Property-Based Tests', () => {
  /**
   * Feature: ecommerce-product-pages, Property 4: 价格区间筛选正确性
   * Validates: Requirements 2.1
   */
  it('Property 4: should filter products within price range', () => {
    fc.assert(
      fc.property(
        fc.array(productArbitrary, { minLength: 0, maxLength: 100 }),
        fc.integer({ min: 0, max: 10000 }),
        fc.integer({ min: 0, max: 10000 }),
        (products, min, max) => {
          const [minPrice, maxPrice] = min <= max ? [min, max] : [max, min];
          const filtered = filterByPriceRange(products, [minPrice, maxPrice]);

          // 所有筛选后的商品价格都应该在区间内
          return filtered.every(p => p.price >= minPrice && p.price <= maxPrice);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: ecommerce-product-pages, Property 5: 分类筛选正确性
   * Validates: Requirements 2.2
   */
  it('Property 5: should filter products by category', () => {
    fc.assert(
      fc.property(
        fc.array(productArbitrary, { minLength: 0, maxLength: 100 }),
        fc.constantFrom('电子产品', '服装', '食品', '图书', '家居'),
        (products, category) => {
          const filtered = filterByCategory(products, category);

          // 所有筛选后的商品分类都应该等于选定的分类
          return filtered.every(p => p.category === category);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: ecommerce-product-pages, Property 7: 多条件筛选交集
   * Validates: Requirements 2.4
   */
  it('Property 7: should apply multiple filters with AND logic', () => {
    fc.assert(
      fc.property(
        fc.array(productArbitrary, { minLength: 0, maxLength: 100 }),
        fc.record({
          category: fc.option(fc.constantFrom('电子产品', '服装', '食品', '图书', '家居'), {
            nil: undefined,
          }),
          priceRange: fc.option(
            fc
              .tuple(fc.integer({ min: 0, max: 10000 }), fc.integer({ min: 0, max: 10000 }))
              .map(([a, b]) => (a <= b ? [a, b] : [b, a]) as [number, number]),
            { nil: undefined }
          ),
          keyword: fc.option(fc.string({ minLength: 1, maxLength: 20 }), { nil: undefined }),
        }),
        (products, filters) => {
          const filtered = applyMultipleFilters(products, filters);

          // 验证所有筛选条件都被满足（AND 逻辑）
          return filtered.every(p => {
            // 检查分类筛选
            if (filters.category) {
              if (p.category !== filters.category) return false;
            }

            // 检查价格区间筛选
            if (filters.priceRange) {
              const [min, max] = filters.priceRange;
              if (p.price < min || p.price > max) return false;
            }

            // 检查关键词筛选
            if (filters.keyword) {
              const lowerKeyword = filters.keyword.toLowerCase().trim();
              if (lowerKeyword) {
                const matchesName = p.name.toLowerCase().includes(lowerKeyword);
                const matchesDesc = p.description.toLowerCase().includes(lowerKeyword);
                if (!matchesName && !matchesDesc) return false;
              }
            }

            return true;
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});
