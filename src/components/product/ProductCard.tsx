import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard = React.memo<ProductCardProps>(({ product, onAddToCart }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(product);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // 支持 Enter 键导航到详情页
    if (e.key === 'Enter' && e.target === e.currentTarget) {
      handleClick();
    }
  };

  return (
    <article>
      <Card
        className="cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`查看 ${product.name} 详情`}
      >
        <CardContent className="p-3 sm:p-4">
          <ImageWithFallback
            src={product.image}
            alt={`${product.name} - ${product.category}`}
            className="w-full h-40 sm:h-48 object-cover rounded-md mb-3 sm:mb-4"
          />
          <h3 className="font-semibold text-base sm:text-lg mb-2 line-clamp-2">{product.name}</h3>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xl sm:text-2xl font-bold text-red-600">
              ¥{product.price.toFixed(2)}
            </span>
            <Button
              size="sm"
              onClick={handleAddToCart}
              className="active:scale-95 transition-transform focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-xs sm:text-sm"
              aria-label={`将 ${product.name} 加入购物车`}
            >
              加入购物车
            </Button>
          </div>
        </CardContent>
      </Card>
    </article>
  );
});

ProductCard.displayName = 'ProductCard';
