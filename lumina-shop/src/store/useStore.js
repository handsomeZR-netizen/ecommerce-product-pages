import { create } from 'zustand';

const useStore = create((set) => ({
  // 购物车状态
  cart: [],
  cartCount: 0,
  
  // 筛选状态
  activeCategory: '全部',
  priceRange: { min: 0, max: 5000 },
  sortBy: 'default',
  
  // 收藏列表
  wishlist: [],
  
  // Actions
  addToCart: (product) => set((state) => ({
    cart: [...state.cart, { ...product, cartId: Date.now() }],
    cartCount: state.cartCount + 1,
  })),
  
  removeFromCart: (cartId) => set((state) => ({
    cart: state.cart.filter(item => item.cartId !== cartId),
    cartCount: state.cartCount - 1,
  })),
  
  setActiveCategory: (category) => set({ activeCategory: category }),
  
  setPriceRange: (range) => set({ priceRange: range }),
  
  setMinPrice: (min) => set((state) => ({ 
    priceRange: { ...state.priceRange, min } 
  })),
  
  setMaxPrice: (max) => set((state) => ({ 
    priceRange: { ...state.priceRange, max } 
  })),
  
  setSortBy: (sort) => set({ sortBy: sort }),
  
  toggleWishlist: (productId) => set((state) => {
    const isInWishlist = state.wishlist.includes(productId);
    return {
      wishlist: isInWishlist
        ? state.wishlist.filter(id => id !== productId)
        : [...state.wishlist, productId]
    };
  }),
}));

export default useStore;
