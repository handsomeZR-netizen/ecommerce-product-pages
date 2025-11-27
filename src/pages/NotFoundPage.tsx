import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/common/MainLayout';
import { GlowButton } from '@/components/common/GlowButton';

/**
 * 404 页面
 *
 * 功能：
 * - 显示友好的错误提示和插图
 * - 提供"返回首页"按钮（使用 GlowButton）
 * - 使用 MainLayout 包裹
 *
 * 验证需求: Requirements 5.3, 11.1
 */
export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        {/* 404 插图 */}
        <div className="w-64 h-64 mb-8 opacity-50">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* 大圆圈 */}
            <circle
              cx="100"
              cy="100"
              r="80"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-400"
            />

            {/* 左眼 (X) */}
            <g className="text-gray-600">
              <line
                x1="70"
                y1="80"
                x2="90"
                y2="100"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <line
                x1="90"
                y1="80"
                x2="70"
                y2="100"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </g>

            {/* 右眼 (X) */}
            <g className="text-gray-600">
              <line
                x1="110"
                y1="80"
                x2="130"
                y2="100"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <line
                x1="130"
                y1="80"
                x2="110"
                y2="100"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </g>

            {/* 悲伤的嘴 */}
            <path
              d="M 70 130 Q 100 120 130 130"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              className="text-gray-600"
            />
          </svg>
        </div>

        {/* 404 标题 */}
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>

        {/* 错误提示 */}
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">页面未找到</h2>

        {/* 描述 */}
        <p className="text-gray-600 mb-8 text-center max-w-md">
          抱歉，您访问的页面不存在或已被移除。请检查 URL 是否正确，或返回首页继续浏览。
        </p>

        {/* 返回首页按钮 */}
        <GlowButton variant="primary" onClick={handleGoHome}>
          返回首页
        </GlowButton>

        {/* 额外的帮助链接 */}
        <div className="mt-8 flex gap-6 text-sm text-gray-500">
          <button onClick={() => navigate(-1)} className="hover:text-blue-600 transition-colors">
            返回上一页
          </button>
          <span className="text-gray-300">|</span>
          <button onClick={handleGoHome} className="hover:text-blue-600 transition-colors">
            浏览商品
          </button>
        </div>
      </div>
    </MainLayout>
  );
};
