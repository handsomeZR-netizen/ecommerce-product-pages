import React from 'react';
import ProductCard from './ProductCard';
import { Filter } from 'lucide-react';
import useStore from '../../store/useStore';

const ProductGrid = ({ products }) => {
  const { setActiveCategory, setPriceRange } = useStore();

  if (products.length === 0) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center text-gray-400">
        <Filter size={48} strokeWidth={1} className="mb-4 opacity-20" />
        <p className="font-light">暂无符合条件的商品</p>
        <button 
          onClick={() => {
            setActiveCategory("全部");
            setPriceRange({ min: 0, max: 10000 });
          }}
          className="mt-4 text-xs font-bold uppercase tracking-widest border-b border-black text-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-all"
        >
          清除筛选
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
};

export default ProductGrid;
