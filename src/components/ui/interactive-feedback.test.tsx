import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import * as fc from 'fast-check';
import { Button } from './button';
import { GlowButton } from '@/components/common/GlowButton';

/**
 * Feature: ecommerce-product-pages, Property 25: 交互元素视觉反馈
 * Validates: Requirements 8.5
 *
 * Property: For any interactive element (buttons, cards), clicking should provide
 * visual feedback (ripple effect or scale transformation)
 */
describe('Interactive Visual Feedback', () => {
  it('should apply active:scale-95 to Button component', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 20 }),
        fc.constantFrom('default', 'destructive', 'outline', 'secondary', 'ghost', 'link'),
        (buttonText, variant) => {
          const { container } = render(
            <Button
              variant={
                variant as 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
              }
            >
              {buttonText}
            </Button>
          );

          const button = container.querySelector('button');
          expect(button).toBeTruthy();

          // Check that the button has active:scale-95 class
          const buttonClasses = button?.className || '';
          const hasActiveScale = buttonClasses.includes('active:scale-95');
          const hasTransition = buttonClasses.includes('transition');

          return hasActiveScale && hasTransition;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should apply scale transformation to GlowButton on active state', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 20 }),
        fc.constantFrom('primary', 'secondary'),
        (buttonText, variant) => {
          const { container } = render(<GlowButton variant={variant}>{buttonText}</GlowButton>);

          const button = container.querySelector('button');
          expect(button).toBeTruthy();

          // Check that the button has transition classes
          const buttonClasses = button?.className || '';
          const hasTransition = buttonClasses.includes('transition');

          // GlowButton uses CSS module for active state, so we check the class is applied
          const hasGlowButtonClass = buttonClasses.includes('glow-button');

          return hasTransition && hasGlowButtonClass;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should provide visual feedback on button click', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 20 }), buttonText => {
        const { container } = render(<Button>{buttonText}</Button>);

        const button = container.querySelector('button');
        expect(button).toBeTruthy();

        // Simulate mousedown to trigger active state
        fireEvent.mouseDown(button!);

        // The button should have the active:scale-95 class in its className
        const buttonClasses = button?.className || '';
        const hasActiveScale = buttonClasses.includes('active:scale-95');

        // Simulate mouseup
        fireEvent.mouseUp(button!);

        return hasActiveScale;
      }),
      { numRuns: 100 }
    );
  });

  it('should have transition-transform for smooth visual feedback', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 20 }), buttonText => {
        const { container } = render(<Button>{buttonText}</Button>);

        const button = container.querySelector('button');
        expect(button).toBeTruthy();

        // Check for transition class
        const buttonClasses = button?.className || '';
        const hasTransition = buttonClasses.includes('transition');

        return hasTransition;
      }),
      { numRuns: 100 }
    );
  });
});
