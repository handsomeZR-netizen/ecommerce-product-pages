import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const ProductSkeleton: React.FC = () => {
  return (
    <Card role="status" aria-label="加载中" aria-live="polite" aria-busy="true">
      <CardContent className="p-4">
        <Skeleton className="w-full h-48 mb-4 rounded-md" aria-hidden="true" />
        <Skeleton className="h-6 w-3/4 mb-2" aria-hidden="true" />
        <Skeleton className="h-6 w-1/2 mb-4" aria-hidden="true" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-24" aria-hidden="true" />
          <Skeleton className="h-10 w-28" aria-hidden="true" />
        </div>
      </CardContent>
    </Card>
  );
};

interface ProductGridSkeletonProps {
  count?: number;
}

export const ProductGridSkeleton: React.FC<ProductGridSkeletonProps> = ({ count = 8 }) => {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
      role="status"
      aria-label="正在加载商品"
      aria-live="polite"
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
};
