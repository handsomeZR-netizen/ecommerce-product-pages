import { create } from 'zustand';
import type { Product, FilterOptions, SortOption, PaginationState } from '@/types';

/**
 * 商品状态管理接口
 */
interface ProductStore {
  /** 商品列表 */
  products: Product[];
  /** 筛选条件 */
  filters: FilterOptions;
  /** 排序选项 */
  sortOption: SortOption;
  /** 分页状态 */
  pagination: PaginationState;
  /** 设置商品列表 */
  setProducts: (products: Product[]) => void;
  /** 设置筛选条件（筛选变化时重置分页） */
  setFilters: (filters: Partial<FilterOptions>) => void;
  /** 设置排序选项（排序变化时重置分页） */
  setSortOption: (option: SortOption) => void;
  /** 设置当前页码 */
  setPage: (page: number) => void;
  /** 重置所有筛选条件和排序 */
  resetFilters: () => void;
}

/**
 * 商品状态管理 Store
 * 使用 Zustand 创建，管理商品列表、筛选、排序和分页状态
 */
export const useProductStore = create<ProductStore>(set => ({
  products: [],
  filters: {},
  sortOption: 'default',
  pagination: {
    currentPage: 1,
    pageSize: 12,
    totalItems: 0,
  },

  setProducts: products => {
    set({ products });
  },

  setFilters: newFilters => {
    set(state => ({
      filters: { ...state.filters, ...newFilters },
      // 筛选变化时重置到第一页
      pagination: { ...state.pagination, currentPage: 1 },
    }));
  },

  setSortOption: option => {
    set(state => ({
      sortOption: option,
      // 排序变化时重置到第一页
      pagination: { ...state.pagination, currentPage: 1 },
    }));
  },

  setPage: page => {
    set(state => ({
      pagination: { ...state.pagination, currentPage: page },
    }));
  },

  resetFilters: () => {
    set({
      filters: {},
      sortOption: 'default',
      pagination: { currentPage: 1, pageSize: 12, totalItems: 0 },
    });
  },
}));
