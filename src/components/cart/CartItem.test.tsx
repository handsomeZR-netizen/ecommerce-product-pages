import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import * as fc from 'fast-check';
import { CartItem } from './CartItem';
import type { CartItem as CartItemType, Product } from '@/types';

// 商品生成器
const productArbitrary = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 50 }),
  price: fc.float({
    min: Math.fround(0.01),
    max: Math.fround(10000),
    noNaN: true,
    noDefaultInfinity: true,
  }),
  category: fc.constantFrom('电子产品', '服装', '食品', '图书', '家居'),
  image: fc.webUrl(),
  description: fc.lorem(),
  stock: fc.integer({ min: 0, max: 1000 }),
  rating: fc.float({
    min: Math.fround(0),
    max: Math.fround(5),
    noNaN: true,
    noDefaultInfinity: true,
  }),
  reviews: fc.integer({ min: 0, max: 1000 }),
}) as fc.Arbitrary<Product>;

// 购物车项生成器
const cartItemArbitrary = fc.record({
  product: productArbitrary,
  quantity: fc.integer({ min: 1, max: 99 }),
}) as fc.Arbitrary<CartItemType>;

describe('CartItem', () => {
  /**
   * Feature: ecommerce-product-pages, Property 21: 购物车数量更新
   * 验证需求: Requirements 7.1
   *
   * 对于任何购物车中的商品，增加或减少数量后，该商品的数量应该正确更新
   */
  it('Property 21: should update quantity correctly when increased or decreased', () => {
    fc.assert(
      fc.property(cartItemArbitrary, cartItem => {
        const onUpdateQuantity = vi.fn();
        const onRemove = vi.fn();

        const { container } = render(
          <CartItem item={cartItem} onUpdateQuantity={onUpdateQuantity} onRemove={onRemove} />
        );

        // 使用 container 查找按钮，避免多个元素匹配问题
        const buttons = container.querySelectorAll('button');
        const decreaseButton = buttons[0]; // 第一个按钮是减少
        const increaseButton = buttons[1]; // 第二个按钮是增加

        // 测试增加数量
        fireEvent.click(increaseButton);

        expect(onUpdateQuantity).toHaveBeenCalledWith(cartItem.product.id, cartItem.quantity + 1);

        // 重置 mock
        onUpdateQuantity.mockClear();

        // 测试减少数量
        fireEvent.click(decreaseButton);

        if (cartItem.quantity > 1) {
          // 如果数量大于 1，应该调用 updateQuantity
          expect(onUpdateQuantity).toHaveBeenCalledWith(cartItem.product.id, cartItem.quantity - 1);
          expect(onRemove).not.toHaveBeenCalled();
        } else {
          // 如果数量等于 1，应该调用 remove
          expect(onRemove).toHaveBeenCalledWith(cartItem.product.id);
        }

        // 清理 DOM
        cleanup();

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('should render product information correctly', () => {
    const mockItem: CartItemType = {
      product: {
        id: '1',
        name: '测试商品',
        price: 99.99,
        category: '电子产品',
        image: 'https://example.com/image.jpg',
        description: '测试描述',
        stock: 10,
      },
      quantity: 2,
    };

    const onUpdateQuantity = vi.fn();
    const onRemove = vi.fn();

    render(<CartItem item={mockItem} onUpdateQuantity={onUpdateQuantity} onRemove={onRemove} />);

    expect(screen.getByText('测试商品')).toBeInTheDocument();
    expect(screen.getByText('¥99.99')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('¥199.98')).toBeInTheDocument();
  });

  /**
   * Feature: ecommerce-product-pages, Property 22: 购物车商品删除
   * 验证需求: Requirements 7.3
   *
   * 对于任何购物车中的商品，点击删除后，该商品应该立即从购物车中移除
   */
  it('Property 22: should remove item from cart when delete button is clicked', () => {
    fc.assert(
      fc.property(cartItemArbitrary, cartItem => {
        const onUpdateQuantity = vi.fn();
        const onRemove = vi.fn();

        const { container } = render(
          <CartItem item={cartItem} onUpdateQuantity={onUpdateQuantity} onRemove={onRemove} />
        );

        // 使用 container 查找删除按钮（第三个按钮）
        const buttons = container.querySelectorAll('button');
        const deleteButton = buttons[2]; // 第三个按钮是删除

        fireEvent.click(deleteButton);

        // 验证 onRemove 被调用且参数正确
        expect(onRemove).toHaveBeenCalledWith(cartItem.product.id);
        expect(onRemove).toHaveBeenCalledTimes(1);

        // 清理 DOM
        cleanup();

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('should call onRemove when delete button is clicked', () => {
    const mockItem: CartItemType = {
      product: {
        id: '1',
        name: '测试商品',
        price: 99.99,
        category: '电子产品',
        image: 'https://example.com/image.jpg',
        description: '测试描述',
        stock: 10,
      },
      quantity: 2,
    };

    const onUpdateQuantity = vi.fn();
    const onRemove = vi.fn();

    render(<CartItem item={mockItem} onUpdateQuantity={onUpdateQuantity} onRemove={onRemove} />);

    const deleteButton = screen.getByLabelText('删除 测试商品');
    fireEvent.click(deleteButton);

    expect(onRemove).toHaveBeenCalledWith('1');
  });
});
