'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { sanitizeHtml } from '@/lib/sanitizeHtml';
import { Loader2, ChevronRight, ChevronLeft, ExternalLink, Bookmark, Heart, History, BookmarkCheck, X, Info, Play, FolderOpen, Github, Download, Copy, Sparkles, Wand2, Terminal, List } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/hooks/useTranslation';
import { FolderTree } from '@/components/exp-hub/FolderTree';
import { SnippetCard } from '@/components/exp-hub/SnippetCard';
import { CodeViewer } from '@/components/exp-hub/CodeViewer';
import { SnippetCodeTabs } from '@/components/exp-hub/SnippetCodeTabs';
import { SearchAutocomplete } from '@/components/exp-hub/SearchAutocomplete';
import { FilterPanel } from '@/components/exp-hub/FilterPanel';
import { CategoryHeader } from '@/components/exp-hub/CategoryHeader';
import { CategoryDoc } from '@/components/exp-hub/CategoryDoc';
import { ReactionBar } from '@/components/exp-hub/ReactionBar';
import { CommentsSection } from '@/components/exp-hub/CommentsSection';
import { snippetsApi, snippetCategoriesApi, snippetTagsApi, snippetStatsApi, snippetBookmarksApi, snippetReactionsApi } from '@/lib/exp-hub-api';
import { useAuthStore } from '@/store/authStore';
import { LanguageBadge, LanguageIcon } from '@/components/exp-hub/LanguageIcon';
import ChatMarkdown from '@/components/chat/ChatMarkdown';
import type { Snippet, SnippetCategory, SnippetTag, SnippetFilters, SnippetVersion, ReactionSummary } from '@/types/exp-hub';

// Find a category anywhere in the nested tree.
function findCategory(cats: SnippetCategory[], targetId: number): SnippetCategory | null {
  for (const cat of cats) {
    if (cat.id === targetId) return cat;
    if (cat.children) {
      const found = findCategory(cat.children, targetId);
      if (found) return found;
    }
  }
  return null;
}

// Pretty-format a file size in bytes.
function formatBytes(n?: number | null): string {
  if (!n || n <= 0) return '';
  const u = ['B', 'KB', 'MB', 'GB'];
  let i = 0; let v = n;
  while (v >= 1024 && i < u.length - 1) { v /= 1024; i++; }
  return `${v.toFixed(v < 10 && i > 0 ? 1 : 0)} ${u[i]}`;
}

