import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useProductStore } from '@/store/productStore';
import { mockApi } from '@/services/mockApi';
import { applyMultipleFilters } from '@/utils/filters';
import { sortProducts } from '@/utils/sorting';

/**
 * 商品数据 Hook
 * 封装商品数据获取和处理逻辑，使用 useMemo 缓存筛选和排序结果
 *
 * @returns 商品数据、筛选状态、排序状态、分页状态和相关操作方法
 */
export const useProducts = () => {
  const store = useProductStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 获取商品数据
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const products = await mockApi.getProducts();
      store.setProducts(products);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('加载商品失败');
      setError(error);
      toast.error('加载商品失败，请重试', {
        action: {
          label: '重试',
          onClick: () => fetchProducts(),
        },
      });
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 使用 useMemo 缓存筛选和排序结果
  const filteredAndSortedProducts = useMemo(() => {
    // 应用筛选
    let result = applyMultipleFilters(store.products, store.filters);

    // 应用排序
    result = sortProducts(result, store.sortOption);

    return result;
  }, [store.products, store.filters, store.sortOption]);

  // 计算分页数据
  const paginatedProducts = useMemo(() => {
    const start = (store.pagination.currentPage - 1) * store.pagination.pageSize;
    const end = start + store.pagination.pageSize;
    return filteredAndSortedProducts.slice(start, end);
  }, [filteredAndSortedProducts, store.pagination.currentPage, store.pagination.pageSize]);

  // 计算总页数
  const totalPages = useMemo(() => {
    return Math.ceil(filteredAndSortedProducts.length / store.pagination.pageSize);
  }, [filteredAndSortedProducts.length, store.pagination.pageSize]);

  return {
    // 当前页的商品
    products: paginatedProducts,
    // 筛选和排序后的总商品数
    totalProducts: filteredAndSortedProducts.length,
    // 加载状态
    isLoading,
    // 错误状态
    error,
    // 筛选条件
    filters: store.filters,
    // 排序选项
    sortOption: store.sortOption,
    // 分页状态
    pagination: {
      ...store.pagination,
      totalPages,
    },
    // 操作方法
    setFilters: store.setFilters,
    setSortOption: store.setSortOption,
    setPage: store.setPage,
    resetFilters: store.resetFilters,
    // 重试方法
    retry: fetchProducts,
  };
};
