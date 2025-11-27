import React from 'react';
import { ChevronDown } from 'lucide-react';
import useStore from '../../store/useStore';

const SortDropdown = () => {
  const { sortBy, setSortBy } = useStore();

  return (
    <div className="flex items-center gap-3 text-sm group cursor-pointer relative">
      <span className="text-gray-400 uppercase tracking-wider text-xs">排序方式:</span>
      <div className="relative">
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          className="appearance-none bg-transparent border-b border-gray-300 py-1 pr-8 pl-1 focus:outline-none focus:border-black transition-colors cursor-pointer text-gray-800 font-medium z-10 relative"
        >
          <option value="default">默认推荐</option>
          <option value="priceAsc">价格从低到高</option>
          <option value="priceDesc">价格从高到低</option>
          <option value="sales">销量最高</option>
          <option value="rating">评分最高</option>
        </select>
        <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
      </div>
    </div>
  );
};

export default SortDropdown;
