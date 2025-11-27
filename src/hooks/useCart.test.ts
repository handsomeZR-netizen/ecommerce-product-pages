import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import * as fc from 'fast-check';
import { useCart } from './useCart';
import { useCartStore } from '@/store/cartStore';
import type { Product } from '@/types';

// Mock console.log 和 console.error 以避免测试输出污染
vi.spyOn(console, 'log').mockImplementation(() => {});
vi.spyOn(console, 'error').mockImplementation(() => {});

describe('useCart', () => {
  beforeEach(() => {
    // 在每个测试前清空购物车
    const { clearCart } = useCartStore.getState();
    clearCart();
  });

  /**
   * Feature: ecommerce-product-pages, Property 16: 添加商品到购物车
   * Validates: Requirements 6.1
   */
  it('should add product to cart with quantity 1 on first add', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.uuid(),
          name: fc.string({ minLength: 1, maxLength: 50 }),
          price: fc.float({ min: Math.fround(0.01), max: Math.fround(10000), noNaN: true }),
          category: fc.constantFrom('电子产品', '服装', '食品', '图书', '家居'),
          image: fc.webUrl(),
          description: fc.lorem(),
          stock: fc.integer({ min: 0, max: 1000 }),
        }),
        (product: Product) => {
          // 清空购物车
          const { clearCart } = useCartStore.getState();
          clearCart();

          const { result } = renderHook(() => useCart());

          // 初始购物车应该为空
          expect(result.current.items.length).toBe(0);

          // 添加商品
          act(() => {
            result.current.addToCart(product);
          });

          // 验证商品已添加且数量为 1
          expect(result.current.items.length).toBe(1);
          expect(result.current.items[0].product.id).toBe(product.id);
          expect(result.current.items[0].quantity).toBe(1);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should increment quantity when adding same product multiple times', () => {
    const product: Product = {
      id: 'test-id',
      name: 'Test Product',
      price: 100,
      category: '电子产品',
      image: 'https://example.com/image.jpg',
      description: 'Test description',
      stock: 10,
    };

    const { result } = renderHook(() => useCart());

    // 添加商品三次
    act(() => {
      result.current.addToCart(product);
      result.current.addToCart(product);
      result.current.addToCart(product);
    });

    // 应该只有一个商品项，但数量为 3
    expect(result.current.items.length).toBe(1);
    expect(result.current.items[0].quantity).toBe(3);
  });

  it('should remove product from cart', () => {
    const product: Product = {
      id: 'test-id',
      name: 'Test Product',
      price: 100,
      category: '电子产品',
      image: 'https://example.com/image.jpg',
      description: 'Test description',
      stock: 10,
    };

    const { result } = renderHook(() => useCart());

    // 添加商品
    act(() => {
      result.current.addToCart(product);
    });

    expect(result.current.items.length).toBe(1);

    // 移除商品
    act(() => {
      result.current.removeFromCart(product.id);
    });

    expect(result.current.items.length).toBe(0);
  });

  it('should update product quantity', () => {
    const product: Product = {
      id: 'test-id',
      name: 'Test Product',
      price: 100,
      category: '电子产品',
      image: 'https://example.com/image.jpg',
      description: 'Test description',
      stock: 10,
    };

    const { result } = renderHook(() => useCart());

    // 添加商品
    act(() => {
      result.current.addToCart(product);
    });

    expect(result.current.items[0].quantity).toBe(1);

    // 更新数量
    act(() => {
      result.current.updateQuantity(product.id, 5);
    });

    expect(result.current.items[0].quantity).toBe(5);
  });

  it('should remove product when quantity is set to 0 or negative', () => {
    const product: Product = {
      id: 'test-id',
      name: 'Test Product',
      price: 100,
      category: '电子产品',
      image: 'https://example.com/image.jpg',
      description: 'Test description',
      stock: 10,
    };

    const { result } = renderHook(() => useCart());

    // 添加商品
    act(() => {
      result.current.addToCart(product);
    });

    expect(result.current.items.length).toBe(1);

    // 设置数量为 0
    act(() => {
      result.current.updateQuantity(product.id, 0);
    });

    expect(result.current.items.length).toBe(0);
  });

  it('should calculate total price correctly', () => {
    const product1: Product = {
      id: 'test-id-1',
      name: 'Product 1',
      price: 100,
      category: '电子产品',
      image: 'https://example.com/image.jpg',
      description: 'Test description',
      stock: 10,
    };

    const product2: Product = {
      id: 'test-id-2',
      name: 'Product 2',
      price: 50,
      category: '服装',
      image: 'https://example.com/image.jpg',
      description: 'Test description',
      stock: 10,
    };

    const { result } = renderHook(() => useCart());

    // 添加商品
    act(() => {
      result.current.addToCart(product1);
      result.current.addToCart(product1);
      result.current.addToCart(product2);
    });

    // 总价应该是 100 * 2 + 50 * 1 = 250
    expect(result.current.totalPrice).toBe(250);
  });

  it('should calculate total items correctly', () => {
    const product1: Product = {
      id: 'test-id-1',
      name: 'Product 1',
      price: 100,
      category: '电子产品',
      image: 'https://example.com/image.jpg',
      description: 'Test description',
      stock: 10,
    };

    const product2: Product = {
      id: 'test-id-2',
      name: 'Product 2',
      price: 50,
      category: '服装',
      image: 'https://example.com/image.jpg',
      description: 'Test description',
      stock: 10,
    };

    const { result } = renderHook(() => useCart());

    // 添加商品
    act(() => {
      result.current.addToCart(product1);
      result.current.addToCart(product1);
      result.current.addToCart(product2);
    });

    // 总数量应该是 2 + 1 = 3
    expect(result.current.totalItems).toBe(3);
  });

  /**
   * Feature: ecommerce-product-pages, Property 18: 购物车徽章同步
   * Validates: Requirements 6.3
   */
  it('should synchronize cart badge with total items count', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.uuid(),
            name: fc.string({ minLength: 1, maxLength: 50 }),
            price: fc.float({ min: Math.fround(0.01), max: Math.fround(10000), noNaN: true }),
            category: fc.constantFrom('电子产品', '服装', '食品', '图书', '家居'),
            image: fc.webUrl(),
            description: fc.lorem(),
            stock: fc.integer({ min: 0, max: 1000 }),
          }),
          { minLength: 1, maxLength: 10 }
        ),
        fc.array(fc.integer({ min: 1, max: 5 }), { minLength: 1, maxLength: 10 }),
        (products: Product[], quantities: number[]) => {
          // 清空购物车
          const { clearCart } = useCartStore.getState();
          clearCart();

          const { result } = renderHook(() => useCart());

          // 添加商品到购物车
          act(() => {
            products.forEach((product, index) => {
              const quantity = quantities[index % quantities.length];
              for (let i = 0; i < quantity; i++) {
                result.current.addToCart(product);
              }
            });
          });

          // 计算预期的总数量
          const expectedTotal = products.reduce((sum, _product, index) => {
            const quantity = quantities[index % quantities.length];
            return sum + quantity;
          }, 0);

          // 验证 totalItems 等于所有商品数量之和
          expect(result.current.totalItems).toBe(expectedTotal);

          // 验证 totalItems 等于手动计算的总和
          const manualTotal = result.current.items.reduce((sum, item) => sum + item.quantity, 0);
          expect(result.current.totalItems).toBe(manualTotal);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
