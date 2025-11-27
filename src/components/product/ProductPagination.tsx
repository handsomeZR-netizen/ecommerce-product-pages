import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PaginationState } from '@/types';

interface ProductPaginationProps {
  pagination: PaginationState;
  totalProducts: number;
  onPageChange: (page: number) => void;
}

export const ProductPagination: React.FC<ProductPaginationProps> = ({
  pagination,
  totalProducts,
  onPageChange,
}) => {
  const { currentPage, pageSize } = pagination;
  const totalPages = Math.ceil(totalProducts / pageSize);

  // 如果商品数量不足一页，隐藏分页控件
  if (totalProducts <= pageSize) {
    return null;
  }

  const handlePageChange = (page: number) => {
    onPageChange(page);
    // 滚动到页面顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 生成页码数组
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // 如果总页数小于等于最大可见页数，显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 否则显示部分页码和省略号
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* 上一页按钮 */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="上一页"
        className="focus:ring-2 focus:ring-blue-500"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* 页码按钮 */}
      {pageNumbers.map((page, index) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
              ...
            </span>
          );
        }

        return (
          <Button
            key={page}
            variant={currentPage === page ? 'default' : 'outline'}
            size="icon"
            onClick={() => handlePageChange(page as number)}
            className="w-10 h-10 focus:ring-2 focus:ring-blue-500"
            aria-label={`第 ${page} 页`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </Button>
        );
      })}

      {/* 下一页按钮 */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="下一页"
        className="focus:ring-2 focus:ring-blue-500"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
