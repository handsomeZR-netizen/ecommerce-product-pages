import { describe, it, expect } from 'vitest';
import { render, act } from '@testing-library/react';
import * as fc from 'fast-check';
import { ImageWithFallback } from './ImageWithFallback';

/**
 * Feature: ecommerce-product-pages, Property 2: 图片容错处理
 * Validates: Requirements 1.3
 */
describe('ImageWithFallback - Property 2: 图片容错处理', () => {
  it('should display fallback image when image fails to load', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 100 }),
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.webUrl(),
        (invalidSrc, altText, fallbackUrl) => {
          // Use an invalid image URL that will trigger onError
          const { container } = render(
            <ImageWithFallback
              src={`invalid-url-${invalidSrc}`}
              alt={altText}
              fallback={fallbackUrl}
            />
          );

          // Get the img element
          const img = container.querySelector('img');
          expect(img).toBeTruthy();

          // Simulate error event wrapped in act
          if (img) {
            act(() => {
              img.dispatchEvent(new Event('error'));
            });
          }

          // After error, the src should be the fallback
          return img?.getAttribute('src') === fallbackUrl;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: ecommerce-product-pages, Property 26: 图片懒加载
   * Validates: Requirements 10.4
   *
   * 对于任何不在视口内的图片，应该延迟加载直到图片即将进入视口
   * 验证所有图片都设置了 loading="lazy" 属性以启用原生懒加载
   */
  it('Property 26: should implement lazy loading for all images', () => {
    fc.assert(
      fc.property(
        fc.webUrl(),
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.option(fc.webUrl(), { nil: undefined }),
        fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: undefined }),
        (src, altText, fallback, className) => {
          const { container } = render(
            <ImageWithFallback src={src} alt={altText} fallback={fallback} className={className} />
          );

          const img = container.querySelector('img');

          // Verify the image element exists
          if (!img) return false;

          // Verify lazy loading attribute is set
          const hasLazyLoading = img.getAttribute('loading') === 'lazy';

          // Verify the image has the correct src
          const hasSrc = img.getAttribute('src') === src;

          // Verify the image has the correct alt text
          const hasAlt = img.getAttribute('alt') === altText;

          return hasLazyLoading && hasSrc && hasAlt;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should render skeleton while loading', async () => {
    fc.assert(
      fc.property(fc.webUrl(), fc.string({ minLength: 1, maxLength: 50 }), (src, altText) => {
        const { container } = render(<ImageWithFallback src={src} alt={altText} />);

        // Check if skeleton is present initially
        const skeleton = container.querySelector('.absolute.inset-0');
        return skeleton !== null;
      }),
      { numRuns: 100 }
    );
  });
});
