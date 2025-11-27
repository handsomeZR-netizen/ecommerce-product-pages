import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { useCartStore } from './cartStore';
import type { Product, CartItem } from '@/types';

// 商品生成器
const productArbitrary = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 50 }),
  price: fc.float({ min: Math.fround(0.01), max: Math.fround(10000), noNaN: true }),
  category: fc.constantFrom('电子产品', '服装', '食品', '图书', '家居'),
  image: fc.webUrl(),
  description: fc.lorem(),
  stock: fc.integer({ min: 0, max: 1000 }),
  rating: fc.option(fc.float({ min: Math.fround(0), max: Math.fround(5), noNaN: true }), {
    nil: undefined,
  }),
  reviews: fc.option(fc.integer({ min: 0, max: 1000 }), { nil: undefined }),
  originalPrice: fc.option(
    fc.float({ min: Math.fround(0.01), max: Math.fround(10000), noNaN: true }),
    { nil: undefined }
  ),
  images: fc.option(fc.array(fc.webUrl(), { minLength: 1, maxLength: 5 }), { nil: undefined }),
  specifications: fc.option(fc.dictionary(fc.string(), fc.string()), { nil: undefined }),
});

describe('CartStore Property Tests', () => {
  beforeEach(() => {
    // 清空购物车和 localStorage
    const store = useCartStore.getState();
    store.clearCart();
    localStorage.clear();
  });

  /**
   * Feature: ecommerce-product-pages, Property 19: 重复添加商品合并
   * Validates: Requirements 6.4
   */
  it('Property 19: should merge duplicate products by incrementing quantity', () => {
    fc.assert(
      fc.property(
        productArbitrary,
        fc.integer({ min: 1, max: 10 }),
        (product: Product, addCount: number) => {
          // 在每次属性测试运行前清空购物车和 localStorage
          localStorage.clear();
          useCartStore.getState().clearCart();

          // 多次添加同一商品
          for (let i = 0; i < addCount; i++) {
            useCartStore.getState().addItem(product);
          }

          // 获取最新的 store 状态
          const items = useCartStore.getState().items;

          // 验证：购物车中应该只有一个该商品的条目
          const productItems = items.filter(item => item.product.id === product.id);
          expect(productItems.length).toBe(1);

          // 验证：数量应该等于添加次数
          if (productItems.length > 0) {
            expect(productItems[0].quantity).toBe(addCount);
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: ecommerce-product-pages, Property 20: 购物车持久化往返
   * Validates: Requirements 6.5
   */
  it('Property 20: should persist and restore cart state correctly', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            product: productArbitrary,
            quantity: fc.integer({ min: 1, max: 99 }),
          }),
          { minLength: 0, maxLength: 10 }
        ),
        cartItems => {
          // 清空并设置初始状态
          localStorage.clear();
          useCartStore.getState().clearCart();

          // 添加所有商品到购物车
          for (const item of cartItems) {
            useCartStore.getState().addItem(item.product);
            // 更新数量到指定值
            if (item.quantity > 1) {
              useCartStore.getState().updateQuantity(item.product.id, item.quantity);
            }
          }

          // 获取当前购物车状态
          const originalItems = useCartStore.getState().items;

          // 验证 localStorage 中已保存数据
          const storedData = localStorage.getItem('cart-storage');
          expect(storedData).not.toBeNull();

          if (storedData) {
            const parsed = JSON.parse(storedData);

            // 验证：localStorage 中的数据应该包含 state 字段
            expect(parsed.state).toBeDefined();
            expect(parsed.state.items).toBeDefined();

            // 验证：恢复的数据应该与原始数据匹配
            const restoredItems = parsed.state.items;
            expect(restoredItems.length).toBe(originalItems.length);

            // 验证每个商品的 ID 和数量
            for (let i = 0; i < originalItems.length; i++) {
              const original = originalItems[i];
              const restored = restoredItems.find(
                (item: CartItem) => item.product.id === original.product.id
              );

              expect(restored).toBeDefined();
              if (restored) {
                expect(restored.quantity).toBe(original.quantity);
                expect(restored.product.id).toBe(original.product.id);
                expect(restored.product.price).toBe(original.product.price);
              }
            }
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: ecommerce-product-pages, Property 24: 总价派生计算
   * Validates: Requirements 7.5
   */
  it('Property 24: should calculate total price from items correctly', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            product: productArbitrary,
            quantity: fc.integer({ min: 1, max: 99 }),
          }),
          { minLength: 0, maxLength: 10 }
        ),
        cartItems => {
          // 清空并设置初始状态
          localStorage.clear();
          useCartStore.getState().clearCart();

          // 添加所有商品到购物车
          for (const item of cartItems) {
            useCartStore.getState().addItem(item.product);
            // 更新数量到指定值
            if (item.quantity > 1) {
              useCartStore.getState().updateQuantity(item.product.id, item.quantity);
            }
          }

          // 手动计算预期总价
          const items = useCartStore.getState().items;
          const expectedTotal = items.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
          );

          // 从 store 获取计算的总价
          const storeTotal = useCartStore.getState().getTotalPrice();

          // 验证：总价应该等于所有商品的（单价 × 数量）之和
          // 使用小的误差范围来处理浮点数精度问题
          const difference = Math.abs(expectedTotal - storeTotal);
          expect(difference).toBeLessThan(0.01);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
