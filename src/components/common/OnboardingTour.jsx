import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: '欢迎来到 Lumina',
    description: '探索我们精心挑选的极简美学商品',
    position: 'center',
  },
  {
    id: 2,
    title: '浏览分类',
    description: '点击左侧分类快速筛选您感兴趣的商品',
    target: 'sidebar',
    position: 'right',
  },
  {
    id: 3,
    title: '价格区间',
    description: '拖动滑块设置您的预算范围',
    target: 'price-range',
    position: 'right',
  },
  {
    id: 4,
    title: '加入购物袋',
    description: '鼠标悬停在商品上，点击按钮加入购物袋',
    target: 'product-card',
    position: 'bottom',
  },
  {
    id: 5,
    title: '查看购物袋',
    description: '点击右上角购物袋图标查看已选商品',
    target: 'cart-button',
    position: 'bottom',
  },
];

const OnboardingTour = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('hasSeenTour', 'true');
  };

  const currentStepData = steps[currentStep];

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {/* 背景遮罩 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
      />

      {/* 引导卡片 */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className={`fixed z-[101] bg-white rounded-lg shadow-2xl p-8 max-w-md
          ${currentStepData.position === 'center' ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' : ''}
          ${currentStepData.position === 'right' ? 'top-1/2 left-80 -translate-y-1/2' : ''}
          ${currentStepData.position === 'bottom' ? 'top-32 right-8' : ''}
        `}
      >
        {/* 关闭按钮 */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black transition-colors"
        >
          <X size={20} />
        </button>

        {/* 内容 */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentStep ? 'w-8 bg-black' : 'w-1.5 bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-400 ml-2">
              {currentStep + 1} / {steps.length}
            </span>
          </div>

          <h3 className="text-2xl font-light mb-3 text-black">
            {currentStepData.title}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {currentStepData.description}
          </p>
        </div>

        {/* 按钮 */}
        <div className="flex gap-3">
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-6 py-3 border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              上一步
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 bg-black text-white px-6 py-3 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            {currentStep === steps.length - 1 ? '开始探索' : '下一步'}
            <ArrowRight size={16} />
          </button>
        </div>

        {/* 跳过按钮 */}
        <button
          onClick={handleClose}
          className="w-full mt-3 text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          跳过引导
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default OnboardingTour;
