import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Search, Heart } from 'lucide-react';
import useStore from '../../store/useStore';

const Header = ({ onCartClick }) => {
  const cartCount = useStore((state) => state.cartCount);
  const wishlist = useStore((state) => state.wishlist);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <span className="text-white font-serif italic font-bold text-lg">
              L
            </span>
          </div>
          <span className="text-xl font-medium tracking-widest uppercase text-gray-900 hidden sm:block">
            Lumina
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-6"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="group relative p-2 text-gray-500 hover:text-black transition-colors"
          >
            <Search size={20} strokeWidth={1.5} />
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="group relative p-2 text-gray-500 hover:text-black transition-colors"
          >
            <Heart size={20} strokeWidth={1.5} />
            {wishlist.length > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1 right-0 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full"
              >
                {wishlist.length}
              </motion.span>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCartClick}
            className="relative p-2 text-gray-500 hover:text-black transition-colors flex items-center gap-2 group"
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            {cartCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                className="absolute top-1 right-0 w-4 h-4 bg-black text-white text-[10px] flex items-center justify-center rounded-full"
              >
                {cartCount}
              </motion.span>
            )}
            <span className="text-sm hidden md:block group-hover:underline decoration-1 underline-offset-4">
              购物车
            </span>
          </motion.button>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;
