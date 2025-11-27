import { useCallback } from 'react';
import { toast } from 'sonner';
import { useCartStore } from '@/store/cartStore';
import type { Product } from '@/types';

/**
 * 购物车 Hook
 * 封装所有购物车操作逻辑并提供 Toast 通知反馈
 *
 * @returns 购物车状态和操作方法
 */
export const useCart = () => {
  const store = useCartStore();

  /**
   * 添加商品到购物车
   * 成功时显示 Toast 通知
   */
  const addToCart = useCallback(
    (product: Product) => {
      store.addItem(product);
      toast.success(`${product.name} 已加入购物车`);
    },
    [store]
  );

  /**
   * 从购物车移除商品
   * 成功时显示 Toast 通知
   */
  const removeFromCart = useCallback(
    (productId: string) => {
      store.removeItem(productId);
      toast.success('商品已移除');
    },
    [store]
  );

  /**
   * 更新购物车商品数量
   * 如果数量为 0 或负数，则移除商品
   */
  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId);
      } else {
        store.updateQuantity(productId, quantity);
      }
    },
    [store, removeFromCart]
  );

  return {
    items: store.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart: store.clearCart,
    totalPrice: store.getTotalPrice(),
    totalItems: store.getTotalItems(),
  };
};
