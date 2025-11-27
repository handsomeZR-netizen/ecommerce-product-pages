import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // 启用代码压缩
    minify: 'terser',
    terserOptions: {
      compress: {
        // 移除 console.log
        drop_console: true,
        // 移除 debugger
        drop_debugger: true,
      },
    },
    // 启用 CSS 代码分割
    cssCodeSplit: true,
    // 设置 chunk 大小警告限制（500kb）
    chunkSizeWarningLimit: 500,
    // 优化依赖打包
    rollupOptions: {
      output: {
        // 手动分割代码块
        manualChunks: {
          // React 核心库
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // UI 组件库
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-label',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-slider',
            '@radix-ui/react-slot',
            'vaul',
            'sonner',
          ],
          // 工具库
          'utils-vendor': ['clsx', 'lodash.debounce', 'tailwind-merge'],
          // 状态管理
          'state-vendor': ['zustand'],
          // Mock 数据
          'mock-vendor': ['mockjs'],
        },
        // 为 chunk 文件命名
        chunkFileNames: 'assets/js/[name]-[hash].js',
        // 为入口文件命名
        entryFileNames: 'assets/js/[name]-[hash].js',
        // 为资源文件命名
        assetFileNames: assetInfo => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(assetInfo.name || '')) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name || '')) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          if (ext === 'css') {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
    // 启用源码映射（生产环境可选）
    sourcemap: false,
    // 设置目标浏览器
    target: 'es2015',
    // 启用 Tree Shaking
    reportCompressedSize: true,
  },
  // 优化依赖预构建
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'zustand', 'clsx', 'lodash.debounce'],
  },
});
