import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { MainLayout } from '@/components/common/MainLayout';
import { ProductGridSkeleton } from '@/components/common/ProductSkeleton';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import './styles/globals.css';

// 使用 React.lazy 实现代码分割
const ProductListPage = lazy(() =>
  import('@/pages/ProductListPage').then(module => ({ default: module.ProductListPage }))
);
const ProductDetailPage = lazy(() =>
  import('@/pages/ProductDetailPage').then(module => ({ default: module.ProductDetailPage }))
);
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then(module => ({ default: module.NotFoundPage }))
);

/**
 * 页面级骨架屏
 * 用于 Suspense fallback，在页面组件加载时显示
 */
const PageSkeleton = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
        <ProductGridSkeleton count={8} />
      </div>
    </MainLayout>
  );
};

/**
 * 应用主组件
 *
 * 功能：
 * - 配置 React Router 路由
 * - 使用 React.lazy 和 Suspense 实现代码分割
 * - 配置页面级骨架屏作为加载状态
 *
 * 路由配置：
 * - / : 商品列表页 (ProductListPage)
 * - /product/:id : 商品详情页 (ProductDetailPage)
 * - * : 404 页面 (NotFoundPage)
 *
 * 验证需求: Requirements 5.1, 5.3, 10.1
 */
function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<PageSkeleton />}>
          <Routes>
            {/* 商品列表页 */}
            <Route path="/" element={<ProductListPage />} />

            {/* 商品详情页 */}
            <Route path="/product/:id" element={<ProductDetailPage />} />

            {/* 404 页面 - 捕获所有未匹配的路由 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>

        {/* Toast 通知组件 */}
        <Toaster />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
