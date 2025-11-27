import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { toast } from 'sonner';
import { useProducts } from './useProducts';
import { mockApi } from '@/services/mockApi';

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock mockApi
vi.mock('@/services/mockApi', () => ({
  mockApi: {
    getProducts: vi.fn(),
  },
}));

describe('useProducts - Toast Notifications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Feature: ecommerce-product-pages, Property 17: Toast 通知一致性
   * Validates: Requirements 6.2, 11.2, 11.3
   *
   * 对于任何用户操作（成功或失败），系统应该显示相应的 Toast 通知而不是使用 alert
   *
   * 此测试验证当 API 调用失败时，系统显示错误 Toast 通知
   */
  it('should display error toast when product loading fails', async () => {
    // Mock API 失败
    vi.mocked(mockApi.getProducts).mockRejectedValue(new Error('Network error'));

    renderHook(() => useProducts());

    // 等待异步操作完成
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledTimes(1);
    });

    // 验证错误消息和重试按钮
    expect(toast.error).toHaveBeenCalledWith(
      expect.stringContaining('加载商品失败'),
      expect.objectContaining({
        action: expect.objectContaining({
          label: '重试',
          onClick: expect.any(Function),
        }),
      })
    );
  });

  it('should never use window.alert for error notifications', async () => {
    // Mock window.alert if it exists
    const originalAlert = window.alert;
    const alertSpy = vi.fn();
    window.alert = alertSpy;

    // Mock API 失败
    vi.mocked(mockApi.getProducts).mockRejectedValue(new Error('Network error'));

    renderHook(() => useProducts());

    // 等待异步操作完成
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });

    // 验证从未调用 window.alert
    expect(alertSpy).not.toHaveBeenCalled();

    // 但应该调用了 toast.error
    expect(toast.error).toHaveBeenCalled();

    // Restore
    window.alert = originalAlert;
  });

  it('should use toast for all user feedback instead of alert', async () => {
    // Mock window.alert and window.confirm if they exist
    const originalAlert = window.alert;
    const originalConfirm = window.confirm;
    const alertSpy = vi.fn();
    const confirmSpy = vi.fn(() => true);
    window.alert = alertSpy;
    window.confirm = confirmSpy;

    // Mock API 失败
    vi.mocked(mockApi.getProducts).mockRejectedValue(new Error('Test error'));

    renderHook(() => useProducts());

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });

    // 验证没有使用原生浏览器对话框
    expect(alertSpy).not.toHaveBeenCalled();
    expect(confirmSpy).not.toHaveBeenCalled();

    // 验证使用了 toast 系统
    expect(toast.error).toHaveBeenCalled();

    // Restore
    window.alert = originalAlert;
    window.confirm = originalConfirm;
  });
});
