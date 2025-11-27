import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Sidebar from '../components/common/Sidebar';
import ProductGrid from '../components/product/ProductGrid';
import SortDropdown from '../components/product/SortDropdown';
import Pagination from '../components/common/Pagination';
import CartDrawer from '../components/cart/CartDrawer';
import OnboardingTour from '../components/common/OnboardingTour';
import useStore from '../store/useStore';
import { MOCK_PRODUCTS } from '../data/mockData';

const ITEMS_PER_PAGE = 9;

const ProductListPage = () => {
  const { activeCategory, priceRange, sortBy } = useStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 筛选和排序逻辑
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...MOCK_PRODUCTS];

    // 分类筛选
    if (activeCategory !== '全部') {
      result = result.filter(p => p.mainCategory === activeCategory);
    }
    
    // 价格筛选（双区间）
    result = result.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);

    // 排序
    switch (sortBy) {
      case 'priceAsc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'sales':
        result.sort((a, b) => b.sales - a.sales);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return result;
  }, [activeCategory, priceRange.min, priceRange.max, sortBy]);

  // 分页逻辑
  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // 筛选条件变化时重置页码
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, priceRange.min, priceRange.max, sortBy]);

  return (
    <div className="min-h-screen bg-[#F9F9F9] font-sans text-gray-900 selection:bg-black selection:text-white">
      <Header onCartClick={() => setIsCartOpen(true)} />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
        >
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl font-light mb-4 tracking-tight text-black"
            >
              精选集{' '}
              <span className="font-serif italic text-gray-400">
                Collection
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-500 max-w-md font-light leading-relaxed"
            >
              探索当季精选好物。我们将极简美学融入日常，为您提供既实用又具艺术感的商品。
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <SortDropdown />
          </motion.div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12">
          <Sidebar />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex-1"
          >
            <ProductGrid products={paginatedProducts} />

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </motion.div>
        </div>
      </main>

      <Footer />

      {/* 购物车抽屉 */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* 用户引导 */}
      <OnboardingTour />
    </div>
  );
};

export default ProductListPage;
