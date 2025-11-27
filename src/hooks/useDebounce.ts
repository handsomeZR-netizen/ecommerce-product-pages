import { useState, useEffect } from 'react';

/**
 * 防抖 Hook
 * 延迟更新值直到用户停止输入一段时间
 *
 * @param value - 需要防抖的值
 * @param delay - 延迟时间（毫秒），默认 500ms
 * @returns 防抖后的值
 */
export const useDebounce = <T>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 设置定时器，在 delay 毫秒后更新防抖值
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 清理函数：如果 value 或 delay 变化，清除之前的定时器
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
