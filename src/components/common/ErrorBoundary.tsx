import { Component, ReactNode } from 'react';
import { GlowButton } from './GlowButton';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * 错误边界组件
 * 捕获子组件树中的 JavaScript 错误，显示友好的错误页面
 *
 * 功能：
 * - 捕获渲染错误
 * - 显示友好的错误提示
 * - 提供重试机制
 *
 * 验证需求: Requirements 11.3
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 可以在这里记录错误到错误报告服务
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
          <div className="max-w-md w-full text-center space-y-6">
            {/* 错误图标 */}
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            {/* 错误标题 */}
            <h1 className="text-3xl font-bold text-gray-900">出错了</h1>

            {/* 错误描述 */}
            <p className="text-gray-600">抱歉，页面遇到了一些问题。请尝试刷新页面或返回首页。</p>

            {/* 错误详情（仅在开发环境显示） */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-4 p-4 bg-red-50 rounded-lg text-left">
                <p className="text-sm font-mono text-red-800 break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GlowButton onClick={this.handleReset} variant="primary">
                重试
              </GlowButton>
              <GlowButton onClick={() => (window.location.href = '/')} variant="secondary">
                返回首页
              </GlowButton>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
