import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-16">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 text-gray-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={20} />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 flex items-center justify-center text-sm transition-all duration-300
            ${currentPage === page 
              ? 'bg-black text-white font-semibold' 
              : 'text-gray-600 hover:text-black hover:bg-gray-100'}`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 text-gray-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default Pagination;
