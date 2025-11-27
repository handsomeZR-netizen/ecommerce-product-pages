// 商品分类常量
export const CATEGORIES = ['全部', '电子产品', '服装', '食品', '图书', '家居'] as const;

// 响应式断点常量
export const BREAKPOINTS = {
  sm: '640px', // 手机横屏
  md: '768px', // 平板
  lg: '1024px', // 小型笔记本
  xl: '1280px', // 桌面
  '2xl': '1536px', // 大屏幕
} as const;

// 分页配置常量
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  PAGE_SIZE_OPTIONS: [12, 24, 48],
} as const;

// 防抖延迟常量（毫秒）
export const DEBOUNCE_DELAY = {
  SEARCH: 500,
  PRICE_SLIDER: 300,
} as const;

// 价格区间常量
export const PRICE_RANGE = {
  MIN: 0,
  MAX: 10000,
  STEP: 100,
} as const;

// Mock API 延迟常量（毫秒）
export const API_DELAY = {
  GET_PRODUCTS: 500,
  GET_PRODUCT_BY_ID: 300,
} as const;

// 图片相关常量
export const IMAGE = {
  FALLBACK_URL: '/images/placeholder.png',
  LAZY_LOADING: true,
} as const;

// 本地存储键名常量
export const STORAGE_KEYS = {
  CART: 'cart-storage',
} as const;
