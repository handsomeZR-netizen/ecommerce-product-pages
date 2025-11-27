import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/common/MainLayout';
import { GlowButton } from '@/components/common/GlowButton';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/hooks/useCart';
import { mockApi } from '@/services/mockApi';
import type { Product } from '@/types';

/**
 * 商品详情页骨架屏
 */
const ProductDetailSkeleton: React.FC = () => {
  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      role="status"
      aria-busy="true"
      aria-label="正在加载商品详情"
    >
      {/* 图片区域骨架屏 */}
      <div className="space-y-4">
        <Skeleton className="w-full h-96 rounded-lg" aria-hidden="true" />
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="w-full h-20 rounded-md" aria-hidden="true" />
          ))}
        </div>
      </div>

      {/* 信息区域骨架屏 */}
      <div className="space-y-6">
        <Skeleton className="h-10 w-3/4" aria-hidden="true" />
        <Skeleton className="h-8 w-1/2" aria-hidden="true" />
        <Skeleton className="h-6 w-1/4" aria-hidden="true" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" aria-hidden="true" />
          <Skeleton className="h-4 w-full" aria-hidden="true" />
          <Skeleton className="h-4 w-3/4" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" aria-hidden="true" />
          <Skeleton className="h-4 w-full" aria-hidden="true" />
          <Skeleton className="h-4 w-full" aria-hidden="true" />
          <Skeleton className="h-4 w-2/3" aria-hidden="true" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-14 flex-1" aria-hidden="true" />
          <Skeleton className="h-14 flex-1" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
};

/**
 * 商品详情页
 *
 * 功能：
 * - 根据 URL 参数获取商品 ID
 * - 调用 mockApi.getProductById 获取商品详情
 * - 显示商品图片轮播、名称、价格、描述、规格
 * - 提供"加入购物车"和"立即购买"按钮
 * - 商品不存在时重定向到 404 页面
 * - 加载时显示骨架屏
 *
 * 验证需求: Requirements 5.1, 5.2, 5.3, 5.4
 */
export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // 获取商品详情
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        navigate('/404');
        return;
      }

      setIsLoading(true);
      try {
        const data = await mockApi.getProductById(id);

        if (!data) {
          // 商品不存在，重定向到 404 页面
          navigate('/404');
          return;
        }

        setProduct(data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
        navigate('/404');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  // 处理加入购物车
  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
    }
  };

  // 处理立即购买
  const handleBuyNow = () => {
    if (product) {
      addToCart(product);
      // TODO: 在实际应用中，这里应该导航到结算页面
      console.log('立即购买:', product.name);
    }
  };

  // 加载状态
  if (isLoading) {
    return (
      <MainLayout>
        <div role="status" aria-live="polite" aria-label="加载商品详情">
          <ProductDetailSkeleton />
        </div>
      </MainLayout>
    );
  }

  // 商品不存在（理论上不会到达这里，因为已经重定向）
  if (!product) {
    return null;
  }

  // 获取当前选中的图片
  const currentImage =
    product.images && product.images.length > 0
      ? product.images[selectedImageIndex]
      : product.image;

  return (
    <MainLayout>
      <article className="max-w-7xl mx-auto">
        {/* 返回按钮 */}
        <nav aria-label="面包屑导航">
          <button
            onClick={() => navigate('/')}
            className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2 transition-colors"
            aria-label="返回商品列表"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            返回商品列表
          </button>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* 左侧：图片区域 */}
          <section className="space-y-3 sm:space-y-4" aria-label="商品图片">
            {/* 主图 */}
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              <ImageWithFallback
                src={currentImage}
                alt={`${product.name} - ${product.category}`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* 缩略图 */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2" role="list" aria-label="商品图片缩略图">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-md overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? 'border-blue-600 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                    aria-label={`查看图片 ${index + 1}`}
                    aria-pressed={selectedImageIndex === index}
                    role="listitem"
                  >
                    <ImageWithFallback
                      src={image}
                      alt={`${product.name} - 缩略图 ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* 右侧：商品信息 */}
          <section className="space-y-4 sm:space-y-6" aria-label="商品详细信息">
            {/* 商品名称 */}
            <header>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{product.name}</h1>
            </header>

            {/* 价格 */}
            <div className="flex items-baseline gap-3 sm:gap-4">
              <span
                className="text-3xl sm:text-4xl font-bold text-red-600"
                aria-label={`当前价格 ${product.price.toFixed(2)} 元`}
              >
                ¥{product.price.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span
                  className="text-lg sm:text-xl text-gray-500 line-through"
                  aria-label={`原价 ${product.originalPrice.toFixed(2)} 元`}
                >
                  ¥{product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* 评分和库存 */}
            <div className="flex items-center gap-6 text-sm text-gray-600">
              {product.rating && (
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500" aria-hidden="true">
                    ★
                  </span>
                  <span aria-label={`评分 ${product.rating.toFixed(1)} 分`}>
                    {product.rating.toFixed(1)}
                  </span>
                  {product.reviews && (
                    <span className="text-gray-400">({product.reviews} 评价)</span>
                  )}
                </div>
              )}
              <div>
                库存: <span className="font-medium">{product.stock}</span> 件
              </div>
            </div>

            {/* 商品描述 */}
            <section className="border-t pt-6">
              <h2 className="text-lg font-semibold mb-3">商品描述</h2>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </section>

            {/* 商品规格 */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <section className="border-t pt-6">
                <h2 className="text-lg font-semibold mb-3">商品规格</h2>
                <dl className="space-y-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex">
                      <dt className="w-24 text-gray-600">{key}:</dt>
                      <dd className="flex-1 text-gray-900">{value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            {/* 操作按钮 */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
              <GlowButton variant="secondary" onClick={handleAddToCart} className="flex-1">
                加入购物车
              </GlowButton>
              <GlowButton variant="primary" onClick={handleBuyNow} className="flex-1">
                立即购买
              </GlowButton>
            </div>
          </section>
        </div>
      </article>
    </MainLayout>
  );
};
