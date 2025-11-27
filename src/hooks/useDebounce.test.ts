import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import * as fc from 'fast-check';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * Feature: ecommerce-product-pages, Property 6: 搜索防抖延迟
   * Validates: Requirements 2.3, 10.3
   */
  it('should delay value update by specified delay time', () => {
    fc.assert(
      fc.property(
        fc.string(),
        fc.string(),
        fc.integer({ min: 100, max: 1000 }),
        (initialValue, newValue, delay) => {
          // 确保初始值和新值不同，以便测试防抖效果
          if (initialValue === newValue) return true;

          const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
            initialProps: { value: initialValue, delay },
          });

          // 初始值应该立即可用
          expect(result.current).toBe(initialValue);

          // 更新值
          rerender({ value: newValue, delay });

          // 在延迟时间之前，值不应该更新
          expect(result.current).toBe(initialValue);

          // 快进到延迟时间之前（delay - 1ms）
          act(() => {
            vi.advanceTimersByTime(delay - 1);
          });
          expect(result.current).toBe(initialValue);

          // 快进到延迟时间
          act(() => {
            vi.advanceTimersByTime(1);
          });
          expect(result.current).toBe(newValue);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should use default delay of 500ms when not specified', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: 'initial' },
    });

    expect(result.current).toBe('initial');

    rerender({ value: 'updated' });

    // 在 500ms 之前不应该更新
    act(() => {
      vi.advanceTimersByTime(499);
    });
    expect(result.current).toBe('initial');

    // 在 500ms 时应该更新
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe('updated');
  });

  it('should cancel previous timeout when value changes rapidly', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'first' },
    });

    expect(result.current).toBe('first');

    // 快速连续更新值
    rerender({ value: 'second' });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    rerender({ value: 'third' });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    rerender({ value: 'fourth' });

    // 此时应该还是初始值
    expect(result.current).toBe('first');

    // 等待完整的 500ms
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // 应该只更新到最后一个值
    expect(result.current).toBe('fourth');
  });
});
