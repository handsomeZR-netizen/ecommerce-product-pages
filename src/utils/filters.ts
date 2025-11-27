import { Product, FilterOptions } from '@/types';

/**
 * 按价格区间筛选商品
 * @param products 商品列表
 * @param priceRange 价格区间 [最低价, 最高价]
 * @returns 筛选后的商品列表
 */
export const filterByPriceRange = (
  products: Product[],
  priceRange: [number, number]
): Product[] => {
  const [min, max] = priceRange;
  return products.filter(product => product.price >= min && product.price <= max);
};

/**
 * 按分类筛选商品
 * @param products 商品列表
 * @param category 分类名称
 * @returns 筛选后的商品列表
 */
export const filterByCategory = (products: Product[], category: string): Product[] => {
  return products.filter(product => product.category === category);
};

/**
 * 按关键词筛选商品
 * @param products 商品列表
 * @param keyword 搜索关键词
 * @returns 筛选后的商品列表
 */
export const filterByKeyword = (products: Product[], keyword: string): Product[] => {
  const lowerKeyword = keyword.toLowerCase().trim();
  if (!lowerKeyword) {
    return products;
  }

  return products.filter(
    product =>
      product.name.toLowerCase().includes(lowerKeyword) ||
      product.description.toLowerCase().includes(lowerKeyword)
  );
};

/**
 * 应用多条件筛选
 * @param products 商品列表
 * @param filters 筛选选项
 * @returns 筛选后的商品列表
 */
export const applyMultipleFilters = (products: Product[], filters: FilterOptions): Product[] => {
  let result = [...products];

  // 应用分类筛选
  if (filters.category && filters.category !== 'all') {
    result = filterByCategory(result, filters.category);
  }

  // 应用价格区间筛选
  if (filters.priceRange) {
    result = filterByPriceRange(result, filters.priceRange);
  }

  // 应用关键词筛选
  if (filters.keyword) {
    result = filterByKeyword(result, filters.keyword);
  }

  return result;
};
