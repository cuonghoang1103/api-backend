'use client';

// SearchAutocomplete — professional search for EXP_Hub.
// Typing shows a live dropdown of matching CATEGORIES (from the tree) and
// SNIPPETS (server full-text). Click a category to scope the list, or a snippet
// to open it as a tab. Enter still filters the list in place.

import { useCallback, useEffect, useRef, useState } from 'react';
import { Search, X, Loader2, CornerDownLeft } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { snippetsApi } from '@/lib/exp-hub-api';
import type { Snippet, SnippetCategory } from '@/types/exp-hub';
import { CategoryIcon } from './CategoryIcon';
import { LanguageIcon } from './LanguageIcon';

interface Props {
  categories: SnippetCategory[];
  onSelectCategory: (c: SnippetCategory) => void;
  onSelectSnippet: (s: Snippet) => void;
  onSearch?: (q: string) => void;
  className?: string;
}

// Flatten the category tree, keeping each node's depth for indentation.
function flatten(nodes: SnippetCategory[], depth = 0): Array<{ node: SnippetCategory; depth: number }> {
  const out: Array<{ node: SnippetCategory; depth: number }> = [];
  for (const n of nodes) {
    out.push({ node: n, depth });
    if (n.children?.length) out.push(...flatten(n.children, depth + 1));
  }
  return out;
}

export function SearchAutocomplete({ categories, onSelectCategory, onSelectSnippet, onSearch, className = '' }: Props) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const q = query.trim().toLowerCase();

  // Category matches — cheap, from the in-memory tree.
  const catMatches = q
    ? flatten(categories).filter(({ node }) => node.name.toLowerCase().includes(q)).slice(0, 6)
    : [];

  // Snippet matches — debounced server full-text search.
  useEffect(() => {
    if (!q) { setSnippets([]); setLoading(false); return; }
    setLoading(true);
    const id = setTimeout(() => {
      let alive = true;
      snippetsApi.search(query.trim(), 1, 6)
        .then((res) => { if (alive) setSnippets(res.data.data ?? []); })
        .catch(() => { if (alive) setSnippets([]); })
        .finally(() => { if (alive) setLoading(false); });
      return () => { alive = false; };
    }, 250);
    return () => clearTimeout(id);
  }, [q, query]);

  // Close on outside click.
  useEffect(() => {
    const onDown = (e: MouseEvent) => { if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const clear = useCallback(() => { setQuery(''); setSnippets([]); onSearch?.(''); }, [onSearch]);

  const pickCategory = (c: SnippetCategory) => { onSelectCategory(c); setOpen(false); setQuery(''); };
  const pickSnippet = (s: Snippet) => { onSelectSnippet(s); setOpen(false); setQuery(''); };

  const hasResults = catMatches.length > 0 || snippets.length > 0 || loading;

  return (
    <div ref={boxRef} className={`relative ${className}`}>
      <form
        onSubmit={(e) => { e.preventDefault(); if (q) { onSearch?.(query.trim()); setOpen(false); } }}
      >
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={t('expHub.searchPlaceholder')}
          className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] py-2 pl-10 pr-9 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-colors focus:border-violet-400/50 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
        />
        {query && (
          <button type="button" onClick={clear} className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-[var(--bg-surface-active)]" aria-label="Xoá">
            <X className="h-3.5 w-3.5 text-[var(--text-muted)]" />
          </button>
        )}
      </form>

      {open && q && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-[70vh] overflow-y-auto rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-2xl">
          {!hasResults && (
            <div className="px-4 py-6 text-center text-sm text-[var(--text-muted)]">{t('expHub.empty')}</div>
          )}

          {catMatches.length > 0 && (
            <div className="py-1">
              <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">{t('expHub.categories')}</div>
              {catMatches.map(({ node }) => (
                <button
                  key={`c-${node.id}`}
                  type="button"
                  onClick={() => pickCategory(node)}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-surface-hover)]"
                >
                  <CategoryIcon name={node.name} slug={node.slug} icon={node.icon} color={node.color} size={16} className="shrink-0" />
                  <span className="truncate">{node.name}</span>
                  {(node._count?.snippets ?? 0) > 0 && (
                    <span className="ml-auto shrink-0 rounded-full bg-[var(--bg-surface-active)] px-1.5 py-0.5 text-[11px] text-[var(--text-muted)]">{node._count?.snippets}</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {(snippets.length > 0 || loading) && (
            <div className="border-t border-[var(--border-color)] py-1">
              <div className="flex items-center gap-2 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Snippets {loading && <Loader2 className="h-3 w-3 animate-spin" />}
              </div>
              {snippets.map((s) => (
                <button
                  key={`s-${s.id}`}
                  type="button"
                  onClick={() => pickSnippet(s)}
                  className="flex w-full items-start gap-2.5 px-3 py-2 text-left transition-colors hover:bg-[var(--bg-surface-hover)]"
                >
                  <LanguageIcon language={s.language} size={16} className="mt-0.5 shrink-0" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-[var(--text-primary)]">{s.title}</span>
                    {s.description && <span className="block truncate text-xs text-[var(--text-muted)]">{s.description}</span>}
                  </span>
                </button>
              ))}
            </div>
          )}

          {q && (
            <button
              type="button"
              onClick={() => { onSearch?.(query.trim()); setOpen(false); }}
              className="flex w-full items-center gap-2 border-t border-[var(--border-color)] px-3 py-2.5 text-left text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface-hover)]"
            >
              <CornerDownLeft className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Lọc danh sách theo “<span className="font-medium text-[var(--text-primary)]">{query.trim()}</span>”</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
