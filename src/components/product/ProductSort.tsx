import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { SortOption } from '@/types';

interface ProductSortProps {
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'default', label: '默认排序' },
  { value: 'price-asc', label: '价格从低到高' },
  { value: 'price-desc', label: '价格从高到低' },
  { value: 'rating', label: '评分最高' },
];

export const ProductSort: React.FC<ProductSortProps> = ({ sortOption, onSortChange }) => {
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium text-gray-700">排序方式:</span>
      <RadioGroup
        value={sortOption}
        onValueChange={value => onSortChange(value as SortOption)}
        className="flex flex-wrap gap-4"
      >
        {SORT_OPTIONS.map(option => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={`sort-${option.value}`} />
            <Label htmlFor={`sort-${option.value}`} className="cursor-pointer text-sm">
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};
