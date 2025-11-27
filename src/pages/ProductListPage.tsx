import React from 'react';
import { MainLayout } from '@/components/common/MainLayout';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductFilter } from '@/components/product/ProductFilter';
import { ProductSort } from '@/components/product/ProductSort';
import { ProductPagination } from '@/components/product/ProductPagination';
import { EmptyState } from '@/components/common/EmptyState';
import { useProducts } from '@/hooks/useProducts';
import { useMediaQuery } from '@/hooks/useMediaQuery';

/**
 * 商品列表页
 *
 * 功能：
 * - 展示商品网格
 * - 提供筛选功能（价格区间、分类、关键词搜索）
 * - 提供排序功能（价格升序/降序、评分）
 * - 提供分页功能
 * - 响应式布局：桌面端左侧筛选栏，移动端抽屉筛选
 *
 * 验证需求: Requirements 1.1, 2.1, 2.2, 3.1, 4.1
 */
export const ProductListPage: React.FC = () => {
  const {
    products,
    totalProducts,
    isLoading,
    error,
    filters,
    sortOption,
    pagination,
    setFilters,
    setSortOption,
    setPage,
    resetFilters,
    retry,
  } = useProducts();

  const isMobile = useMediaQuery('(max-width: 768px)');

  // 如果有错误，显示错误状态
  if (error && !isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <EmptyState
            title="加载失败"
            description="无法加载商品数据，请检查网络连接后重试"
            action={{
              label: '重试',
              onClick: retry,
            }}
          />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* 页面标题和商品数量 */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">商品列表</h1>
          <div className="text-sm text-gray-600" role="status" aria-live="polite">
            {isLoading ? '加载中...' : `找到 ${totalProducts} 件商品`}
          </div>
        </header>

        {/* 排序组件 */}
        <section className="flex items-center justify-between" aria-label="排序选项">
          <ProductSort sortOption={sortOption} onSortChange={setSortOption} />
        </section>

        {/* 主内容区：筛选栏 + 商品网格 */}
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
          {/* 桌面端：左侧筛选栏 */}
          {!isMobile && (
            <aside className="w-full md:w-64 lg:w-72 flex-shrink-0" aria-label="商品筛选">
              <ProductFilter filters={filters} onFilterChange={setFilters} onReset={resetFilters} />
            </aside>
          )}

          {/* 商品网格 */}
          <section className="flex-1" aria-label="商品列表">
            <ProductGrid products={products} isLoading={isLoading} onResetFilters={resetFilters} />
          </section>
        </div>

        {/* 分页组件 */}
        {!isLoading && totalProducts > 0 && (
          <nav aria-label="分页导航">
            <ProductPagination
              pagination={pagination}
              totalProducts={totalProducts}
              onPageChange={setPage}
            />
          </nav>
        )}
      </div>

      {/* 移动端：筛选抽屉（通过 ProductFilter 组件内部处理） */}
      {isMobile && (
        <ProductFilter filters={filters} onFilterChange={setFilters} onReset={resetFilters} />
      )}
    </MainLayout>
  );
};
