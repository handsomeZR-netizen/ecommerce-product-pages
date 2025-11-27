import { useState, useEffect } from 'react';

/**
 * 媒体查询 Hook
 * 监听窗口大小变化并返回匹配状态
 *
 * @param query - CSS 媒体查询字符串，例如 '(max-width: 768px)'
 * @returns 是否匹配媒体查询
 */
export const useMediaQuery = (query: string): boolean => {
  // Initialize with the current match state
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    // 创建媒体查询对象
    const media = window.matchMedia(query);

    // 监听媒体查询变化
    const listener = () => setMatches(media.matches);

    // 立即调用一次以确保状态同步
    listener();

    media.addEventListener('change', listener);

    // 清理函数：移除事件监听器
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};
