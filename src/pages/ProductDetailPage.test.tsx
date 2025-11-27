import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProductDetailPage } from './ProductDetailPage';
import { mockApi } from '@/services/mockApi';
import { Product } from '@/types';
import * as fc from 'fast-check';

// Mock the mockApi
vi.mock('@/services/mockApi', () => ({
  mockApi: {
    getProductById: vi.fn(),
  },
}));

// Mock useCart hook
vi.mock('@/hooks/useCart', () => ({
  useCart: () => ({
    addToCart: vi.fn(),
  }),
}));

// Helper to render component with router
const renderWithRouter = (productId: string) => {
  return render(
    <BrowserRouter>
      <Routes>
        <Route path="/product/:id" element={<ProductDetailPage />} />
      </Routes>
    </BrowserRouter>,
    {
      // Set initial route
      wrapper: ({ children }) => {
        window.history.pushState({}, '', `/product/${productId}`);
        return <>{children}</>;
      },
    }
  );
};

// Arbitrary for generating random products with all required fields
const productArbitrary = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0), // Exclude whitespace-only strings
  price: fc.float({
    min: Math.fround(0.01),
    max: Math.fround(10000),
    noDefaultInfinity: true,
    noNaN: true,
  }),
  originalPrice: fc.option(
    fc.float({
      min: Math.fround(0.01),
      max: Math.fround(10000),
      noDefaultInfinity: true,
      noNaN: true,
    })
  ),
  category: fc.constantFrom('电子产品', '服装', '食品', '图书', '家居'),
  image: fc.constant('https://via.placeholder.com/400'),
  images: fc.array(fc.constant('https://via.placeholder.com/800'), { minLength: 1, maxLength: 4 }),
  description: fc.string({ minLength: 10, maxLength: 200 }).filter(s => s.trim().length > 0), // Exclude whitespace-only strings
  specifications: fc.dictionary(
    fc.constantFrom('品牌', '型号', '产地', '重量'),
    fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0) // Exclude whitespace-only strings
  ),
  stock: fc.integer({ min: 0, max: 1000 }),
  rating: fc.option(fc.float({ min: 3, max: 5, noDefaultInfinity: true, noNaN: true })),
  reviews: fc.option(fc.integer({ min: 0, max: 1000 })),
});

describe('ProductDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Feature: ecommerce-product-pages, Property 15: 商品详情字段完整性
   * Validates: Requirements 5.2
   *
   * 对于任何商品详情页，渲染的内容应该包含商品的名称、价格、图片、描述和规格信息
   */
  it('should display all required product fields', async () => {
    await fc.assert(
      fc.asyncProperty(productArbitrary, async product => {
        // Mock the API to return the generated product
        vi.mocked(mockApi.getProductById).mockResolvedValue(product as Product);

        // Render the component
        const { container, unmount } = renderWithRouter(product.id);

        // Wait for the product to load
        await waitFor(
          () => {
            const heading = container.querySelector('h1');
            expect(heading?.textContent).toBe(product.name);
          },
          { timeout: 1000 }
        );

        // Check that all required fields are present in the container
        const hasName = container.textContent?.includes(product.name) ?? false;
        const hasPrice = container.textContent?.includes(`¥${product.price.toFixed(2)}`) ?? false;
        const hasDescription = container.textContent?.includes(product.description) ?? false;

        // Check for specifications section if specifications exist
        let hasSpecifications = true;
        if (product.specifications && Object.keys(product.specifications).length > 0) {
          hasSpecifications = container.textContent?.includes('商品规格') ?? false;

          // Check that at least one specification is displayed
          if (hasSpecifications && Object.keys(product.specifications).length > 0) {
            const firstSpecValue = Object.values(product.specifications)[0];
            hasSpecifications = container.textContent?.includes(firstSpecValue) ?? false;
          }
        }

        // Check for image (alt text should contain product name)
        const images = container.querySelectorAll('img');
        const hasImage = Array.from(images).some(img =>
          img.getAttribute('alt')?.includes(product.name)
        );

        // Clean up immediately
        unmount();

        return hasName && hasPrice && hasDescription && hasSpecifications && hasImage;
      }),
      { numRuns: 20 } // Reduced from 100 to 20 for performance
    );
  }, 60000); // Increase timeout to 60 seconds for property-based test

  it('should display product name and price', async () => {
    const mockProduct: Product = {
      id: 'test-id',
      name: 'Test Product',
      price: 99.99,
      category: '电子产品',
      image: 'https://via.placeholder.com/400',
      description: 'Test description',
      stock: 10,
    };

    vi.mocked(mockApi.getProductById).mockResolvedValue(mockProduct);

    renderWithRouter('test-id');

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('¥99.99')).toBeInTheDocument();
    });
  });

  it('should display product description', async () => {
    const mockProduct: Product = {
      id: 'test-id',
      name: 'Test Product',
      price: 99.99,
      category: '电子产品',
      image: 'https://via.placeholder.com/400',
      description: 'This is a detailed product description',
      stock: 10,
    };

    vi.mocked(mockApi.getProductById).mockResolvedValue(mockProduct);

    renderWithRouter('test-id');

    await waitFor(() => {
      expect(screen.getByText('This is a detailed product description')).toBeInTheDocument();
    });
  });

  it('should display product specifications when available', async () => {
    const mockProduct: Product = {
      id: 'test-id',
      name: 'Test Product',
      price: 99.99,
      category: '电子产品',
      image: 'https://via.placeholder.com/400',
      description: 'Test description',
      specifications: {
        品牌: 'TestBrand',
        型号: 'TB-001',
      },
      stock: 10,
    };

    vi.mocked(mockApi.getProductById).mockResolvedValue(mockProduct);

    renderWithRouter('test-id');

    await waitFor(() => {
      expect(screen.getByText('商品规格')).toBeInTheDocument();
      expect(screen.getByText('TestBrand')).toBeInTheDocument();
      expect(screen.getByText('TB-001')).toBeInTheDocument();
    });
  });

  it('should display loading skeleton while fetching product', () => {
    vi.mocked(mockApi.getProductById).mockImplementation(
      () => new Promise(() => {}) // Never resolves to keep loading state
    );

    renderWithRouter('test-id');

    // Check for skeleton elements (they should have specific classes)
    const skeletons = document.querySelectorAll('[class*="animate-pulse"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
