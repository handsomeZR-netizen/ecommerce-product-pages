import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import type { CartItem as CartItemType } from '@/types';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

/**
 * 购物车项组件
 * 显示商品图片、名称、价格、数量
 * 提供增加、减少数量按钮和删除按钮
 * 使用 React.memo 优化性能
 *
 * 验证需求: Requirements 7.1, 7.2, 7.3, 10.1
 */
export const CartItem = React.memo<CartItemProps>(({ item, onUpdateQuantity, onRemove }) => {
  const { product, quantity } = item;

  const handleIncrease = () => {
    onUpdateQuantity(product.id, quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      onUpdateQuantity(product.id, quantity - 1);
    } else {
      onRemove(product.id);
    }
  };

  const handleRemove = () => {
    onRemove(product.id);
  };

  const subtotal = product.price * quantity;

  return (
    <div className="flex gap-4 py-4 border-b last:border-b-0">
      {/* 商品图片 */}
      <div className="flex-shrink-0 w-20 h-20">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover rounded-md"
        />
      </div>

      {/* 商品信息 */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm line-clamp-2 mb-1">{product.name}</h4>
        <p className="text-red-600 font-semibold">¥{product.price.toFixed(2)}</p>
      </div>

      {/* 数量控制和删除 */}
      <div className="flex flex-col items-end justify-between">
        {/* 数量控制 */}
        <div className="flex items-center gap-2 border rounded-md">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 focus:ring-2 focus:ring-blue-500"
            onClick={handleDecrease}
            aria-label={`减少 ${product.name} 数量`}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center font-medium" aria-label={`当前数量 ${quantity}`}>
            {quantity}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 focus:ring-2 focus:ring-blue-500"
            onClick={handleIncrease}
            aria-label={`增加 ${product.name} 数量`}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* 小计和删除按钮 */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold" aria-label={`小计 ${subtotal.toFixed(2)} 元`}>
            ¥{subtotal.toFixed(2)}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 focus:ring-2 focus:ring-red-500"
            onClick={handleRemove}
            aria-label={`删除 ${product.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
});

CartItem.displayName = 'CartItem';
