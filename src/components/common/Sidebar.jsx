import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import useStore from '../../store/useStore';
import { CATEGORIES } from '../../data/mockData';

const Sidebar = () => {
  const {
    activeCategory,
    setActiveCategory,
    priceRange,
    setMinPrice,
    setMaxPrice,
  } = useStore();
  const [localMin, setLocalMin] = useState(priceRange.min);
  const [localMax, setLocalMax] = useState(priceRange.max);

  const maxPrice = 10000;

  // 处理最小值变化
  const handleMinChange = (value) => {
    const newMin = Math.min(value, localMax - 100);
    setLocalMin(newMin);
  };

  // 处理最大值变化
  const handleMaxChange = (value) => {
    const newMax = Math.max(value, localMin + 100);
    setLocalMax(newMax);
  };

  // 鼠标释放时更新全局状态
  const handleMouseUp = () => {
    setMinPrice(localMin);
    setMaxPrice(localMax);
  };

  // 同步全局状态到本地
  useEffect(() => {
    setLocalMin(priceRange.min);
    setLocalMax(priceRange.max);
  }, [priceRange.min, priceRange.max]);

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 space-y-10 lg:pr-8 mb-8 lg:mb-0">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">
          浏览分类
        </h3>
        <ul className="space-y-3">
          {CATEGORIES.map((cat, index) => (
            <motion.li
              key={cat}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <button
                onClick={() => setActiveCategory(cat)}
                className={`text-sm tracking-wide transition-all duration-300 flex items-center gap-3 w-full text-left group relative
                  ${
                    activeCategory === cat
                      ? 'text-black font-semibold pl-2'
                      : 'text-gray-500 hover:text-gray-800 hover:pl-2'
                  }`}
              >
                <motion.span
                  className="w-1.5 h-1.5 rounded-full bg-black"
                  initial={{ scale: 0 }}
                  animate={{
                    scale: activeCategory === cat ? 1 : 0,
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
                {cat}
                {activeCategory === cat && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute -left-2 -right-2 -top-1 -bottom-1 bg-gray-100 rounded -z-10"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">
          价格区间
        </h3>
        <div className="px-1 space-y-6">
          {/* 双滑块容器 */}
          <div className="relative h-1">
            {/* 背景轨道 */}
            <div className="absolute w-full h-0.5 bg-gray-200 rounded top-1/2 -translate-y-1/2"></div>
            
            {/* 选中区间 */}
            <div 
              className="absolute h-0.5 bg-black top-1/2 -translate-y-1/2"
              style={{
                left: `${(localMin / maxPrice) * 100}%`,
                right: `${100 - (localMax / maxPrice) * 100}%`
              }}
            ></div>

            {/* 最小值滑块 */}
            <input 
              type="range" 
              min="0" 
              max={maxPrice}
              value={localMin}
              onChange={(e) => handleMinChange(Number(e.target.value))}
              onMouseUp={handleMouseUp}
              onTouchEnd={handleMouseUp}
              className="absolute w-full h-1 appearance-none bg-transparent pointer-events-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:pointer-events-auto
                [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:scale-110
                [&::-webkit-slider-thumb]:transition-transform
                [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full 
                [&::-moz-range-thumb]:bg-black [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:pointer-events-auto
                [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:hover:scale-110
                [&::-moz-range-thumb]:transition-transform"
              style={{ zIndex: localMin > maxPrice - 1000 ? 5 : 3 }}
            />

            {/* 最大值滑块 */}
            <input 
              type="range" 
              min="0" 
              max={maxPrice}
              value={localMax}
              onChange={(e) => handleMaxChange(Number(e.target.value))}
              onMouseUp={handleMouseUp}
              onTouchEnd={handleMouseUp}
              className="absolute w-full h-1 appearance-none bg-transparent pointer-events-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:pointer-events-auto
                [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:scale-110
                [&::-webkit-slider-thumb]:transition-transform
                [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full 
                [&::-moz-range-thumb]:bg-black [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:pointer-events-auto
                [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:hover:scale-110
                [&::-moz-range-thumb]:transition-transform"
              style={{ zIndex: 4 }}
            />
          </div>

          {/* 价格显示 */}
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                最低
              </span>
              <span className="font-serif text-lg font-semibold text-black">
                ¥{localMin}
              </span>
            </div>
            <span className="text-gray-300 text-2xl font-light">—</span>
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                最高
              </span>
              <span className="font-serif text-lg font-semibold text-black">
                ¥{localMax}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        whileHover={{ scale: 1.02 }}
        className="hidden lg:block mt-12 p-6 bg-stone-100 rounded-none relative overflow-hidden group cursor-pointer"
      >
        <motion.div
          className="absolute top-0 right-0 w-20 h-20 bg-orange-200 rounded-full blur-2xl -mr-10 -mt-10 opacity-50"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <p className="font-serif text-lg italic text-stone-700 relative z-10 mb-2">
          New Season
        </p>
        <p className="text-xs text-stone-500 uppercase tracking-widest relative z-10">
          Essential Collection
        </p>
      </motion.div>
    </aside>
  );
};

export default Sidebar;
