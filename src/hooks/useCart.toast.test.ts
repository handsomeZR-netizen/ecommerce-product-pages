import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import * as fc from 'fast-check';
import { toast } from 'sonner';
import { useCart } from './useCart';
import { useCartStore } from '@/store/cartStore';
import type { Product } from '@/types';

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useCart - Toast Notifications', () => {
  beforeEach(() => {
    // 在每个测试前清空购物车和 mock 调用
    const { clearCart } = useCartStore.getState();
    clearCart();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Feature: ecommerce-product-pages, Property 17: Toast 通知一致性
   * Validates: Requirements 6.2, 11.2, 11.3
   *
   * 对于任何用户操作（成功或失败），系统应该显示相应的 Toast 通知而不是使用 alert
   */
  it('should display success toast when adding product to cart', () => {
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
          // 清空购物车和 mock
          const { clearCart } = useCartStore.getState();
          clearCart();
          vi.clearAllMocks();

          const { result } = renderHook(() => useCart());

          // 添加商品
          act(() => {
            result.current.addToCart(product);
          });

          // 验证 toast.success 被调用
          expect(toast.success).toHaveBeenCalledTimes(1);

          // 验证 toast 消息包含商品名称
          expect(toast.success).toHaveBeenCalledWith(expect.stringContaining(product.name));

          // 验证 toast 消息包含"已加入购物车"
          expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('已加入购物车'));

          // 验证没有使用 alert（通过确认使用了 toast）
          expect(toast.success).toHaveBeenCalled();

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should display success toast when removing product from cart', () => {
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
          // 清空购物车和 mock
          const { clearCart } = useCartStore.getState();
          clearCart();
          vi.clearAllMocks();

          const { result } = renderHook(() => useCart());

          // 先添加商品
          act(() => {
            result.current.addToCart(product);
          });

          // 清除之前的 mock 调用记录
          vi.clearAllMocks();

          // 移除商品
          act(() => {
            result.current.removeFromCart(product.id);
          });

          // 验证 toast.success 被调用
          expect(toast.success).toHaveBeenCalledTimes(1);

          // 验证 toast 消息包含"已移除"或"商品已移除"
          expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('已移除'));

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should display toast notification for all cart operations', () => {
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

    // 测试添加操作
    act(() => {
      result.current.addToCart(product);
    });
    expect(toast.success).toHaveBeenCalled();

    vi.clearAllMocks();

    // 测试移除操作
    act(() => {
      result.current.removeFromCart(product.id);
    });
    expect(toast.success).toHaveBeenCalled();
  });

  it('should never use window.alert for notifications', () => {
    // Mock window.alert if it exists
    const originalAlert = window.alert;
    const alertSpy = vi.fn();
    window.alert = alertSpy;

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

    // 执行各种操作
    act(() => {
      result.current.addToCart(product);
      result.current.removeFromCart(product.id);
    });

    // 验证从未调用 window.alert
    expect(alertSpy).not.toHaveBeenCalled();

    // 但应该调用了 toast
    expect(toast.success).toHaveBeenCalled();

    // Restore
    window.alert = originalAlert;
  });
});
