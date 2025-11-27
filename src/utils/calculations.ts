import { CartItem, Product } from '@/types';

/**
 * 计算购物车总价
 * @param items 购物车项列表
 * @returns 总价
 */
export const calculateTotalPrice = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
};

/**
 * 计算商品折扣
 * @param originalPrice 原价
 * @param currentPrice 现价
 * @returns 折扣百分比（0-100）
 */
export const calculateDiscount = (originalPrice: number, currentPrice: number): number => {
  if (originalPrice <= 0 || currentPrice >= originalPrice) {
    return 0;
  }

  const discount = ((originalPrice - currentPrice) / originalPrice) * 100;
  return Math.round(discount);
};

/**
 * 计算购物车商品总数量
 * @param items 购物车项列表
 * @returns 总数量
 */
export const calculateTotalItems = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.quantity, 0);
};

/**
 * 格式化价格显示
 * @param price 价格
 * @param currency 货币符号
 * @returns 格式化后的价格字符串
 */
export const formatPrice = (price: number, currency: string = '¥'): string => {
  return `${currency}${price.toFixed(2)}`;
};

/**
 * 计算单个商品的小计
 * @param product 商品
 * @param quantity 数量
 * @returns 小计金额
 */
export const calculateSubtotal = (product: Product, quantity: number): number => {
  return product.price * quantity;
};