export default function ExpHubPage() {
  const searchParams = useSearchParams();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isDark = theme === 'dark';
  const isAuthed = useAuthStore((s) => s.isAuthenticated);

  const [categories, setCategories] = useState<SnippetCategory[]>([]);
  const [tags, setTags] = useState<SnippetTag[]>([]);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null);
  // Browser/editor-style open tabs: snippets the user has opened. The active
  // one is `selectedSnippet`; each is closeable with an X.
  const [openTabs, setOpenTabs] = useState<Snippet[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>();
  // Active TOP-LEVEL group (root category) — scopes the left tree + list.
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
  // Emoji reactions on the selected snippet (loaded per selection).
  const [snippetReactions, setSnippetReactions] = useState<ReactionSummary[]>([]);
  // Related entries for the selected snippet.
  const [related, setRelated] = useState<Snippet[]>([]);
  // Version history (lazy-loaded on expand)
  const [showVersions, setShowVersions] = useState(false);
  const [versions, setVersions] = useState<SnippetVersion[] | null>(null);
  // Explanation modal
  const [showExplanation, setShowExplanation] = useState(false);
  // AI assist modal (explain / optimize / install) — code goes in the request,
  // result is Vietnamese markdown; bounded by the per-user daily token quota.
  const [aiOpen, setAiOpen] = useState(false);
  const [aiMode, setAiMode] = useState<'explain' | 'install' | 'optimize'>('explain');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState('');
  const [aiError, setAiError] = useState('');
  // Left sidebar (FolderTree) collapse — persisted to localStorage so the
  // user keeps their preference across page reloads.
  const [folderTreeOpen, setFolderTreeOpen] = useState(true);
  // Middle snippet-list column collapse (like the category tree).
  const [listOpen, setListOpen] = useState(true);

  const languages = [...new Set(snippets.filter((s) => s.language).map((s) => s.language))].slice(0, 10);

  // The active group object + the categories shown in the left tree:
  // when a group is active the tree lists that group's technologies;
  // otherwise it lists the top-level groups.
  // The category whose header we show above the list (group or technology).
  const selectedCategory = selectedCategoryId ? findCategory(categories, selectedCategoryId) : undefined;

  // Float "Install / Setup" entries to the top of the list — the first thing
  // you want when opening a technology. Skipped while searching (search
  // relevance wins). Client-side over the current page.
  const displaySnippets = useMemo(() => {
    if (searchQuery || showSaved) return snippets;
    const re = /(install|set\s?up|cài\s?đặt|thiết lập|cấu hình|khởi tạo|getting started|bắt đầu)/i;
    const pinned: Snippet[] = [], rest: Snippet[] = [];
    for (const s of snippets) (re.test(s.title) ? pinned : rest).push(s);
    return pinned.length ? [...pinned, ...rest] : snippets;
  }, [snippets, searchQuery, showSaved]);

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

  // Select first snippet when list changes (respects the pinned order)
  useEffect(() => {
    if (displaySnippets.length > 0 && !selectedSnippet) {
      setSelectedSnippet(displaySnippets[0]);
    }
  }, [displaySnippets, selectedSnippet]);

  // Fetch the FULL record when a snippet is selected — the list payload
  // has no variables / hasUpvoted / hasBookmarked, and the detail
  // endpoint also increments the view counter.
  useEffect(() => {
    if (!selectedSnippet) { setDetail(null); return; }
    let cancelled = false;
    setShowVersions(false);
    setVersions(null);
    setSnippetReactions([]);
    setRelated([]);
    snippetsApi.getById(selectedSnippet.id)
      .then((res) => { if (!cancelled) setDetail(res.data.data); })
      .catch(() => { if (!cancelled) setDetail(selectedSnippet); });
    snippetReactionsApi.getForSnippet(selectedSnippet.id)
      .then((res) => { if (!cancelled) setSnippetReactions(res.data.data.reactions); })
      .catch(() => { /* ignore */ });
    snippetsApi.getRelated(selectedSnippet.id)
      .then((res) => { if (!cancelled) setRelated(res.data.data || []); })
      .catch(() => { /* ignore */ });
    return () => { cancelled = true; };
  }, [selectedSnippet]);

  const handleToggleSnippetReaction = async (emoji: string) => {
    const view = detail ?? selectedSnippet;
    if (!view) return;
    if (!isAuthed) { toast.error(t('expHub.loginToReact')); return; }
    try {
      const res = await snippetReactionsApi.toggle(view.id, emoji);
      setSnippetReactions(res.data.data.reactions);
    } catch {
      toast.error(t('expHub.reactFail'));
    }
  };

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
      toast.error(t('expHub.voteFail'));
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
      toast.success(bookmarked ? t('expHub.bookmarked') : t('expHub.unsaveOk'));
      // Keep the saved list in sync if it's open
      if (showSaved) {
        if (bookmarked) setSavedSnippets((prev) => [detail, ...prev.filter(s => s.id !== detail.id)]);
        else setSavedSnippets((prev) => prev.filter(s => s.id !== detail.id));
      }
    } catch {
      toast.error(t('expHub.saveFail'));
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

  // Single-tree selection. `null` = everything (top level); a node = filter the
  // list to that category. Groups are just root nodes in the same tree now.
  const handleCategorySelect = (category: SnippetCategory | null) => {
    setSelectedCategoryId(category ? category.id : undefined);
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
    // Open as a tab (dedupe, keep order) — like a browser/editor.
    setOpenTabs((tabs) => (tabs.some((t) => t.id === snippet.id) ? tabs : [...tabs, snippet]));
  };

  // Close a tab (its X). If it was the active one, jump to a neighbour tab.
  const closeTab = (id: number) => {
    setOpenTabs((tabs) => {
      const idx = tabs.findIndex((t) => t.id === id);
      const next = tabs.filter((t) => t.id !== id);
      if (selectedSnippet?.id === id) setSelectedSnippet(next[idx] ?? next[idx - 1] ?? null);
      return next;
    });
  };

  const handleCopySnippet = async (snippet: Snippet) => {
    await navigator.clipboard.writeText(snippet.code);
  };

  // Copy every code block of the current snippet at once (joined) — handy for
  // multi-block "install & setup" entries.
  const handleCopyAll = async (snippet: Snippet) => {
    const blocks = (snippet.codeBlocks && snippet.codeBlocks.length)
      ? snippet.codeBlocks.map((b) => b.code)
      : [snippet.code];
    const all = blocks.filter((c) => c?.trim()).join('\n\n');
    if (!all.trim()) return;
    try {
      await navigator.clipboard.writeText(all);
      toast.success(t('expHub.copiedAll'));
    } catch { /* ignore */ }
  };

  // Open the AI assist modal (does not spend tokens until a mode is chosen).
  const openAi = () => {
    if (!isAuthed) { toast.error(t('expHub.aiNeedLogin')); return; }
    setAiResult(''); setAiError(''); setAiMode('explain'); setAiOpen(true);
  };

  // Run one AI mode on the currently-selected entry's code.
  const runAiAssist = async (mode: 'explain' | 'install' | 'optimize') => {
    const view = detail ?? selectedSnippet;
    if (!view) return;
    const code = (view.codeBlocks?.filter((b) => b.code?.trim())
      .map((b) => (b.name ? `// ${b.name}\n${b.code}` : b.code)).join('\n\n')) || view.code || '';
    setAiMode(mode); setAiLoading(true); setAiResult(''); setAiError('');
    try {
      const res = await snippetsApi.aiAssist({ mode, code, language: view.language, title: view.title });
      setAiResult(res.data.data?.text || '');
    } catch (e: any) {
      setAiError(e?.response?.data?.message || t('expHub.aiError'));
    } finally {
      setAiLoading(false);
    }
  };

  // Helper to convert YouTube URL to embed URL
  const getYouTubeEmbedUrl = (url: string): string => {
    if (!url) return '';
    if (url.includes('youtube.com/embed/')) return url;
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
    const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
    return url;
  };

  const getBreadcrumbs = (): Array<{ label: string; id?: number }> => {
    const crumbs: Array<{ label: string; id?: number }> = [{ label: t('expHub.all') }];
    if (selectedCategory) crumbs.push({ label: selectedCategory.name, id: selectedCategory.id });
    return crumbs;
  };

  // Parse "owner/repo" out of a GitHub URL for the repo card.
  const repoInfo = useMemo(() => {
    const url = (detail ?? selectedSnippet)?.repoUrl;
    if (!url) return null;
    const m = url.match(/github\.com\/([^/]+)\/([^/#?]+)/i);
    if (!m) return { owner: '', repo: url, url };
    return { owner: m[1], repo: m[2].replace(/\.git$/, ''), url };
  }, [detail, selectedSnippet]);

  return (
    <div className="relative flex flex-col h-[calc(100dvh-var(--app-chrome-bottom))] pt-16 sm:pt-20 overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Ambient neon background — dark theme only (looks wrong on light). */}
      {isDark && (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #0d1120 0%, #111832 55%, #0b0f1e 100%)' }} />
          <div
            className="absolute inset-0 opacity-[0.25]"
            style={{
              backgroundImage: 'linear-gradient(rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.06) 1px, transparent 1px)',
              backgroundSize: '46px 46px',
            }}
          />
          <div className="exphub-blob-a absolute -top-32 -left-24 h-[42rem] w-[42rem] rounded-full opacity-[0.16]" style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 62%)' }} />
          <div className="exphub-blob-b absolute -bottom-40 -right-28 h-[46rem] w-[46rem] rounded-full opacity-[0.14]" style={{ background: 'radial-gradient(circle, #22d3ee 0%, transparent 62%)' }} />
        </div>
      )}

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between gap-3 border-b border-[var(--border-color)] bg-[var(--bg-card)]/80 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <h1 className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 bg-clip-text text-lg font-bold text-transparent">
            EXP_Hub
          </h1>
          {stats && (
            <span className="hidden rounded-full border border-[var(--border-color)] bg-[var(--bg-surface-active)] px-2.5 py-0.5 text-xs font-medium text-[var(--text-secondary)] sm:inline">
              {stats.totalSnippets} {t('expHub.items')}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <SearchAutocomplete
            className="w-44 sm:w-96"
            categories={categories}
            onSelectCategory={handleCategorySelect}
            onSelectSnippet={handleSnippetClick}
            onSearch={(q) => { setSearchQuery(q); setPage(1); setSelectedSnippet(null); }}
          />
          <button
            onClick={() => setShowSaved((v) => !v)}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
              showSaved
                ? 'border-violet-400/60 bg-violet-500/15 text-violet-500 dark:text-violet-300'
                : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]'
            }`}
            title={t('expHub.savedTab')}
          >
            <BookmarkCheck className="h-4 w-4" />
            <span className="hidden sm:inline">{t('expHub.savedTab')}</span>
          </button>
        </div>
      </header>

      {/* Main Content — stacks vertically on mobile, side-by-side on ≥lg. */}
      <div className="relative z-10 flex flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
        {/* Left Sidebar - Folder Tree (collapsible) */}
        <aside
          className={`relative shrink-0 border-b border-[var(--border-color)] bg-[var(--bg-card)]/50 lg:flex lg:min-h-0 lg:flex-col lg:border-b-0 lg:border-r ${
            folderTreeOpen ? 'lg:w-72' : 'lg:w-11'
          }`}
        >
          <div className={`flex shrink-0 items-center border-b border-[var(--border-color)] ${folderTreeOpen ? 'justify-between px-3 py-2' : 'justify-center py-2'}`}>
            <span className={`flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] transition-opacity ${folderTreeOpen ? 'opacity-100' : 'w-0 overflow-hidden opacity-0 pointer-events-none'}`}>
              <FolderOpen className="h-4 w-4 text-violet-500" />
              {t('expHub.categories')}
            </span>
            <button
              type="button"
              onClick={() => setFolderTreeOpen((v) => !v)}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]"
              title={folderTreeOpen ? t('expHub.hideCategories') : t('expHub.showCategories')}
              aria-label={folderTreeOpen ? t('expHub.hideCategories') : t('expHub.showCategories')}
            >
              {folderTreeOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          </div>
          <div className={`overflow-y-auto max-h-[40vh] lg:max-h-none lg:min-h-0 lg:flex-1 ${folderTreeOpen ? '' : 'hidden'}`}>
            <FolderTree
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={handleCategorySelect}
              allLabel={t('expHub.allItems')}
            />
          </div>
        </aside>

        {/* Middle Column - Snippet List (collapsible, like the tree) */}
        <div className={`flex w-full shrink-0 flex-col border-b border-[var(--border-color)] bg-[var(--bg-card)]/40 lg:min-h-0 lg:border-b-0 lg:border-r ${listOpen ? 'lg:w-96' : 'lg:w-12'}`}>
          <div className={`flex shrink-0 items-center border-b border-[var(--border-color)] ${listOpen ? 'justify-between px-3 py-2' : 'justify-center py-2'}`}>
            <span className={`flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] ${listOpen ? '' : 'w-0 overflow-hidden opacity-0 pointer-events-none'}`}>
              <List className="h-4 w-4 text-violet-500" /> {snippets.length} {t('expHub.results')}
            </span>
            <button
              type="button"
              onClick={() => setListOpen((v) => !v)}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]"
              title={listOpen ? 'Ẩn danh sách' : 'Hiện danh sách'}
              aria-label={listOpen ? 'Ẩn danh sách' : 'Hiện danh sách'}
            >
              {listOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          </div>
          <div className={`flex min-h-0 flex-1 flex-col ${listOpen ? '' : 'hidden'}`}>
          {/* Category header (rich intro) */}
          {selectedCategory && !showSaved && (
            <div className="p-3 pb-0">
              <CategoryHeader category={selectedCategory} count={selectedCategory._count?.snippets} />
              <CategoryDoc categoryId={selectedCategory.id} hasDoc={selectedCategory.hasDoc} />
            </div>
          )}

          {/* Filters */}
          <div className="space-y-3 border-b border-[var(--border-color)] p-3">
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
                className="rounded border border-[var(--border-color)] bg-[var(--bg-surface)] px-2 py-1 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-violet-500/40"
              >
                <option value="newest">{t('expHub.sortNewest')}</option>
                <option value="popular">{t('expHub.sortPopular')}</option>
                <option value="upvotes">{t('expHub.sortTop')}</option>
              </select>
              <span className="text-sm text-[var(--text-muted)]">{snippets.length} {t('expHub.results')}</span>
            </div>
          </div>

          {/* Snippet List (normal browse OR saved-only view) */}
          <div className="flex-1 overflow-y-auto">
            {showSaved ? (
              savedLoading ? (
                <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-violet-500" /></div>
              ) : savedSnippets.length === 0 ? (
                <div className="p-8 text-center text-[var(--text-muted)]"><p>{t('expHub.noSaved')}</p></div>
              ) : (
                savedSnippets.map((snippet) => (
                  <SnippetCard key={snippet.id} snippet={snippet} isSelected={selectedSnippet?.id === snippet.id} onClick={() => handleSnippetClick(snippet)} onCopy={() => handleCopySnippet(snippet)} />
                ))
              )
            ) : isLoading ? (
              <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-violet-500" /></div>
            ) : displaySnippets.length === 0 ? (
              <div className="p-8 text-center text-[var(--text-muted)]"><p>{t('expHub.empty')}</p></div>
            ) : (
              displaySnippets.map((snippet) => (
                <SnippetCard key={snippet.id} snippet={snippet} isSelected={selectedSnippet?.id === snippet.id} onClick={() => handleSnippetClick(snippet)} onCopy={() => handleCopySnippet(snippet)} />
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 border-t border-[var(--border-color)] p-3">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="rounded border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-1 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface-hover)] disabled:opacity-40">
                {t('expHub.prev')}
              </button>
              <span className="text-sm text-[var(--text-muted)]">{page} / {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="rounded border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-1 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface-hover)] disabled:opacity-40">
                {t('expHub.next')}
              </button>
            </div>
          )}
          </div>
        </div>

        {/* Right Column - Snippet Detail */}
        <div className="w-full overflow-y-auto lg:flex-1">
          {/* Open tabs (browser/editor style) — sticky above the detail. */}
          {openTabs.length > 0 && (
            <div className="sticky top-0 z-10 flex items-center gap-0.5 overflow-x-auto border-b border-[var(--border-color)] bg-[var(--bg-card)]/90 px-1 backdrop-blur [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {openTabs.map((tab) => {
                const active = tab.id === selectedSnippet?.id;
                return (
                  <div
                    key={tab.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedSnippet(tab)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedSnippet(tab); } }}
                    className={`group flex max-w-[200px] shrink-0 cursor-pointer items-center gap-2 border-b-2 px-3 py-2 text-sm transition-colors ${
                      active
                        ? 'border-violet-400 bg-[var(--bg-surface-active)] text-[var(--text-primary)]'
                        : 'border-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
                    }`}
                    title={tab.title}
                  >
                    <LanguageIcon language={tab.language} size={14} className="shrink-0" />
                    <span className="truncate">{tab.title}</span>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}
                      className="shrink-0 rounded p-0.5 text-[var(--text-muted)] opacity-60 transition hover:bg-[var(--bg-surface-active)] hover:text-[var(--text-primary)] hover:opacity-100"
                      aria-label={`Đóng ${tab.title}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          {(() => {
            const view = detail ?? selectedSnippet;
            if (!view) {
              return (
                <div className="flex h-full items-center justify-center text-[var(--text-muted)]">
                  {t('expHub.selectHint')}
                </div>
              );
            }
            const isProject = view.kind === 'PROJECT' || !!view.repoUrl;
            return (
              <div className="p-6">
                {/* Breadcrumbs */}
                <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-[var(--text-muted)]">
                  {getBreadcrumbs().map((crumb, i, arr) => (
                    <span key={i} className="flex items-center gap-2">
                      {i > 0 && <ChevronRight className="h-3.5 w-3.5" />}
                      <span className={i === arr.length - 1 ? 'font-medium text-[var(--text-primary)]' : ''}>{crumb.label}</span>
                    </span>
                  ))}
                </div>

                {/* Title */}
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {isProject && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-violet-500/15 px-2 py-0.5 text-xs font-semibold text-violet-500 dark:text-violet-300">
                          <Github className="h-3.5 w-3.5" /> {t('expHub.project')}
                        </span>
                      )}
                      <h2 className="text-2xl font-bold text-[var(--text-primary)]">{view.title}</h2>
                    </div>
                    {view.description && <p className="mt-1 text-[var(--text-secondary)]">{view.description}</p>}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {view.language && !isProject && <LanguageBadge language={view.language} />}
                    {view.previewUrl && (
                      <a href={view.previewUrl} target="_blank" rel="noopener noreferrer" className="rounded p-2 text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>

                {/* GitHub repo card (PROJECT) */}
                {repoInfo && (
                  <a
                    href={repoInfo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mb-5 flex items-center gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-3.5 transition-colors hover:border-violet-400/50 hover:bg-[var(--bg-surface-hover)]"
                  >
                    <Github className="h-6 w-6 shrink-0 text-[var(--text-primary)]" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-[var(--text-primary)]">
                        {repoInfo.owner ? `${repoInfo.owner}/` : ''}<span className="text-violet-500 dark:text-violet-300">{repoInfo.repo}</span>
                      </div>
                      <div className="truncate text-xs text-[var(--text-muted)]">{repoInfo.url}</div>
                    </div>
                    <ExternalLink className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
                  </a>
                )}

                {/* Tags */}
                {view.tags.length > 0 && (
                  <div className="mb-6 flex flex-wrap gap-2">
                    {view.tags.map((tag) => (
                      <span key={tag.id} className="rounded border border-[var(--border-color)] bg-[var(--bg-surface)] px-2 py-1 text-xs text-[var(--text-secondary)]">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Code blocks — tabbed (for PROJECT these read as named files) */}
                <SnippetCodeTabs snippet={view} />

                {/* Attachments (downloadable project files) */}
                {view.attachments && view.attachments.length > 0 && (
                  <div className="mb-6">
                    <div className="mb-2 text-sm font-medium text-[var(--text-secondary)]">{t('expHub.attachments')}</div>
                    <div className="flex flex-col gap-2">
                      {view.attachments.map((att) => (
                        <a
                          key={att.id}
                          href={att.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={att.originalName}
                          className="flex items-center gap-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2 text-sm transition-colors hover:bg-[var(--bg-surface-hover)]"
                        >
                          <Download className="h-4 w-4 shrink-0 text-violet-500" />
                          <span className="min-w-0 flex-1 truncate text-[var(--text-primary)]">{att.originalName}</span>
                          {att.fileSize ? <span className="shrink-0 text-xs text-[var(--text-muted)]">{formatBytes(att.fileSize)}</span> : null}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Note section — optional rich text (with images) */}
                {view.noteContent?.trim() && (
                  <div
                    className="prose mb-6 max-w-none dark:prose-invert prose-headings:font-bold prose-headings:text-[var(--text-primary)] prose-a:text-violet-500 prose-a:no-underline hover:prose-a:underline prose-strong:text-[var(--text-primary)] prose-code:rounded prose-code:bg-[var(--bg-surface-active)] prose-code:px-1 prose-code:py-0.5 prose-code:text-violet-500 prose-code:before:content-[''] prose-code:after:content-[''] prose-pre:rounded-xl prose-pre:border prose-pre:border-[var(--border-color)] prose-img:rounded-lg prose-img:border prose-img:border-[var(--border-color)] prose-img:shadow-sm prose-blockquote:border-l-violet-400 prose-blockquote:text-[var(--text-secondary)]"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(view.noteContent) }}
                  />
                )}

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3">
                  {((view.codeBlocks?.filter((b) => b.code?.trim()).length ?? 0) > 1) && (
                    <button onClick={() => handleCopyAll(view)} className="flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-4 py-2 text-sm text-emerald-600 transition-colors hover:bg-emerald-500/25 dark:text-emerald-300">
                      <Copy className="h-4 w-4" /> {t('expHub.copyAll')}
                    </button>
                  )}
                  {(view.explanation || view.youtubeUrl || view.referenceUrl) && (
                    <button onClick={() => setShowExplanation(true)} className="flex items-center gap-2 rounded-lg border border-blue-500/40 bg-blue-500/15 px-4 py-2 text-sm text-blue-600 transition-colors hover:bg-blue-500/25 dark:text-blue-300">
                      <Info className="h-4 w-4" /> {t('expHub.details')}
                    </button>
                  )}
                  {(view.code?.trim() || view.codeBlocks?.some((b) => b.code?.trim())) && (
                    <button onClick={openAi} className="flex items-center gap-2 rounded-lg border border-violet-500/40 bg-violet-500/15 px-4 py-2 text-sm text-violet-600 transition-colors hover:bg-violet-500/25 dark:text-violet-300">
                      <Sparkles className="h-4 w-4" /> {t('expHub.aiAssist')}
                    </button>
                  )}
                  <button
                    onClick={handleToggleBookmark}
                    disabled={voteBusy || !detail}
                    className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors disabled:opacity-60 ${
                      view.hasBookmarked ? 'border-amber-500/40 bg-amber-500/15 text-amber-600 dark:text-amber-300' : 'border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
                    }`}
                  >
                    <Bookmark className={`h-4 w-4 ${view.hasBookmarked ? 'fill-current' : ''}`} />
                    {view.hasBookmarked ? t('expHub.bookmarked') : t('expHub.bookmark')}
                  </button>
                  <button
                    onClick={handleToggleUpvote}
                    disabled={voteBusy || !detail}
                    className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors disabled:opacity-60 ${
                      view.hasUpvoted ? 'border-rose-500/40 bg-rose-500/15 text-rose-600 dark:text-rose-300' : 'border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${view.hasUpvoted ? 'fill-current' : ''}`} />
                    {view.upvoteCount > 0 ? view.upvoteCount : ''}
                  </button>
                  <button onClick={handleToggleVersions} className="flex items-center gap-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-4 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface-hover)]">
                    <History className="h-4 w-4" /> {t('expHub.history')}
                  </button>
                </div>

                {/* Emoji reactions on the entry */}
                <div className="mt-4">
                  <ReactionBar reactions={snippetReactions} onToggle={handleToggleSnippetReaction} disabled={!isAuthed} />
                </div>

                {/* Explanation Modal — theme-aware */}
                {showExplanation && (view.explanation || view.youtubeUrl || view.referenceUrl) && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowExplanation(false)}>
                    <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-2xl" onClick={(e) => e.stopPropagation()}>
                      <div className="sticky top-0 flex items-center justify-between rounded-t-2xl border-b border-[var(--border-color)] bg-[var(--bg-card)] px-6 py-4">
                        <h2 className="text-lg font-semibold text-[var(--text-primary)]">{view.title}</h2>
                        <button onClick={() => setShowExplanation(false)} className="rounded-lg p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]">
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="space-y-6 p-6">
                        {view.youtubeUrl && (
                          <div>
                            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
                              <Play className="h-4 w-4 text-red-500" /> {t('expHub.videoGuide')}
                            </div>
                            <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
                              <iframe src={getYouTubeEmbedUrl(view.youtubeUrl)} className="absolute inset-0 h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                            </div>
                          </div>
                        )}
                        {view.referenceUrl && (
                          <div>
                            <div className="mb-3 flex items-center justify-between gap-2 text-sm font-medium text-[var(--text-secondary)]">
                              <span className="flex items-center gap-2"><ExternalLink className="h-4 w-4 text-cyan-500" /> {t('expHub.refSite')}</span>
                              <a href={view.referenceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-600 hover:underline">{t('expHub.openNewTab')}</a>
                            </div>
                            <div className="relative aspect-video overflow-hidden rounded-xl border border-[var(--border-color)] bg-white">
                              <iframe src={view.referenceUrl} className="absolute inset-0 h-full w-full" sandbox="allow-scripts allow-same-origin allow-popups allow-forms" referrerPolicy="no-referrer" loading="lazy" />
                            </div>
                            <p className="mt-1.5 text-xs text-[var(--text-muted)]">{t('expHub.embedBlocked')}</p>
                          </div>
                        )}
                        {view.explanation && (
                          <div>
                            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]"><Info className="h-4 w-4" /> {t('expHub.explanation')}</div>
                            <div className="prose max-w-none dark:prose-invert prose-headings:text-[var(--text-primary)] prose-a:text-violet-500 prose-strong:text-[var(--text-primary)] prose-code:rounded prose-code:bg-[var(--bg-surface-active)] prose-code:px-1 prose-code:py-0.5 prose-code:text-violet-500 prose-code:before:content-[''] prose-code:after:content-[''] prose-img:rounded-lg prose-img:border prose-img:border-[var(--border-color)]" dangerouslySetInnerHTML={{ __html: sanitizeHtml(view.explanation) }} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Version history (lazy) */}
                {showVersions && (
                  <div className="mt-4 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] p-3">
                    <h3 className="mb-2 text-sm font-semibold text-[var(--text-secondary)]">{t('expHub.versionHistory')}</h3>
                    {versions == null ? (
                      <div className="flex justify-center py-4"><Loader2 className="h-4 w-4 animate-spin text-violet-500" /></div>
                    ) : versions.length === 0 ? (
                      <p className="text-sm text-[var(--text-muted)]">{t('expHub.noVersions')}</p>
                    ) : (
                      <div className="space-y-2">
                        {versions.map((v, i) => (
                          <details key={v.id} className="rounded border border-[var(--border-color)]">
                            <summary className="cursor-pointer px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                              v{versions.length - i} — {new Date(v.editedAt).toLocaleString('vi-VN')}
                              {v.editedBy ? ` — ${v.editedBy.username}` : ''}
                            </summary>
                            <div className="border-t border-[var(--border-color)]">
                              <CodeViewer code={v.code} language={view.language} />
                            </div>
                          </details>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Meta */}
                <div className="mt-6 border-t border-[var(--border-color)] pt-6 text-sm text-[var(--text-muted)]">
                  <p>{t('expHub.createdOn')} {new Date(view.createdAt).toLocaleDateString()}</p>
                  {view.author && <p>{t('expHub.by')} {view.author.username}</p>}
                </div>

                {/* AI assist modal — explain / optimize / install */}
                {aiOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setAiOpen(false)}>
                    <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-2xl" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-between border-b border-[var(--border-color)] px-6 py-4">
                        <h2 className="flex items-center gap-2 text-lg font-semibold text-[var(--text-primary)]">
                          <Sparkles className="h-5 w-5 text-violet-500" /> {t('expHub.aiAssist')}
                        </h2>
                        <button onClick={() => setAiOpen(false)} className="rounded-lg p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]">
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 border-b border-[var(--border-color)] px-6 py-3">
                        {([
                          { m: 'explain', icon: Sparkles, label: t('expHub.aiExplain') },
                          { m: 'optimize', icon: Wand2, label: t('expHub.aiOptimize') },
                          { m: 'install', icon: Terminal, label: t('expHub.aiInstall') },
                        ] as const).map(({ m, icon: Icon, label }) => (
                          <button
                            key={m}
                            onClick={() => runAiAssist(m)}
                            disabled={aiLoading}
                            className={`flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm transition-colors disabled:opacity-60 ${
                              aiMode === m && (aiLoading || aiResult || aiError)
                                ? 'border-violet-500/50 bg-violet-500/20 text-violet-600 dark:text-violet-300'
                                : 'border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
                            }`}
                          >
                            <Icon className="h-4 w-4" /> {label}
                          </button>
                        ))}
                      </div>
                      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
                        {aiLoading ? (
                          <div className="flex items-center justify-center gap-2 py-12 text-[var(--text-secondary)]">
                            <Loader2 className="h-5 w-5 animate-spin" /> {t('expHub.aiThinking')}
                          </div>
                        ) : aiError ? (
                          <p className="py-8 text-center text-sm text-rose-500">{aiError}</p>
                        ) : aiResult ? (
                          <div className="text-sm text-[var(--text-primary)]"><ChatMarkdown content={aiResult} /></div>
                        ) : (
                          <p className="py-10 text-center text-sm text-[var(--text-muted)]">{t('expHub.aiPick')}</p>
                        )}
                      </div>
                      {(aiResult && !aiLoading) && (
                        <div className="flex items-center justify-between gap-3 border-t border-[var(--border-color)] px-6 py-3">
                          <span className="text-xs text-[var(--text-muted)]">{t('expHub.aiHint')}</span>
                          <button
                            onClick={() => { navigator.clipboard.writeText(aiResult).then(() => toast.success(t('expHub.copiedAll'))).catch(() => {}); }}
                            className="flex shrink-0 items-center gap-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]"
                          >
                            <Copy className="h-4 w-4" /> {t('expHub.copyResult')}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Related entries */}
                {related.length > 0 && (
                  <div className="mt-8 border-t border-[var(--border-color)] pt-6">
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--text-secondary)]">{t('expHub.related')}</h3>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {related.map((r) => (
                        <button
                          key={r.id}
                          onClick={() => setSelectedSnippet(r)}
                          className="flex items-center gap-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] p-2.5 text-left transition-colors hover:border-violet-400/50 hover:bg-[var(--bg-surface-hover)]"
                        >
                          <LanguageIcon language={r.language} size={26} className="mt-0.5" />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium text-[var(--text-primary)]">{r.title}</span>
                            {r.category && <span className="block truncate text-xs text-[var(--text-muted)]">{r.category.name}</span>}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Comments + reactions */}
                <CommentsSection key={view.id} snippetId={view.id} />
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
