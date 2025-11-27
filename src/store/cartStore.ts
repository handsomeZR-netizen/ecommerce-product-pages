import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, CartItem } from '@/types';

/**
 * 购物车状态管理接口
 */
interface CartStore {
  /** 购物车商品项列表 */
  items: CartItem[];
  /** 添加商品到购物车 */
  addItem: (product: Product) => void;
  /** 从购物车移除商品 */
  removeItem: (productId: string) => void;
  /** 更新购物车商品数量 */
  updateQuantity: (productId: string, quantity: number) => void;
  /** 清空购物车 */
  clearCart: () => void;
  /** 获取购物车总价（派生计算） */
  getTotalPrice: () => number;
  /** 获取购物车商品总数量（派生计算） */
  getTotalItems: () => number;
}

/**
 * 购物车状态管理 Store
 * 使用 Zustand 创建，配置 persist 中间件实现 localStorage 持久化
 */
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: product => {
        set(state => {
          const existingItem = state.items.find(item => item.product.id === product.id);

          if (existingItem) {
            // 如果商品已存在，增加数量
            return {
              items: state.items.map(item =>
                item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
              ),
            };
          }

          // 如果商品不存在，添加新项
          return {
            items: [...state.items, { product, quantity: 1 }],
          };
        });
      },

      removeItem: productId => {
        set(state => ({
          items: state.items.filter(item => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        set(state => ({
          items: state.items.map(item =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
      },

      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
