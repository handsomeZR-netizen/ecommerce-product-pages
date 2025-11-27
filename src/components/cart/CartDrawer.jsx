import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Trash2 } from 'lucide-react';
import useStore from '../../store/useStore';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, removeFromCart } = useStore();

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
          />

          {/* 购物车抽屉 */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* 头部 */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <ShoppingBag size={24} strokeWidth={1.5} />
                <h2 className="text-xl font-medium">购物袋</h2>
                <span className="text-sm text-gray-400">({cart.length})</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* 商品列表 */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <ShoppingBag size={64} strokeWidth={1} className="mb-4 opacity-20" />
                  <p className="text-sm">购物袋是空的</p>
                  <button
                    onClick={onClose}
                    className="mt-6 px-6 py-2 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    继续购物
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <motion.div
                      key={item.cartId}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      className="flex gap-4 p-4 bg-gray-50 hover:bg-gray-100 transition-colors group"
                    >
                      {/* 商品图片 */}
                      <div className={`w-20 h-24 ${item.imageColor} flex items-center justify-center flex-shrink-0`}>
                        <span className={`text-2xl font-black opacity-10 ${item.dark ? 'text-white' : 'text-black'}`}>
                          {item.imageText}
                        </span>
                      </div>

                      {/* 商品信息 */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-medium text-sm mb-1">{item.name}</h3>
                          <p className="text-xs text-gray-400">{item.category}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-serif text-lg">¥{item.price}</span>
                          <button
                            onClick={() => removeFromCart(item.cartId)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* 底部结算 */}
            {cart.length > 0 && (
              <div className="border-t border-gray-100 p-6 space-y-4">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-medium">总计</span>
                  <span className="font-serif font-semibold">¥{total.toFixed(2)}</span>
                </div>
                <button className="w-full bg-black text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
                  去结算
                </button>
                <button
                  onClick={onClose}
                  className="w-full border border-gray-300 text-gray-700 py-3 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  继续购物
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
