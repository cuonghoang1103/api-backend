'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const showEllipsisStart = currentPage > 3;
    const showEllipsisEnd = currentPage < totalPages - 2;

    if (!showEllipsisStart && !showEllipsisEnd) {
      for (let i = 1; i <= Math.min(totalPages, 5); i++) {
        pages.push(i);
      }
    } else if (showEllipsisStart && !showEllipsisEnd) {
      pages.push(1, '...');
      for (let i = Math.max(1, totalPages - 4); i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (!showEllipsisStart && showEllipsisEnd) {
      for (let i = 1; i <= Math.min(5, totalPages); i++) {
        pages.push(i);
      }
      pages.push('...');
    } else {
      pages.push(1);
      if (currentPage > 4) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 3) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <nav className="flex items-center justify-center gap-2 mt-12">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`
          p-2 rounded-xl border transition-all duration-300
          ${currentPage === 1
            ? 'border-darkborder text-text-muted cursor-not-allowed opacity-50'
            : 'border-darkborder text-text-secondary hover:border-neon-violet hover:text-neon-violet hover:bg-neon-violet/10'
          }
        `}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {getVisiblePages().map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="px-3 py-2 text-text-muted">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`
                min-w-[40px] h-10 px-3 rounded-xl font-medium text-sm transition-all duration-300
                ${currentPage === page
                  ? 'bg-gradient-to-r from-neon-indigo to-neon-violet text-white shadow-lg shadow-neon-violet/30'
                  : 'text-text-secondary hover:bg-darkcard hover:text-text-primary border border-transparent hover:border-darkborder'
                }
              `}
            >
              {page}
            </button>
          )
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`
          p-2 rounded-xl border transition-all duration-300
          ${currentPage === totalPages
            ? 'border-darkborder text-text-muted cursor-not-allowed opacity-50'
            : 'border-darkborder text-text-secondary hover:border-neon-violet hover:text-neon-violet hover:bg-neon-violet/10'
          }
        `}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
  );
}
