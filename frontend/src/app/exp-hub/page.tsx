'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2, ChevronRight, ChevronLeft, ExternalLink, Bookmark, Heart, History, BookmarkCheck, X, Info, Play, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';
import { FolderTree } from '@/components/exp-hub/FolderTree';
import { SnippetCard } from '@/components/exp-hub/SnippetCard';
import { CodeViewer } from '@/components/exp-hub/CodeViewer';
import { SnippetCodeTabs } from '@/components/exp-hub/SnippetCodeTabs';
import { SearchBar } from '@/components/exp-hub/SearchBar';
import { FilterPanel } from '@/components/exp-hub/FilterPanel';
import { snippetsApi, snippetCategoriesApi, snippetTagsApi, snippetStatsApi, snippetBookmarksApi } from '@/lib/exp-hub-api';
import { LanguageBadge } from '@/components/exp-hub/LanguageIcon';
import type { Snippet, SnippetCategory, SnippetTag, SnippetFilters, SnippetVersion } from '@/types/exp-hub';

export default function ExpHubPage() {
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<SnippetCategory[]>([]);
  const [tags, setTags] = useState<SnippetTag[]>([]);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>();
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'upvotes'>('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<{ totalSnippets: number } | null>(null);
  // Inline full-text search (?q= supported for shared links)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') ?? '');
  // Saved-only view: middle column shows the bookmark list
  const [showSaved, setShowSaved] = useState(false);
  const [savedSnippets, setSavedSnippets] = useState<Snippet[]>([]);
  const [savedLoading, setSavedLoading] = useState(false);
  // Full detail for the selected snippet — the LIST payload has no
  // variables/hasUpvoted/hasBookmarked, so we fetch the full record
  // on selection (this also counts the view server-side).
  const [detail, setDetail] = useState<Snippet | null>(null);
  const [voteBusy, setVoteBusy] = useState(false);
  // Version history (lazy-loaded on expand)
  const [showVersions, setShowVersions] = useState(false);
  const [versions, setVersions] = useState<SnippetVersion[] | null>(null);
  // Explanation modal
  const [showExplanation, setShowExplanation] = useState(false);
  // Left sidebar (FolderTree) collapse — persisted to localStorage so the
  // user keeps their preference across page reloads.
  const [folderTreeOpen, setFolderTreeOpen] = useState(true);

  const languages = [...new Set(snippets.filter((s) => s.language).map((s) => s.language))].slice(0, 10);

  // Fetch categories
  useEffect(() => {
    snippetCategoriesApi.getAll()
      .then((res) => setCategories(res.data.data || []))
      .catch(console.error);
  }, []);

  // Fetch tags
  useEffect(() => {
    snippetTagsApi.getAll()
      .then((res) => setTags(res.data.data || []))
      .catch(console.error);
  }, []);

  // Fetch stats
  useEffect(() => {
    snippetStatsApi.getPublic()
      .then((res) => setStats(res.data.data))
      .catch(console.error);
  }, []);

  // Restore + persist the FolderTree sidebar open/closed state
  useEffect(() => {
    try {
      const saved = localStorage.getItem('exp-hub-folder-tree-open');
      if (saved !== null) setFolderTreeOpen(saved !== 'false');
    } catch { /* ignore */ }
  }, []);
  useEffect(() => {
    try { localStorage.setItem('exp-hub-folder-tree-open', String(folderTreeOpen)); } catch { /* ignore */ }
  }, [folderTreeOpen]);

  // Fetch snippets
  const fetchSnippets = useCallback(async () => {
    setIsLoading(true);
    try {
      const filters: SnippetFilters = {
        categoryId: selectedCategoryId,
        tagIds: selectedTags.length > 0 ? selectedTags : undefined,
        language: selectedLanguage,
        search: searchQuery || undefined,
        sort: sortBy,
        page,
        limit: 20,
      };
      const res = await snippetsApi.getList(filters);
      setSnippets(res.data.data || []);
      setTotalPages(res.data.pagination.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategoryId, selectedTags, selectedLanguage, searchQuery, sortBy, page]);

  useEffect(() => {
    fetchSnippets();
  }, [fetchSnippets]);

  // Select first snippet when list changes
  useEffect(() => {
    if (snippets.length > 0 && !selectedSnippet) {
      setSelectedSnippet(snippets[0]);
    }
  }, [snippets, selectedSnippet]);

  // Fetch the FULL record when a snippet is selected — the list payload
  // has no variables / hasUpvoted / hasBookmarked, and the detail
  // endpoint also increments the view counter.
  useEffect(() => {
    if (!selectedSnippet) { setDetail(null); return; }
    let cancelled = false;
    setShowVersions(false);
    setVersions(null);
    snippetsApi.getById(selectedSnippet.id)
      .then((res) => { if (!cancelled) setDetail(res.data.data); })
      .catch(() => { if (!cancelled) setDetail(selectedSnippet); });
    return () => { cancelled = true; };
  }, [selectedSnippet]);

  // Saved-only view: load bookmarks when toggled on
  useEffect(() => {
    if (!showSaved) return;
    let cancelled = false;
    setSavedLoading(true);
    snippetBookmarksApi.getAll()
      .then((res) => { if (!cancelled) setSavedSnippets(res.data.data.bookmarks ?? []); })
      .catch(() => { if (!cancelled) setSavedSnippets([]); })
      .finally(() => { if (!cancelled) setSavedLoading(false); });
    return () => { cancelled = true; };
  }, [showSaved]);

  const handleToggleUpvote = async () => {
    if (!detail || voteBusy) return;
    setVoteBusy(true);
    try {
      const res = await snippetsApi.toggleUpvote(detail.id);
      const upvoted = res.data.data.upvoted;
      setDetail({
        ...detail,
        hasUpvoted: upvoted,
        upvoteCount: Math.max(0, detail.upvoteCount + (upvoted ? 1 : -1)),
      });
    } catch {
      toast.error('Không vote được, thử lại sau');
    } finally {
      setVoteBusy(false);
    }
  };

  const handleToggleBookmark = async () => {
    if (!detail || voteBusy) return;
    setVoteBusy(true);
    try {
      const res = await snippetsApi.toggleBookmark(detail.id);
      const bookmarked = res.data.data.bookmarked;
      setDetail({ ...detail, hasBookmarked: bookmarked });
      toast.success(bookmarked ? 'Đã lưu snippet' : 'Đã bỏ lưu');
      // Keep the saved list in sync if it's open
      if (showSaved) {
        if (bookmarked) setSavedSnippets((prev) => [detail, ...prev.filter(s => s.id !== detail.id)]);
        else setSavedSnippets((prev) => prev.filter(s => s.id !== detail.id));
      }
    } catch {
      toast.error('Không lưu được, thử lại sau');
    } finally {
      setVoteBusy(false);
    }
  };

  const handleToggleVersions = async () => {
    const next = !showVersions;
    setShowVersions(next);
    if (next && versions == null && detail) {
      try {
        const res = await snippetsApi.getVersions(detail.id);
        setVersions(res.data.data ?? []);
      } catch {
        setVersions([]);
      }
    }
  };

  const handleCategorySelect = (category: SnippetCategory | null) => {
    setSelectedCategoryId(category?.id);
    setSelectedSnippet(null);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSelectedTags([]);
    setSelectedLanguage(undefined);
    setPage(1);
  };

  const handleSnippetClick = (snippet: Snippet) => {
    setSelectedSnippet(snippet);
  };

  const handleCopySnippet = async (snippet: Snippet) => {
    await navigator.clipboard.writeText(snippet.code);
  };

  // Helper to convert YouTube URL to embed URL
  const getYouTubeEmbedUrl = (url: string): string => {
    if (!url) return '';
    // Already embed URL
    if (url.includes('youtube.com/embed/')) return url;
    // Short URL youtu.be
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
    // Standard watch URL
    const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
    return url;
  };

  const getBreadcrumbs = (): Array<{ label: string; id?: number }> => {
    const crumbs: Array<{ label: string; id?: number }> = [{ label: 'All Snippets' }];
    if (selectedCategoryId) {
      const findCategory = (cats: SnippetCategory[], targetId: number): SnippetCategory | null => {
        for (const cat of cats) {
          if (cat.id === targetId) return cat;
          if (cat.children) {
            const found = findCategory(cat.children, targetId);
            if (found) return found;
          }
        }
        return null;
      };
      const cat = findCategory(categories, selectedCategoryId);
      if (cat) crumbs.push({ label: cat.name, id: cat.id });
    }
    return crumbs;
  };

  return (
    <div className="relative flex flex-col h-[calc(100dvh-var(--app-chrome-bottom))] pt-16 sm:pt-20 overflow-hidden text-slate-200 bg-[#0d1120]">
      {/* ── Ambient dark background (sits behind everything, never over
          text/code — pointer-events-none, low opacity). ── */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(160deg, #0d1120 0%, #111832 55%, #0b0f1e 100%)' }}
        />
        {/* faint grid */}
        <div
          className="absolute inset-0 opacity-[0.25]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.06) 1px, transparent 1px)',
            backgroundSize: '46px 46px',
          }}
        />
        {/* drifting neon blobs */}
        <div
          className="exphub-blob-a absolute -top-32 -left-24 h-[42rem] w-[42rem] rounded-full opacity-[0.16]"
          style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 62%)' }}
        />
        <div
          className="exphub-blob-b absolute -bottom-40 -right-28 h-[46rem] w-[46rem] rounded-full opacity-[0.14]"
          style={{ background: 'radial-gradient(circle, #22d3ee 0%, transparent 62%)' }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#0d1120]/80 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-300 bg-clip-text text-transparent">
            EXP_Hub
          </h1>
          {stats && (
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-medium text-slate-400">
              {stats.totalSnippets} snippets
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <SearchBar
            className="w-80"
            initialQuery={searchQuery}
            onSearch={(q) => { setSearchQuery(q); setPage(1); setSelectedSnippet(null); }}
          />
          <button
            onClick={() => setShowSaved((v) => !v)}
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-colors ${
              showSaved
                ? 'bg-violet-500/20 border-violet-400/50 text-violet-200 shadow-[0_0_18px_rgba(139,92,246,0.35)]'
                : 'border-white/10 text-slate-400 hover:bg-white/5 hover:text-slate-200'
            }`}
            title="Snippets đã lưu"
          >
            <BookmarkCheck className="w-4 h-4" />
            Đã lưu
          </button>
        </div>
      </header>

      {/* Main Content — stacks vertically on mobile so all three panels are
          reachable (no horizontal overflow), side-by-side columns on ≥lg. */}
      <div className="relative z-10 flex flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
        {/* Left Sidebar - Folder Tree (collapsible).
            Mobile: collapses into the top stacked row.
            Desktop (≥lg): width animates between 288px (open) and 44px (closed)
            via inline width — the FolderTree itself hides when closed. */}
        <aside
          className={`relative shrink-0 border-b border-white/10 bg-white/[0.02] lg:border-b-0 lg:border-r ${
            folderTreeOpen ? 'lg:w-72' : 'lg:w-11'
          }`}
        >
          <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
            <span
              className={`flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-300 transition-opacity ${
                folderTreeOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <FolderOpen className="w-4 h-4 text-violet-400" />
              Categories
            </span>
            <button
              type="button"
              onClick={() => setFolderTreeOpen((v) => !v)}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/10 hover:text-slate-100"
              title={folderTreeOpen ? 'Ẩn Categories' : 'Hiện Categories'}
              aria-label={folderTreeOpen ? 'Ẩn sidebar Categories' : 'Hiện sidebar Categories'}
            >
              {folderTreeOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
          {/* FolderTree — render normally but hide when collapsed so the
              toggle button above stays the only control visible. */}
          <div
            className={`max-h-52 overflow-y-auto lg:max-h-none ${
              folderTreeOpen ? '' : 'hidden'
            }`}
          >
            <FolderTree
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={handleCategorySelect}
            />
          </div>
          {/* Floating toggle — visible when sidebar is collapsed (desktop only)
              so users can re-open it from the icon-only strip. */}
          {!folderTreeOpen && (
            <button
              type="button"
              onClick={() => setFolderTreeOpen(true)}
              className="absolute inset-0 hidden lg:flex items-center justify-center text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-colors"
              title="Hiện Categories"
              aria-label="Hiện sidebar Categories"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </aside>

        {/* Middle Column - Snippet List */}
        <div className="flex w-full shrink-0 flex-col border-b border-white/10 bg-white/[0.02] lg:w-96 lg:border-b-0 lg:border-r">
          {/* Filters */}
          <div className="p-3 border-b border-white/10 space-y-3">
            <FilterPanel
              tags={tags}
              languages={languages}
              selectedTags={selectedTags}
              selectedLanguage={selectedLanguage}
              onTagsChange={setSelectedTags}
              onLanguageChange={setSelectedLanguage}
              onClear={handleClearFilters}
            />

            {/* Sort */}
            <div className="flex items-center justify-between">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'popular' | 'newest' | 'upvotes')}
                className="text-sm px-2 py-1 bg-white/5 border border-white/10 text-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-violet-500/40 [&>option]:bg-[#131a2e] [&>option]:text-slate-200"
              >
                <option value="newest">Newest</option>
                <option value="popular">Most Popular</option>
                <option value="upvotes">Top Rated</option>
              </select>
              <span className="text-sm text-slate-500">{snippets.length} results</span>
            </div>
          </div>

          {/* Snippet List (normal browse OR saved-only view) */}
          <div className="flex-1 overflow-y-auto">
            {showSaved ? (
              savedLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-violet-400" />
                </div>
              ) : savedSnippets.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <p>Chưa có snippet nào được lưu</p>
                </div>
              ) : (
                savedSnippets.map((snippet) => (
                  <SnippetCard
                    key={snippet.id}
                    snippet={snippet}
                    isSelected={selectedSnippet?.id === snippet.id}
                    onClick={() => handleSnippetClick(snippet)}
                    onCopy={() => handleCopySnippet(snippet)}
                  />
                ))
              )
            ) : isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-violet-400" />
              </div>
            ) : snippets.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <p>No snippets found</p>
              </div>
            ) : (
              snippets.map((snippet) => (
                <SnippetCard
                  key={snippet.id}
                  snippet={snippet}
                  isSelected={selectedSnippet?.id === snippet.id}
                  onClick={() => handleSnippetClick(snippet)}
                  onCopy={() => handleCopySnippet(snippet)}
                />
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-3 border-t border-white/10 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 text-sm bg-white/5 border border-white/10 text-slate-300 rounded hover:bg-white/10 disabled:opacity-40 transition-colors"
              >
                Prev
              </button>
              <span className="text-sm text-slate-500">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 text-sm bg-white/5 border border-white/10 text-slate-300 rounded hover:bg-white/10 disabled:opacity-40 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Right Column - Snippet Detail (full record fetched on select:
            includes variables, hasUpvoted/hasBookmarked and counts views) */}
        <div className="w-full overflow-y-auto lg:flex-1">
          {(() => {
            const view = detail ?? selectedSnippet;
            if (!view) {
              return (
                <div className="flex items-center justify-center h-full text-slate-500">
                  Select a snippet to view its details
                </div>
              );
            }
            return (
            <div className="p-6">
              {/* Breadcrumbs */}
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                {getBreadcrumbs().map((crumb, i, arr) => (
                  <span key={i} className="flex items-center gap-2">
                    {i > 0 && <ChevronRight className="w-3.5 h-3.5" />}
                    <span className={i === arr.length - 1 ? 'text-slate-100 font-medium' : ''}>
                      {crumb.label}
                    </span>
                  </span>
                ))}
              </div>

              {/* Title */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-50">
                    {view.title}
                  </h2>
                  {view.description && (
                    <p className="mt-1 text-slate-400">
                      {view.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <LanguageBadge language={view.language} />
                  {view.previewUrl && (
                    <a
                      href={view.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-slate-400 hover:bg-white/10 hover:text-slate-200 rounded transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              {/* Tags */}
              {view.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {view.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-2 py-1 text-xs bg-white/5 border border-white/10 text-slate-400 rounded"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Code blocks — tabbed (Code 1, Code 2, …), each with its own copy */}
              <SnippetCodeTabs snippet={view} />

              {/* Note section — optional rich text (with images), alongside the code */}
              {view.noteContent?.trim() && (
                <div
                  className="prose prose-invert mb-6 max-w-none prose-img:rounded-lg prose-img:border prose-img:border-white/10"
                  dangerouslySetInnerHTML={{ __html: view.noteContent }}
                />
              )}

              {/* Actions */}
              <div className="flex items-center gap-3">
                {(view.explanation || view.youtubeUrl || view.referenceUrl) && (
                  <button
                    onClick={() => setShowExplanation(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-500/15 text-blue-300 border border-blue-500/40 hover:bg-blue-500/25 rounded-lg transition-colors"
                  >
                    <Info className="w-4 h-4" />
                    More
                  </button>
                )}
                <button
                  onClick={handleToggleBookmark}
                  disabled={voteBusy || !detail}
                  className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors disabled:opacity-60 border ${
                    view.hasBookmarked
                      ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${view.hasBookmarked ? 'fill-current' : ''}`} />
                  {view.hasBookmarked ? 'Đã lưu' : 'Lưu'}
                </button>
                <button
                  onClick={handleToggleUpvote}
                  disabled={voteBusy || !detail}
                  className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors disabled:opacity-60 border ${
                    view.hasUpvoted
                      ? 'bg-rose-500/15 text-rose-300 border-rose-500/40'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${view.hasUpvoted ? 'fill-current' : ''}`} />
                  {view.upvoteCount > 0 ? view.upvoteCount : ''}
                </button>
                <button
                  onClick={handleToggleVersions}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <History className="w-4 h-4" />
                  Lịch sử
                </button>
              </div>

              {/* Explanation Modal */}
              {showExplanation && (view.explanation || view.youtubeUrl || view.referenceUrl) && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
                  onClick={() => setShowExplanation(false)}
                >
                  <div
                    className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-neutral-900 shadow-2xl"
                    onClick={e => e.stopPropagation()}
                  >
                    {/* Modal Header */}
                    <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-t-2xl">
                      <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                        {view.title}
                      </h2>
                      <button
                        onClick={() => setShowExplanation(false)}
                        className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      >
                        <X className="w-5 h-5 text-neutral-500" />
                      </button>
                    </div>

                    {/* Modal Content */}
                    <div className="p-6 space-y-6">
                      {/* YouTube Video */}
                      {view.youtubeUrl && (
                        <div>
                          <div className="flex items-center gap-2 mb-3 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            <Play className="w-4 h-4 text-red-500" />
                            Video hướng dẫn
                          </div>
                          <div className="relative aspect-video rounded-xl overflow-hidden bg-neutral-900">
                            <iframe
                              src={getYouTubeEmbedUrl(view.youtubeUrl)}
                              className="absolute inset-0 w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        </div>
                      )}

                      {/* Reference website (embedded iframe) */}
                      {view.referenceUrl && (
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-3 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            <span className="flex items-center gap-2">
                              <ExternalLink className="w-4 h-4 text-cyan-500" />
                              Trang web tham khảo
                            </span>
                            <a
                              href={view.referenceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-cyan-600 hover:underline"
                            >
                              Mở tab mới ↗
                            </a>
                          </div>
                          <div className="relative aspect-video rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-white">
                            <iframe
                              src={view.referenceUrl}
                              className="absolute inset-0 w-full h-full"
                              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                              referrerPolicy="no-referrer"
                              loading="lazy"
                            />
                          </div>
                          <p className="mt-1.5 text-xs text-neutral-500">
                            Một số trang chặn nhúng — nếu trống, bấm &quot;Mở tab mới&quot;.
                          </p>
                        </div>
                      )}

                      {/* Explanation Text */}
                      {view.explanation && (
                        <div>
                          <div className="flex items-center gap-2 mb-3 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            <Info className="w-4 h-4" />
                            Giải thích
                          </div>
                          <div
                            className="prose prose-neutral dark:prose-invert max-w-none text-neutral-600 dark:text-neutral-400"
                            dangerouslySetInnerHTML={{ __html: view.explanation }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Version history (lazy) */}
              {showVersions && (
                <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.03] p-3">
                  <h3 className="mb-2 text-sm font-semibold text-slate-300">
                    Lịch sử phiên bản
                  </h3>
                  {versions == null ? (
                    <div className="flex justify-center py-4"><Loader2 className="w-4 h-4 animate-spin text-violet-400" /></div>
                  ) : versions.length === 0 ? (
                    <p className="text-sm text-slate-500">Chưa có phiên bản nào</p>
                  ) : (
                    <div className="space-y-2">
                      {versions.map((v, i) => (
                        <details key={v.id} className="rounded border border-white/10">
                          <summary className="cursor-pointer px-3 py-2 text-sm text-slate-400 hover:text-slate-200">
                            v{versions.length - i} — {new Date(v.editedAt).toLocaleString('vi-VN')}
                            {v.editedBy ? ` — ${v.editedBy.username}` : ''}
                          </summary>
                          <div className="border-t border-white/10">
                            <CodeViewer code={v.code} language={view.language} />
                          </div>
                        </details>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Meta */}
              <div className="mt-6 pt-6 border-t border-white/10 text-sm text-slate-500">
                <p>Created {new Date(view.createdAt).toLocaleDateString()}</p>
                {view.author && (
                  <p>By {view.author.username}</p>
                )}
              </div>
            </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
