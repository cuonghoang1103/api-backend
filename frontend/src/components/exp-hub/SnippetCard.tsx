'use client';

import { Copy, Eye, Heart } from 'lucide-react';
import { LanguageIcon } from './LanguageIcon';
import type { Snippet } from '@/types/exp-hub';

interface SnippetCardProps {
  snippet: Snippet;
  isSelected?: boolean;
  onClick: () => void;
  onCopy?: () => void;
}

export function SnippetCard({ snippet, isSelected, onClick, onCopy }: SnippetCardProps) {
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCopy?.();
  };

  return (
    <div
      onClick={onClick}
      className={`group p-3 border-b border-white/5 cursor-pointer transition-colors ${
        isSelected
          ? 'bg-violet-500/10 border-l-2 border-l-violet-400'
          : 'hover:bg-white/[0.04]'
      }`}
    >
      <div className="flex items-start gap-2">
        <LanguageIcon language={snippet.language} className="mt-0.5 shrink-0" />

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-slate-200 truncate">
            {snippet.title}
          </h4>

          {snippet.description && (
            <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">
              {snippet.description}
            </p>
          )}

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {snippet.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="text-[10px] px-1.5 py-0.5 bg-white/5 border border-white/10 text-slate-400 rounded"
              >
                {tag.name}
              </span>
            ))}
            {snippet.tags.length > 3 && (
              <span className="text-[10px] text-slate-500">
                +{snippet.tags.length - 3}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/10 rounded transition-opacity"
          title="Copy code"
        >
          <Copy className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <Copy className="w-3 h-3" />
          {snippet.copyCount}
        </span>
        <span className="flex items-center gap-1">
          <Eye className="w-3 h-3" />
          {snippet.viewCount}
        </span>
        {snippet.upvoteCount > 0 && (
          <span className="flex items-center gap-1">
            <Heart className="w-3 h-3" />
            {snippet.upvoteCount}
          </span>
        )}
      </div>
    </div>
  );
}
