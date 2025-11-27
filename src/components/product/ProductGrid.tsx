import React from 'react';
import { ProductCard } from './ProductCard';
import { ProductGridSkeleton } from '@/components/common/ProductSkeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  onAddToCart?: (product: Product) => void;
  onResetFilters?: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  onAddToCart,
  onResetFilters,
}) => {
  // Show skeleton loading state
  if (isLoading) {
    return <ProductGridSkeleton count={8} />;
  }

  // Show empty state when no products
  if (products.length === 0) {
    return (
      <EmptyState
        title="未找到商品"
        description="没有符合条件的商品，请尝试调整筛选条件"
        action={
          onResetFilters
            ? {
                label: '重置筛选',
                onClick: onResetFilters,
              }
            : undefined
        }
      />
    );
  }

  // Render product grid with responsive layout
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
      role="list"
      aria-label={`商品列表，共 ${products.length} 件商品`}
    >
      {products.map(product => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
};
