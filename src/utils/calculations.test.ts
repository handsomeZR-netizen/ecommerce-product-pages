import { describe, it, expect } from 'vitest';
import {
  calculateTotalPrice,
  calculateDiscount,
  calculateTotalItems,
  formatPrice,
  calculateSubtotal,
} from './calculations';
import { CartItem, Product } from '@/types';

describe('Calculation Functions', () => {
  const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    price: 100,
    originalPrice: 150,
    category: '电子产品',
    image: 'https://example.com/image.jpg',
    description: 'Test description',
    stock: 10,
    rating: 4.5,
    reviews: 100,
  };

  describe('calculateTotalPrice', () => {
    it('should calculate total price for empty cart', () => {
      expect(calculateTotalPrice([])).toBe(0);
    });

    it('should calculate total price for single item', () => {
      const items: CartItem[] = [{ product: mockProduct, quantity: 2 }];
      expect(calculateTotalPrice(items)).toBe(200);
    });

    it('should calculate total price for multiple items', () => {
      const items: CartItem[] = [
        { product: mockProduct, quantity: 2 },
        { product: { ...mockProduct, id: '2', price: 50 }, quantity: 3 },
      ];
      expect(calculateTotalPrice(items)).toBe(350);
    });
  });

  describe('calculateDiscount', () => {
    it('should calculate discount percentage', () => {
      expect(calculateDiscount(150, 100)).toBe(33);
    });

    it('should return 0 for no discount', () => {
      expect(calculateDiscount(100, 100)).toBe(0);
    });

    it('should return 0 when current price is higher', () => {
      expect(calculateDiscount(100, 150)).toBe(0);
    });

    it('should return 0 for invalid original price', () => {
      expect(calculateDiscount(0, 100)).toBe(0);
    });
  });

  describe('calculateTotalItems', () => {
    it('should calculate total items for empty cart', () => {
      expect(calculateTotalItems([])).toBe(0);
    });

    it('should calculate total items for single item', () => {
      const items: CartItem[] = [{ product: mockProduct, quantity: 3 }];
      expect(calculateTotalItems(items)).toBe(3);
    });

    it('should calculate total items for multiple items', () => {
      const items: CartItem[] = [
        { product: mockProduct, quantity: 2 },
        { product: { ...mockProduct, id: '2' }, quantity: 3 },
      ];
      expect(calculateTotalItems(items)).toBe(5);
    });
  });

  describe('formatPrice', () => {
    it('should format price with default currency', () => {
      expect(formatPrice(100)).toBe('¥100.00');
    });

    it('should format price with custom currency', () => {
      expect(formatPrice(100, '$')).toBe('$100.00');
    });

    it('should format decimal prices', () => {
      expect(formatPrice(99.99)).toBe('¥99.99');
    });
  });

  describe('calculateSubtotal', () => {
    it('should calculate subtotal for single quantity', () => {
      expect(calculateSubtotal(mockProduct, 1)).toBe(100);
    });

    it('should calculate subtotal for multiple quantity', () => {
      expect(calculateSubtotal(mockProduct, 5)).toBe(500);
    });

    it('should calculate subtotal for zero quantity', () => {
      expect(calculateSubtotal(mockProduct, 0)).toBe(0);
    });
  });
});
