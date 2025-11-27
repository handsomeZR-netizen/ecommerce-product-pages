import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartDrawer } from './CartDrawer';
import { useCart } from '@/hooks/useCart';

// Mock useCart hook
vi.mock('@/hooks/useCart');

describe('CartDrawer', () => {
  const mockOnOpenChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display empty state when cart is empty', () => {
    // Mock empty cart
    vi.mocked(useCart).mockReturnValue({
      items: [],
      addToCart: vi.fn(),
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
      clearCart: vi.fn(),
      totalPrice: 0,
      totalItems: 0,
    });

    render(<CartDrawer open={true} onOpenChange={mockOnOpenChange} />);

    // 验证空状态显示 (使用 getAllByText 因为有多个相同文本)
    const emptyTexts = screen.getAllByText('购物车是空的');
    expect(emptyTexts.length).toBeGreaterThan(0);
    expect(screen.getByText('快去挑选心仪的商品吧')).toBeInTheDocument();
    expect(screen.getByText('去逛逛')).toBeInTheDocument();

    // 验证不显示结算按钮
    expect(screen.queryByText('去结算')).not.toBeInTheDocument();
  });

  it('should display cart items and total price correctly', () => {
    // Mock cart with items
    const mockItems = [
      {
        product: {
          id: '1',
          name: '商品1',
          price: 99.99,
          category: '电子产品',
          image: 'https://example.com/image1.jpg',
          description: '描述1',
          stock: 10,
        },
        quantity: 2,
      },
      {
        product: {
          id: '2',
          name: '商品2',
          price: 50.0,
          category: '服装',
          image: 'https://example.com/image2.jpg',
          description: '描述2',
          stock: 5,
        },
        quantity: 1,
      },
    ];

    const expectedTotal = 99.99 * 2 + 50.0 * 1; // 249.98

    vi.mocked(useCart).mockReturnValue({
      items: mockItems,
      addToCart: vi.fn(),
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
      clearCart: vi.fn(),
      totalPrice: expectedTotal,
      totalItems: 3,
    });

    render(<CartDrawer open={true} onOpenChange={mockOnOpenChange} />);

    // 验证商品显示
    expect(screen.getByText('商品1')).toBeInTheDocument();
    expect(screen.getByText('商品2')).toBeInTheDocument();

    // 验证总价显示
    expect(screen.getByText(`¥${expectedTotal.toFixed(2)}`)).toBeInTheDocument();

    // 验证操作按钮显示
    expect(screen.getByText('清空购物车')).toBeInTheDocument();
    expect(screen.getByText('去结算')).toBeInTheDocument();
  });

  it('should call clearCart when clear button is clicked and confirmed', () => {
    const mockClearCart = vi.fn();
    const mockItems = [
      {
        product: {
          id: '1',
          name: '商品1',
          price: 99.99,
          category: '电子产品',
          image: 'https://example.com/image1.jpg',
          description: '描述1',
          stock: 10,
        },
        quantity: 1,
      },
    ];

    vi.mocked(useCart).mockReturnValue({
      items: mockItems,
      addToCart: vi.fn(),
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
      clearCart: mockClearCart,
      totalPrice: 99.99,
      totalItems: 1,
    });

    // Mock window.confirm
    vi.stubGlobal(
      'confirm',
      vi.fn(() => true)
    );

    render(<CartDrawer open={true} onOpenChange={mockOnOpenChange} />);

    const clearButton = screen.getByText('清空购物车');
    fireEvent.click(clearButton);

    expect(window.confirm).toHaveBeenCalledWith('确定要清空购物车吗？');
    expect(mockClearCart).toHaveBeenCalled();

    vi.unstubAllGlobals();
  });

  it('should not call clearCart when clear button is clicked but not confirmed', () => {
    const mockClearCart = vi.fn();
    const mockItems = [
      {
        product: {
          id: '1',
          name: '商品1',
          price: 99.99,
          category: '电子产品',
          image: 'https://example.com/image1.jpg',
          description: '描述1',
          stock: 10,
        },
        quantity: 1,
      },
    ];

    vi.mocked(useCart).mockReturnValue({
      items: mockItems,
      addToCart: vi.fn(),
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
      clearCart: mockClearCart,
      totalPrice: 99.99,
      totalItems: 1,
    });

    // Mock window.confirm to return false
    vi.stubGlobal(
      'confirm',
      vi.fn(() => false)
    );

    render(<CartDrawer open={true} onOpenChange={mockOnOpenChange} />);

    const clearButton = screen.getByText('清空购物车');
    fireEvent.click(clearButton);

    expect(window.confirm).toHaveBeenCalledWith('确定要清空购物车吗？');
    expect(mockClearCart).not.toHaveBeenCalled();

    vi.unstubAllGlobals();
  });

  it('should close drawer when checkout button is clicked', () => {
    const mockItems = [
      {
        product: {
          id: '1',
          name: '商品1',
          price: 99.99,
          category: '电子产品',
          image: 'https://example.com/image1.jpg',
          description: '描述1',
          stock: 10,
        },
        quantity: 1,
      },
    ];

    vi.mocked(useCart).mockReturnValue({
      items: mockItems,
      addToCart: vi.fn(),
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
      clearCart: vi.fn(),
      totalPrice: 99.99,
      totalItems: 1,
    });

    // Mock window.alert
    vi.stubGlobal('alert', vi.fn());

    render(<CartDrawer open={true} onOpenChange={mockOnOpenChange} />);

    const checkoutButton = screen.getByText('去结算');
    fireEvent.click(checkoutButton);

    expect(window.alert).toHaveBeenCalledWith('结算功能待实现');
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);

    vi.unstubAllGlobals();
  });
});
