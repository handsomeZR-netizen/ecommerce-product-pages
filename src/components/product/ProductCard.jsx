import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, ArrowRight, Star } from 'lucide-react';
import useStore from '../../store/useStore';

const ProductCard = ({ product, index = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const isInWishlist = wishlist.includes(product.id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative flex flex-col gap-3 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
        className={`relative aspect-[3/4] overflow-hidden ${product.imageColor} transition-all duration-500 ease-out group-hover:shadow-xl`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`text-6xl font-black opacity-10 tracking-tighter ${
              product.dark ? 'text-white' : 'text-black'
            }`}
          >
            {product.imageText}
          </span>
          <motion.div
            className="absolute w-32 h-32 border border-white/20 rounded-full"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: isHovered ? 1.5 : 0,
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.7, delay: 0.1 }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-black/5 backdrop-blur-[1px] flex items-end p-4"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            className="w-full bg-white text-black py-3 text-xs font-bold tracking-widest uppercase hover:bg-black hover:text-white transition-colors duration-300 flex items-center justify-center gap-2"
          >
            加入购物袋 <ArrowRight size={14} />
          </motion.button>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 10,
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300
            ${isInWishlist ? 'bg-red-500' : 'bg-white/90 hover:bg-white'}`}
        >
          <Heart
            size={18}
            className={isInWishlist ? 'text-white fill-white' : 'text-black'}
          />
        </motion.button>
      </motion.div>

      <div className="pt-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1 font-medium">
              {product.category}
            </p>
            <h3 className="text-base font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
              {product.name}
            </h3>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-serif text-lg text-black font-medium">
              ¥{product.price}
            </span>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              className="flex items-center gap-0.5 text-yellow-500 text-[10px]"
            >
              <Star size={10} fill="currentColor" /> {product.rating}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
