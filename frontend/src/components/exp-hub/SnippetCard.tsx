'use client';

import { Copy, Eye, Heart, MessageSquare } from 'lucide-react';
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
      className={`group p-3 border-b border-[var(--border-color)] cursor-pointer transition-colors ${
        isSelected
          ? 'bg-violet-500/10 border-l-2 border-l-violet-400'
          : 'hover:bg-[var(--bg-surface-hover)]'
      }`}
    >
      <div className="flex items-start gap-2">
        <LanguageIcon language={snippet.language} className="mt-0.5 shrink-0" />

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-[var(--text-primary)] truncate">
            {snippet.title}
          </h4>

          {snippet.description && (
            <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mt-0.5">
              {snippet.description}
            </p>
          )}

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {snippet.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="text-[10px] px-1.5 py-0.5 bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-secondary)] rounded"
              >
                {tag.name}
              </span>
            ))}
            {snippet.tags.length > 3 && (
              <span className="text-[10px] text-[var(--text-muted)]">
                +{snippet.tags.length - 3}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="p-1.5 hover:bg-[var(--bg-surface-active)] rounded transition-colors opacity-60 hover:opacity-100 active:scale-90"
          title="Copy code"
        >
          <Copy className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
        </button>
      </div>

      <div className="flex items-center gap-3 mt-2 text-xs text-[var(--text-muted)]">
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
        {(snippet.commentCount ?? 0) > 0 && (
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            {snippet.commentCount}
          </span>
        )}
      </div>
    </div>
  );
}
