import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { FilterOptions } from '@/types';
import { CATEGORIES, PRICE_RANGE } from '@/constants';

interface ProductFilterProps {
  filters: FilterOptions;
  onFilterChange: (filters: Partial<FilterOptions>) => void;
  onReset: () => void;
}

// Filter content component extracted to avoid creating during render
const FilterContent: React.FC<{
  filters: FilterOptions;
  onFilterChange: (filters: Partial<FilterOptions>) => void;
  onReset: () => void;
}> = ({ filters, onFilterChange, onReset }) => (
  <div className="space-y-6">
    {/* 分类筛选 */}
    <div>
      <h3 className="font-semibold mb-3">分类</h3>
      <RadioGroup
        value={filters.category || '全部'}
        onValueChange={value => onFilterChange({ category: value === '全部' ? undefined : value })}
      >
        {CATEGORIES.map(category => (
          <div key={category} className="flex items-center space-x-2">
            <RadioGroupItem value={category} id={`category-${category}`} />
            <Label htmlFor={`category-${category}`} className="cursor-pointer">
              {category}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>

    {/* 价格区间 */}
    <div>
      <h3 className="font-semibold mb-3">价格区间</h3>
      <div className="space-y-4">
        <Slider
          min={PRICE_RANGE.MIN}
          max={PRICE_RANGE.MAX}
          step={PRICE_RANGE.STEP}
          value={filters.priceRange || [PRICE_RANGE.MIN, PRICE_RANGE.MAX]}
          onValueChange={value => onFilterChange({ priceRange: value as [number, number] })}
          className="w-full"
        />
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>¥{filters.priceRange?.[0] || PRICE_RANGE.MIN}</span>
          <span>¥{filters.priceRange?.[1] || PRICE_RANGE.MAX}</span>
        </div>
      </div>
    </div>

    {/* 关键词搜索 */}
    <div>
      <h3 className="font-semibold mb-3">搜索</h3>
      <Input
        type="text"
        placeholder="搜索商品名称或描述..."
        value={filters.keyword || ''}
        onChange={e => onFilterChange({ keyword: e.target.value })}
      />
    </div>

    {/* 重置按钮 */}
    <Button variant="outline" onClick={onReset} className="w-full focus:ring-2 focus:ring-blue-500">
      重置筛选
    </Button>
  </div>
);

export const ProductFilter: React.FC<ProductFilterProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isOpen, setIsOpen] = useState(false);

  // 移动端：使用抽屉
  if (isMobile) {
    return (
      <>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 z-40 rounded-full w-14 h-14 shadow-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="打开筛选"
        >
          <Filter className="h-6 w-6" />
        </Button>
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>筛选商品</DrawerTitle>
            </DrawerHeader>
            <div className="p-4 overflow-y-auto max-h-[70vh]">
              <FilterContent filters={filters} onFilterChange={onFilterChange} onReset={onReset} />
            </div>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  // 桌面端：使用侧边栏卡片
  return (
    <Card className="p-4">
      <FilterContent filters={filters} onFilterChange={onFilterChange} onReset={onReset} />
    </Card>
  );
};
