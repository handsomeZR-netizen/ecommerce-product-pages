import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CartBadgeProps {
  count: number;
  onClick?: () => void;
}

/**
 * 购物车徽章组件
 * 显示购物车商品总数量，数量为 0 时隐藏徽章
 * 点击打开购物车抽屉
 *
 * 验证需求: Requirements 6.3
 */
export const CartBadge: React.FC<CartBadgeProps> = ({ count, onClick }) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative focus:ring-2 focus:ring-blue-500"
      onClick={onClick}
      aria-label={`购物车，${count} 件商品`}
    >
      <ShoppingCart className="h-6 w-6" />
      {count > 0 && (
        <span
          className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
          aria-hidden="true"
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Button>
  );
};
