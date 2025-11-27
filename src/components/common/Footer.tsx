import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">关于我们</h3>
            <p className="text-gray-600 text-sm">
              电商平台致力于为用户提供优质的购物体验，精选商品，品质保证。
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">快速链接</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
                >
                  首页
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
                >
                  关于我们
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
                >
                  联系我们
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">客户服务</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/help"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
                >
                  帮助中心
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
                >
                  退换货政策
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
                >
                  隐私政策
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-gray-600 text-sm">
          <p>&copy; {currentYear} 电商平台. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  );
};
