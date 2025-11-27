import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { CartBadge } from '@/components/cart/CartBadge';
import { CartDrawer } from '@/components/cart/CartDrawer';

export const Header: React.FC = () => {
  const cartCount = useCartStore(state => state.getTotalItems());
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <nav
          className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
          aria-label="主导航"
        >
          <Link
            to="/"
            className="text-xl sm:text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1"
            aria-label="返回首页"
          >
            电商平台
          </Link>
          <div className="flex items-center gap-4">
            <CartBadge count={cartCount} onClick={() => setIsCartOpen(true)} />
          </div>
        </nav>
      </header>
      <CartDrawer open={isCartOpen} onOpenChange={setIsCartOpen} />
    </>
  );
};
