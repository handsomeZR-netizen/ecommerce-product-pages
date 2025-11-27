import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { NotFoundPage } from './NotFoundPage';

/**
 * Feature: ecommerce-product-pages, Property 27: 404 页面显示
 * Validates: Requirements 5.3, 11.1
 */
describe('NotFoundPage - Error Handling', () => {
  it('Property 27: should display 404 page with all required elements', () => {
    render(
      <BrowserRouter>
        <NotFoundPage />
      </BrowserRouter>
    );

    // 验证 404 标题存在
    expect(screen.getByText('404')).toBeInTheDocument();

    // 验证错误提示存在
    expect(screen.getByText('页面未找到')).toBeInTheDocument();

    // 验证描述文本存在
    expect(screen.getByText(/抱歉，您访问的页面不存在或已被移除/)).toBeInTheDocument();

    // 验证返回首页按钮存在
    expect(screen.getByText('返回首页')).toBeInTheDocument();

    // 验证返回上一页链接存在
    expect(screen.getByText('返回上一页')).toBeInTheDocument();

    // 验证浏览商品链接存在
    expect(screen.getByText('浏览商品')).toBeInTheDocument();
  });

  it('should render 404 illustration', () => {
    render(
      <BrowserRouter>
        <NotFoundPage />
      </BrowserRouter>
    );

    // 验证 SVG 插图存在
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
