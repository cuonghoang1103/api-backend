'use client';

import { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  initialQuery?: string;
  placeholder?: string;
  className?: string;
  /** Inline search: called with the query on submit (and '' on clear).
      When provided, the bar filters in place instead of navigating to
      a dedicated /exp-hub/search page (which doesn't exist). */
  onSearch?: (query: string) => void;
}

export function SearchBar({ initialQuery = '', placeholder = 'Search snippets...', className = '', onSearch }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const q = query.trim();
      if (onSearch) {
        onSearch(q);
        return;
      }
      if (q) {
        router.push(`/exp-hub?q=${encodeURIComponent(q)}`);
      }
    },
    [query, router, onSearch]
  );

  const handleClear = () => {
    setQuery('');
    onSearch?.('');
  };

  return (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2 bg-white/5 border border-white/10 text-slate-200 placeholder:text-slate-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-400/50 transition-colors"
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded"
        >
          <X className="w-3.5 h-3.5 text-slate-400" />
        </button>
      )}
    </form>
  );
}
