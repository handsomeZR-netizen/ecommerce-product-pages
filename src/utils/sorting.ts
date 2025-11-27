import { Product, SortOption } from '@/types';

/**
 * 对商品列表进行排序
 * @param products 商品列表
 * @param sortOption 排序选项
 * @returns 排序后的商品列表
 */
export const sortProducts = (products: Product[], sortOption: SortOption): Product[] => {
  // 创建副本以避免修改原数组
  const result = [...products];

  switch (sortOption) {
    case 'price-asc':
      // 价格升序
      return result.sort((a, b) => a.price - b.price);

    case 'price-desc':
      // 价格降序
      return result.sort((a, b) => b.price - a.price);

    case 'rating':
      // 按评分降序（评分高的在前）
      return result.sort((a, b) => {
        const ratingA = a.rating ?? 0;
        const ratingB = b.rating ?? 0;
        return ratingB - ratingA;
      });

    case 'default':
    default:
      // 默认排序（保持原顺序）
      return result;
  }
};
