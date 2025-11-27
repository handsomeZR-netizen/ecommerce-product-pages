// 商品接口
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  images?: string[];
  description: string;
  specifications?: Record<string, string>;
  stock: number;
  rating?: number;
  reviews?: number;
}

// 购物车项接口
export interface CartItem {
  product: Product;
  quantity: number;
}

// 筛选选项接口
export interface FilterOptions {
  category?: string;
  priceRange?: [number, number];
  keyword?: string;
}

// 排序选项类型
export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating';

// 分页状态接口
export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
}
