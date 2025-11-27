import React from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { CartItem } from './CartItem';
import { EmptyState } from '@/components/common/EmptyState';
import { useCart } from '@/hooks/useCart';
import { ShoppingBag, X } from 'lucide-react';

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * 购物车抽屉组件
 * 使用 shadcn/ui 的 Drawer 组件
 * 显示购物车商品列表、总价
 * 购物车为空时显示 EmptyState
 * 提供"清空购物车"和"去结算"按钮
 *
 * 验证需求: Requirements 7.1, 7.5
 */
export const CartDrawer: React.FC<CartDrawerProps> = ({ open, onOpenChange }) => {
  const { items = [], updateQuantity, removeFromCart, clearCart, totalPrice } = useCart();

  const handleCheckout = () => {
    // TODO: 实现结算逻辑
    alert('结算功能待实现');
    onOpenChange(false);
  };

  const handleClearCart = () => {
    if (window.confirm('确定要清空购物车吗？')) {
      clearCart();
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              <DrawerTitle>购物车</DrawerTitle>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" aria-label="关闭购物车">
                <X className="h-5 w-5" />
              </Button>
            </DrawerClose>
          </div>
          <DrawerDescription>
            {items.length > 0 ? `共 ${items.length} 件商品` : '购物车是空的'}
          </DrawerDescription>
        </DrawerHeader>

        {/* 购物车内容 */}
        <div className="flex-1 overflow-y-auto px-4 py-2 max-h-[60vh]">
          {items.length === 0 ? (
            <EmptyState
              title="购物车是空的"
              description="快去挑选心仪的商品吧"
              action={{
                label: '去逛逛',
                onClick: () => onOpenChange(false),
              }}
              illustration={
                <div className="w-48 h-48 mb-6 opacity-50">
                  <ShoppingBag className="w-full h-full text-gray-400" />
                </div>
              }
            />
          ) : (
            <div className="space-y-0">
              {items.map(item => (
                <CartItem
                  key={item.product.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </div>
          )}
        </div>

        {/* 底部操作栏 */}
        {items.length > 0 && (
          <DrawerFooter className="border-t">
            {/* 总价 */}
            <div className="flex items-center justify-between mb-4 text-lg">
              <span className="font-semibold">总计：</span>
              <span className="text-2xl font-bold text-red-600">¥{totalPrice.toFixed(2)}</span>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 focus:ring-2 focus:ring-blue-500"
                onClick={handleClearCart}
                aria-label="清空购物车"
              >
                清空购物车
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                onClick={handleCheckout}
                aria-label="去结算"
              >
                去结算
              </Button>
            </div>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
};
