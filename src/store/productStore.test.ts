import { describe, it, expect, beforeEach } from 'vitest';
import { useProductStore } from './productStore';

describe('ProductStore', () => {
  beforeEach(() => {
    // 重置 store 到初始状态
    const store = useProductStore.getState();
    store.resetFilters();
    store.setProducts([]);
  });

  it('should reset pagination to page 1 when filters change', () => {
    // 设置到第 3 页
    useProductStore.getState().setPage(3);
    expect(useProductStore.getState().pagination.currentPage).toBe(3);

    // 改变筛选条件
    useProductStore.getState().setFilters({ category: '电子产品' });

    // 验证：分页应该重置到第 1 页
    expect(useProductStore.getState().pagination.currentPage).toBe(1);
    expect(useProductStore.getState().filters.category).toBe('电子产品');
  });

  it('should reset pagination to page 1 when sort option changes', () => {
    // 设置到第 5 页
    useProductStore.getState().setPage(5);
    expect(useProductStore.getState().pagination.currentPage).toBe(5);

    // 改变排序选项
    useProductStore.getState().setSortOption('price-asc');

    // 验证：分页应该重置到第 1 页
    expect(useProductStore.getState().pagination.currentPage).toBe(1);
    expect(useProductStore.getState().sortOption).toBe('price-asc');
  });

  it('should maintain filters when changing sort option', () => {
    const store = useProductStore.getState();

    // 设置筛选条件
    store.setFilters({ category: '服装', priceRange: [100, 500] });

    // 改变排序选项
    store.setSortOption('price-desc');

    // 验证：筛选条件应该保持不变
    const state = useProductStore.getState();
    expect(state.filters.category).toBe('服装');
    expect(state.filters.priceRange).toEqual([100, 500]);
    expect(state.sortOption).toBe('price-desc');
  });

  it('should reset all state when resetFilters is called', () => {
    const store = useProductStore.getState();

    // 设置各种状态
    store.setFilters({ category: '图书', keyword: 'test' });
    store.setSortOption('rating');
    store.setPage(7);

    // 重置
    store.resetFilters();

    // 验证：所有状态应该恢复到初始值
    const state = useProductStore.getState();
    expect(state.filters).toEqual({});
    expect(state.sortOption).toBe('default');
    expect(state.pagination.currentPage).toBe(1);
  });

  it('should merge filters when setFilters is called multiple times', () => {
    const store = useProductStore.getState();

    // 设置第一个筛选条件
    store.setFilters({ category: '食品' });

    // 设置第二个筛选条件
    store.setFilters({ priceRange: [50, 200] });

    // 验证：两个筛选条件都应该存在
    const state = useProductStore.getState();
    expect(state.filters.category).toBe('食品');
    expect(state.filters.priceRange).toEqual([50, 200]);
  });
});
