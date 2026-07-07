'use client';
/**
 * My Language — Vocabulary section.
 * Three modes (List / Flashcards / Quiz) over a language's vocab categories,
 * plus an SRS review deck via `?mode=review`.
 * Theme-aware (CSS vars, never `dark:`), neon-violet accents, mobile-first.
 */
import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  List,
  Layers,
  HelpCircle,
  Search,
  Download,
  Check,
  X,
  RotateCcw,
  ChevronRight,
  Heart,
  FolderPlus,
  Folder,
  Pencil,
  Trash2,
  Plus,
} from 'lucide-react';
import { toast } from 'sonner';

import { languageApi } from '@/lib/language-api';
import type { VocabCategory, VocabCollection, VocabWord, LangLearnStatus } from '@/types/language';
import {
  SectionShell,
  SpeakerButton,
  StatusPill,
  Segmented,
  Chip,
  EmptyState,
  CardsSkeleton,
  useLangUser,
  usePrefersReducedMotion,
} from '@/components/language/primitives';
import { getImageUrl } from '@/lib/utils';

// ─── Constants / helpers ─────────────────────────────────────────
type View = 'list' | 'cards' | 'quiz';
/** Word source: a vocab category, the ❤️ favorites deck, or a user collection. */
type SourceKind = 'category' | 'favorites' | 'collection';

const STATUS_ORDER: LangLearnStatus[] = ['NEW', 'LEARNING', 'REVIEWING', 'MASTERED'];
const PAGE_SIZE = 20;

function nextStatus(s: LangLearnStatus): LangLearnStatus {
  const i = STATUS_ORDER.indexOf(s);
  return STATUS_ORDER[(i + 1) % STATUS_ORDER.length];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pronText(w: VocabWord): string {
  return (w.pronunciations ?? []).map((p) => p.value).join(' / ');
}

// ─── Page (Suspense wrapper needed for useSearchParams) ──────────
export default function VocabPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-5xl px-3 py-8"><CardsSkeleton /></div>}>
      <VocabInner />
    </Suspense>
  );
}

function VocabInner() {
  const code = String(useParams().code);
  const searchParams = useSearchParams();
  const wantReview = searchParams.get('mode') === 'review';
  const { isAuthenticated } = useLangUser();
  const reduced = usePrefersReducedMotion();

  const [view, setView] = useState<View>('list');
  const [categories, setCategories] = useState<VocabCategory[]>([]);
  const [activeCat, setActiveCat] = useState<number | null>(null);
  const [words, setWords] = useState<VocabWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [languageId, setLanguageId] = useState<number | null>(null);

  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const [reviewMode, setReviewMode] = useState(false);
  const [statuses, setStatuses] = useState<Map<number, LangLearnStatus>>(new Map());

  // Favorites & user collections (word sources besides categories)
  const [srcKind, setSrcKind] = useState<SourceKind>('category');
  const [activeColl, setActiveColl] = useState<number | null>(null);
  const [collections, setCollections] = useState<VocabCollection[]>([]);
  const [favIds, setFavIds] = useState<Set<number>>(new Set());
  // null = closed; 'manage' = manage-only; otherwise the add-target
  const [collSheet, setCollSheet] = useState<null | 'manage' | { word?: VocabWord; categoryId?: number }>(null);

  const refreshCollections = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await languageApi.collections(code);
      setCollections(res.data.data);
    } catch {
      /* non-fatal */
    }
  }, [code, isAuthenticated]);

  // ─── Bootstrap: categories + languageId + optional review deck ──
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const [catsRes, ovRes] = await Promise.all([
          languageApi.vocabCategories(code),
          languageApi.overview(code),
        ]);
        if (!alive) return;
        setLanguageId(ovRes.data.data.id);
        const cats = catsRes.data.data;
        setCategories(cats);

        if (wantReview && isAuthenticated) {
          const rq = await languageApi.reviewQueue(code);
          if (!alive) return;
          const items = rq.data.data.items.filter(
            (it): it is { progress: typeof it.progress; word: VocabWord } => it.word != null,
          );
          const seed = new Map<number, LangLearnStatus>();
          items.forEach((it) => seed.set(it.word.id, it.progress.status));
          setStatuses(seed);
          setWords(items.map((it) => it.word));
          setReviewMode(true);
          setView('cards');
          setLoading(false);
          return;
        }

        setActiveCat(cats.length ? cats[0].id : null);
        if (!cats.length) setLoading(false);
      } catch {
        if (alive) {
          toast.error('Không tải được dữ liệu từ vựng');
          setLoading(false);
        }
      }
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  // ─── Favorites ids + collections (hearts & source chips) ────────
  useEffect(() => {
    if (!isAuthenticated) return;
    let alive = true;
    (async () => {
      try {
        const [idsRes, collRes] = await Promise.all([
          languageApi.favoriteIds(code),
          languageApi.collections(code),
        ]);
        if (!alive) return;
        setFavIds(new Set(idsRes.data.data));
        setCollections(collRes.data.data);
      } catch {
        /* non-fatal — hearts just stay empty */
      }
    })();
    return () => {
      alive = false;
    };
  }, [code, isAuthenticated]);

  // ─── Debounce search ───────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  // ─── Load words for the active category / search ───────────────
  const loadWords = useCallback(
    async (opts: { append: boolean; page: number }) => {
      if (reviewMode) return;
      if (opts.append) setLoadingMore(true);
      else setLoading(true);
      try {
        const q = debounced.trim();
        if (q) {
          const res = await languageApi.vocabSearch(code, q);
          setWords(res.data.data);
          setTotalPages(1);
        } else if (srcKind === 'favorites') {
          const res = await languageApi.favorites(code);
          setWords(res.data.data.items);
          setTotalPages(1);
        } else if (srcKind === 'collection' && activeColl != null) {
          const res = await languageApi.collectionWords(activeColl);
          setWords(res.data.data.items);
          setTotalPages(1);
        } else if (activeCat != null) {
          const res = await languageApi.vocab(code, {
            categoryId: activeCat,
            page: opts.page,
            limit: PAGE_SIZE,
          });
          const data = res.data.data;
          setWords((prev) => (opts.append ? [...prev, ...data] : data));
          setTotalPages(res.data.pagination?.totalPages ?? 1);
        } else {
          setWords([]);
          setTotalPages(1);
        }
      } catch {
        toast.error('Không tải được từ vựng');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [code, debounced, activeCat, reviewMode, srcKind, activeColl],
  );

  useEffect(() => {
    if (reviewMode) return;
    setPage(1);
    void loadWords({ append: false, page: 1 });
  }, [loadWords, reviewMode]);

  const loadMore = useCallback(() => {
    const next = page + 1;
    setPage(next);
    void loadWords({ append: true, page: next });
  }, [page, loadWords]);

  // ─── Status cycle (optimistic) ─────────────────────────────────
  const cycleStatus = useCallback(
    async (word: VocabWord) => {
      const current = statuses.get(word.id) ?? 'NEW';
      const nxt = nextStatus(current);
      setStatuses((prev) => new Map(prev).set(word.id, nxt));
      try {
        await languageApi.recordProgress({ itemType: 'VOCAB', itemId: word.id, status: nxt });
      } catch {
        setStatuses((prev) => new Map(prev).set(word.id, current));
        toast.error('Không cập nhật được trạng thái');
      }
    },
    [statuses],
  );

  // ─── Favorite toggle (optimistic) ──────────────────────────────
  const toggleFav = useCallback(
    async (word: VocabWord) => {
      if (!isAuthenticated) {
        toast.error('Đăng nhập để lưu từ yêu thích');
        return;
      }
      const wasFav = favIds.has(word.id);
      setFavIds((prev) => {
        const nx = new Set(prev);
        if (wasFav) nx.delete(word.id);
        else nx.add(word.id);
        return nx;
      });
      // Bỏ tim khi đang xem danh sách Yêu thích → gỡ khỏi list luôn
      if (wasFav && srcKind === 'favorites') setWords((prev) => prev.filter((w) => w.id !== word.id));
      try {
        await languageApi.favoriteToggle(word.id);
      } catch {
        setFavIds((prev) => {
          const nx = new Set(prev);
          if (wasFav) nx.add(word.id);
          else nx.delete(word.id);
          return nx;
        });
        toast.error('Không lưu được, thử lại nhé');
      }
    },
    [favIds, isAuthenticated, srcKind],
  );

  const pickCategory = useCallback((id: number) => {
    setSrcKind('category');
    setActiveColl(null);
    setActiveCat(id);
  }, []);

  const pickFavorites = useCallback(() => {
    setSrcKind('favorites');
    setActiveColl(null);
  }, []);

  const pickCollection = useCallback((id: number) => {
    setSrcKind('collection');
    setActiveColl(id);
  }, []);

  // Add a word / a whole category into a collection (from the sheet)
  const addToCollection = useCallback(
    async (collectionId: number, target: { word?: VocabWord; categoryId?: number }) => {
      try {
        const body = target.word ? { wordIds: [target.word.id] } : { categoryId: target.categoryId };
        const res = await languageApi.addToCollection(collectionId, body);
        const { added } = res.data.data;
        const collName = collections.find((c) => c.id === collectionId)?.name ?? 'bộ sưu tập';
        toast.success(
          added > 0
            ? `Đã thêm ${added} từ vào “${collName}”`
            : `Tất cả từ đã có sẵn trong “${collName}”`,
        );
        setCollSheet(null);
        void refreshCollections();
        if (srcKind === 'collection' && activeColl === collectionId) {
          void loadWords({ append: false, page: 1 });
        }
      } catch {
        toast.error('Không thêm được vào bộ sưu tập');
      }
    },
    [collections, refreshCollections, srcKind, activeColl, loadWords],
  );

  // Remove one word while viewing a collection
  const removeFromActiveCollection = useCallback(
    async (word: VocabWord) => {
      if (activeColl == null) return;
      setWords((prev) => prev.filter((w) => w.id !== word.id));
      try {
        await languageApi.removeFromCollection(activeColl, word.id);
        void refreshCollections();
      } catch {
        toast.error('Không gỡ được từ khỏi bộ sưu tập');
        void loadWords({ append: false, page: 1 });
      }
    },
    [activeColl, refreshCollections, loadWords],
  );

  // ─── CSV export ────────────────────────────────────────────────
  const exportCsv = useCallback(() => {
    if (!words.length) {
      toast.error('Không có từ để xuất');
      return;
    }
    const esc = (v: string) => `"${(v ?? '').replace(/"/g, '""')}"`;
    const header = ['word', 'pronunciation', 'meaning_vi', 'example', 'example_meaning'];
    const rows = words.map((w) =>
      [w.word, pronText(w), w.meaningVi, w.exampleSentence ?? '', w.exampleMeaning ?? '']
        .map(esc)
        .join(','),
    );
    const csv = '﻿' + [header.join(','), ...rows].join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const catName = categories.find((c) => c.id === activeCat)?.name ?? 'vocab';
    a.href = url;
    a.download = `${code}-${catName}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [words, categories, activeCat, code]);

  // ─── Header right slot ─────────────────────────────────────────
  const headerRight = (
    <div className="flex items-center gap-2">
      <Segmented<View>
        idBase="vocab-view"
        value={view}
        onChange={setView}
        options={[
          { value: 'list', label: 'Danh sách', icon: <List size={15} /> },
          { value: 'cards', label: 'Thẻ', icon: <Layers size={15} /> },
          { value: 'quiz', label: 'Quiz', icon: <HelpCircle size={15} /> },
        ]}
      />
      {view === 'list' && !reviewMode && (
        <button
          type="button"
          onClick={exportCsv}
          title="Tải CSV"
          aria-label="Tải CSV"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-text-muted ring-1 ring-[var(--border-color)] transition hover:text-neon-violet hover:ring-neon-violet/40"
        >
          <Download size={16} />
        </button>
      )}
    </div>
  );

  const showCatBar = !reviewMode;
  const empty = !loading && words.length === 0;

  return (
    <SectionShell code={code} title="Từ vựng" icon={<BookOpen className="text-neon-violet" />} right={headerRight}>
      {reviewMode && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-neon-cyan/10 px-3 py-2 text-sm text-neon-cyan ring-1 ring-neon-cyan/25">
          <RotateCcw size={15} />
          Bộ ôn tập hôm nay · {words.length} từ
        </div>
      )}

      {/* Category chips + search (list-affecting filters) */}
      {showCatBar && (
        <div className="mb-4 space-y-3">
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((c) => (
              <Chip
                key={c.id}
                active={srcKind === 'category' && c.id === activeCat}
                onClick={() => pickCategory(c.id)}
              >
                <span className="inline-flex items-center gap-1.5">
                  {c.icon && <span aria-hidden>{c.icon}</span>}
                  {c.name}
                  {typeof c.wordCount === 'number' && (
                    <span className="text-text-muted">({c.wordCount})</span>
                  )}
                </span>
              </Chip>
            ))}
          </div>

          {/* Personal sources: ❤️ favorites + named collections (playlists) */}
          {isAuthenticated && (
            <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <Chip active={srcKind === 'favorites'} onClick={pickFavorites}>
                <span className="inline-flex items-center gap-1.5">
                  <Heart size={13} className={srcKind === 'favorites' ? 'fill-current' : ''} />
                  Yêu thích
                  <span className="text-text-muted">({favIds.size})</span>
                </span>
              </Chip>
              {collections.map((cl) => (
                <Chip
                  key={cl.id}
                  active={srcKind === 'collection' && cl.id === activeColl}
                  onClick={() => pickCollection(cl.id)}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <span aria-hidden>{cl.icon || '📁'}</span>
                    {cl.name}
                    <span className="text-text-muted">({cl.wordCount})</span>
                  </span>
                </Chip>
              ))}
              <button
                type="button"
                onClick={() => setCollSheet('manage')}
                className="inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-text-muted ring-1 ring-[var(--border-color)] transition hover:text-neon-violet hover:ring-neon-violet/40"
              >
                <Plus size={13} /> Bộ sưu tập
              </button>
              {srcKind === 'category' && activeCat != null && (
                <button
                  type="button"
                  onClick={() => setCollSheet({ categoryId: activeCat })}
                  title="Lưu cả chủ đề này vào một bộ sưu tập"
                  className="inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-text-muted ring-1 ring-[var(--border-color)] transition hover:text-neon-violet hover:ring-neon-violet/40"
                >
                  <FolderPlus size={13} /> Lưu cả chủ đề
                </button>
              )}
            </div>
          )}
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm từ vựng…"
              className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] py-2.5 pl-9 pr-9 text-sm text-text-primary placeholder:text-text-muted focus:border-neon-violet/50 focus:outline-none focus:ring-2 focus:ring-neon-violet/20"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label="Xoá tìm kiếm"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-text-muted hover:text-text-primary"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Body */}
      {loading ? (
        <CardsSkeleton />
      ) : empty ? (
        <EmptyState
          title={srcKind === 'favorites' ? 'Chưa có từ yêu thích' : srcKind === 'collection' ? 'Bộ sưu tập trống' : 'Chưa có từ vựng'}
          hint={
            reviewMode
              ? 'Không có từ nào cần ôn hôm nay. Quay lại sau nhé!'
              : srcKind === 'favorites'
                ? 'Bấm ♥ trên một từ bất kỳ để thêm vào đây.'
                : srcKind === 'collection'
                  ? 'Bấm nút ＋ trên từ (hoặc "Lưu cả chủ đề") để thêm từ vào bộ sưu tập.'
                  : 'Danh mục này chưa có từ, hãy chọn danh mục khác.'
          }
        />
      ) : view === 'list' ? (
        <ListView
          words={words}
          statuses={statuses}
          isAuthenticated={isAuthenticated}
          onCycle={cycleStatus}
          favIds={favIds}
          onToggleFav={toggleFav}
          onAddToCollection={(w) => setCollSheet({ word: w })}
          onRemoveFromCollection={srcKind === 'collection' ? removeFromActiveCollection : undefined}
          canLoadMore={srcKind === 'category' && !debounced.trim() && page < totalPages}
          loadingMore={loadingMore}
          onLoadMore={loadMore}
        />
      ) : view === 'cards' ? (
        <FlashcardsView
          words={words}
          isAuthenticated={isAuthenticated}
          reduced={reduced}
          favIds={favIds}
          onToggleFav={toggleFav}
        />
      ) : (
        <QuizView
          words={words}
          languageId={languageId}
          categoryId={srcKind === 'category' && !reviewMode ? activeCat : null}
          isAuthenticated={isAuthenticated}
          reduced={reduced}
        />
      )}

      {/* Collection sheet: create/rename/delete + add word/category target */}
      {collSheet !== null && (
        <CollectionSheet
          code={code}
          collections={collections}
          target={collSheet === 'manage' ? null : collSheet}
          onPick={(id) => {
            if (collSheet !== 'manage') void addToCollection(id, collSheet);
          }}
          onChanged={refreshCollections}
          onClose={() => setCollSheet(null)}
          onDeleted={(id) => {
            if (srcKind === 'collection' && activeColl === id) {
              setSrcKind('category');
              setActiveColl(null);
            }
          }}
        />
      )}
    </SectionShell>
  );
}

// ─── Heart button (favorite toggle) ──────────────────────────────
function HeartButton({ active, onClick, size = 15 }: { active: boolean; onClick: () => void; size?: number }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={active ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
      aria-label={active ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
      aria-pressed={active}
      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition ${
        active
          ? 'text-neon-pink'
          : 'text-text-muted hover:text-neon-pink'
      }`}
    >
      <Heart size={size} className={active ? 'fill-current' : ''} />
    </button>
  );
}

// ─── List view ───────────────────────────────────────────────────
function ListView({
  words,
  statuses,
  isAuthenticated,
  onCycle,
  favIds,
  onToggleFav,
  onAddToCollection,
  onRemoveFromCollection,
  canLoadMore,
  loadingMore,
  onLoadMore,
}: {
  words: VocabWord[];
  statuses: Map<number, LangLearnStatus>;
  isAuthenticated: boolean;
  onCycle: (w: VocabWord) => void;
  favIds: Set<number>;
  onToggleFav: (w: VocabWord) => void;
  onAddToCollection: (w: VocabWord) => void;
  onRemoveFromCollection?: (w: VocabWord) => void;
  canLoadMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {words.map((w) => (
          <div key={w.id} className="card flex gap-3 p-4">
            {w.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={getImageUrl(w.imageUrl ?? undefined)}
                alt={w.word}
                className="h-16 w-16 shrink-0 rounded-lg object-cover ring-1 ring-[var(--border-color)]"
              />
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-xl font-bold text-text-primary">{w.word}</span>
                    <SpeakerButton
                      text={w.word}
                      reading={w.pronunciations?.[0]?.value}
                      audioUrl={w.audioUrl}
                    />
                  </div>
                  {(w.pronunciations?.length ?? 0) > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {w.pronunciations.map((p, i) => (
                        <span
                          key={p.id ?? i}
                          className="rounded-full bg-[var(--bg-surface)] px-2 py-0.5 text-[11px] text-text-secondary ring-1 ring-[var(--border-color)]"
                        >
                          <span className="text-text-muted">{p.type}:</span> {p.value}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {isAuthenticated && (
                  <div className="flex shrink-0 items-center gap-0.5">
                    <HeartButton active={favIds.has(w.id)} onClick={() => onToggleFav(w)} />
                    <button
                      type="button"
                      onClick={() => onAddToCollection(w)}
                      title="Lưu vào bộ sưu tập"
                      aria-label="Lưu vào bộ sưu tập"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full text-text-muted transition hover:text-neon-violet"
                    >
                      <FolderPlus size={15} />
                    </button>
                    {onRemoveFromCollection && (
                      <button
                        type="button"
                        onClick={() => onRemoveFromCollection(w)}
                        title="Gỡ khỏi bộ sưu tập này"
                        aria-label="Gỡ khỏi bộ sưu tập này"
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full text-text-muted transition hover:text-neon-pink"
                      >
                        <X size={15} />
                      </button>
                    )}
                    <StatusPill status={statuses.get(w.id) ?? 'NEW'} onClick={() => onCycle(w)} />
                  </div>
                )}
              </div>
              <p className="mt-2 text-text-primary">{w.meaningVi}</p>
              {w.exampleSentence && (
                <p className="mt-1.5 text-sm text-text-secondary">{w.exampleSentence}</p>
              )}
              {w.exampleMeaning && (
                <p className="text-sm text-text-muted">{w.exampleMeaning}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      {canLoadMore && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={loadingMore}
            className="rounded-full bg-neon-violet/20 px-5 py-2 text-sm font-medium text-neon-violet ring-1 ring-neon-violet/40 transition hover:bg-neon-violet/30 disabled:opacity-60"
          >
            {loadingMore ? 'Đang tải…' : 'Tải thêm'}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Flashcards view ─────────────────────────────────────────────
const RATINGS: { label: string; quality: number; cls: string }[] = [
  { label: 'Again', quality: 2, cls: 'bg-neon-pink/15 text-neon-pink ring-neon-pink/30' },
  { label: 'Hard', quality: 3, cls: 'bg-neon-orange/15 text-neon-orange ring-neon-orange/30' },
  { label: 'Good', quality: 4, cls: 'bg-neon-cyan/15 text-neon-cyan ring-neon-cyan/30' },
  { label: 'Easy', quality: 5, cls: 'bg-neon-green/15 text-neon-green ring-neon-green/30' },
];

function FlashcardsView({
  words,
  isAuthenticated,
  reduced,
  favIds,
  onToggleFav,
}: {
  words: VocabWord[];
  isAuthenticated: boolean;
  reduced: boolean;
  favIds: Set<number>;
  onToggleFav: (w: VocabWord) => void;
}) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);
  // Which face's CONTENT is rendered. Only one face exists in the DOM —
  // two-face flips relying on preserve-3d + backface-visibility break on
  // some Chromium builds (Cốc Cốc flattens the 3D context: faces bleed
  // through or vanish entirely). Instead the card rotates as a whole and
  // the content swaps exactly at the flip midpoint (edge-on, invisible).
  const [showBack, setShowBack] = useState(false);
  const flipDur = reduced ? 0 : 0.3;

  useEffect(() => {
    setIndex(0);
    setFlipped(false);
    setShowBack(false);
    setDone(false);
  }, [words]);

  // New card must show its front immediately — never leak the answer.
  useEffect(() => {
    setShowBack(false);
  }, [index]);

  useEffect(() => {
    if (flipped === showBack) return;
    const t = setTimeout(() => setShowBack(flipped), (flipDur * 1000) / 2);
    return () => clearTimeout(t);
  }, [flipped, showBack, flipDur]);

  const advance = useCallback(() => {
    setFlipped(false);
    setIndex((i) => {
      if (i + 1 >= words.length) {
        setDone(true);
        return i;
      }
      return i + 1;
    });
  }, [words.length]);

  const rate = useCallback(
    async (quality: number) => {
      const w = words[index];
      if (w) {
        try {
          await languageApi.recordProgress({ itemType: 'VOCAB', itemId: w.id, quality });
        } catch {
          toast.error('Không lưu được kết quả');
        }
      }
      advance();
    },
    [words, index, advance],
  );

  const restart = () => {
    setIndex(0);
    setFlipped(false);
    setDone(false);
  };

  if (done) {
    return (
      <div className="card flex flex-col items-center gap-4 py-14 text-center">
        <div className="text-5xl">🎉</div>
        <p className="text-lg font-semibold text-text-primary">Hoàn thành bộ thẻ!</p>
        <p className="text-sm text-text-muted">Bạn đã ôn hết {words.length} từ.</p>
        <button
          type="button"
          onClick={restart}
          className="inline-flex items-center gap-2 rounded-full bg-neon-violet/20 px-5 py-2 text-sm font-medium text-neon-violet ring-1 ring-neon-violet/40 hover:bg-neon-violet/30"
        >
          <RotateCcw size={15} /> Ôn lại
        </button>
      </div>
    );
  }

  const w = words[index];
  if (!w) return null;

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-3 flex items-center justify-center gap-2 text-sm font-medium text-text-muted">
        <span>
          {index + 1} / {words.length}
        </span>
        {isAuthenticated && <HeartButton active={favIds.has(w.id)} onClick={() => onToggleFav(w)} size={14} />}
      </div>

      <div className="[perspective:1200px]">
        <motion.button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          className="relative block h-72 w-full cursor-pointer rounded-2xl"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: flipDur, ease: 'easeInOut' }}
          aria-label="Lật thẻ"
        >
          {/* Single face: content swaps at the flip midpoint (card edge-on).
              The back content gets its own rotateY(180) so it isn't mirrored
              inside the 180°-rotated button. Plain flat transforms only. */}
          <div
            className={`card absolute inset-0 flex flex-col items-center justify-center ${
              showBack ? 'gap-3 overflow-auto px-6 py-5 text-center' : 'gap-4'
            }`}
            style={showBack ? { transform: 'rotateY(180deg)' } : undefined}
          >
            {showBack ? (
              <>
                {(w.pronunciations?.length ?? 0) > 0 && (
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {w.pronunciations.map((p, i) => (
                      <span
                        key={p.id ?? i}
                        className="rounded-full bg-[var(--bg-surface)] px-2 py-0.5 text-[11px] text-text-secondary ring-1 ring-[var(--border-color)]"
                      >
                        <span className="text-text-muted">{p.type}:</span> {p.value}
                      </span>
                    ))}
                  </div>
                )}
                <span className="text-2xl font-semibold text-text-primary">{w.meaningVi}</span>
                {w.exampleSentence && <p className="text-sm text-text-secondary">{w.exampleSentence}</p>}
                {w.exampleMeaning && <p className="text-sm text-text-muted">{w.exampleMeaning}</p>}
              </>
            ) : (
              <>
                <span className="text-4xl font-bold text-text-primary">{w.word}</span>
                <SpeakerButton text={w.word} reading={w.pronunciations?.[0]?.value} audioUrl={w.audioUrl} />
                <span className="text-xs text-text-muted">Chạm để lật</span>
              </>
            )}
          </div>
        </motion.button>
      </div>

      {flipped ? (
        isAuthenticated ? (
          <div className="mt-4 grid grid-cols-4 gap-2">
            {RATINGS.map((r) => (
              <button
                key={r.label}
                type="button"
                onClick={() => void rate(r.quality)}
                className={`rounded-xl py-2.5 text-sm font-semibold ring-1 transition hover:opacity-85 ${r.cls}`}
              >
                {r.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={advance}
              className="inline-flex items-center gap-2 rounded-full bg-neon-violet/20 px-5 py-2 text-sm font-medium text-neon-violet ring-1 ring-neon-violet/40 hover:bg-neon-violet/30"
            >
              Tiếp <ChevronRight size={15} />
            </button>
          </div>
        )
      ) : (
        <p className="mt-4 text-center text-xs text-text-muted">Lật thẻ để xem nghĩa</p>
      )}
    </div>
  );
}

// ─── Quiz view ───────────────────────────────────────────────────
interface QuizQuestion {
  key: string;
  word: VocabWord;
  prompt: string;
  correct: string;
  options: string[];
}

function buildQuiz(words: VocabWord[]): QuizQuestion[] {
  return shuffle(words).map((w, qi) => {
    const w2m = Math.random() < 0.5;
    const prompt = w2m ? w.word : w.meaningVi;
    const correct = w2m ? w.meaningVi : w.word;
    const pool = words.filter((o) => o.id !== w.id);
    const distractors = shuffle(pool)
      .slice(0, 3)
      .map((o) => (w2m ? o.meaningVi : o.word));
    return {
      key: `${w.id}-${qi}`,
      word: w,
      prompt,
      correct,
      options: shuffle([correct, ...distractors]),
    };
  });
}

function QuizView({
  words,
  languageId,
  categoryId,
  isAuthenticated,
  reduced,
}: {
  words: VocabWord[];
  languageId: number | null;
  categoryId: number | null;
  isAuthenticated: boolean;
  reduced: boolean;
}) {
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => buildQuiz(words));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const submittedRef = useRef(false);

  const regenerate = useCallback(() => {
    setQuestions(buildQuiz(words));
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    submittedRef.current = false;
  }, [words]);

  useEffect(() => {
    regenerate();
  }, [regenerate]);

  // Persist quiz result once at the end.
  useEffect(() => {
    if (!finished || submittedRef.current) return;
    submittedRef.current = true;
    if (isAuthenticated && languageId != null) {
      void languageApi
        .quizResult({ languageId, categoryId, score, total: questions.length })
        .catch(() => {
          /* non-fatal */
        });
    }
  }, [finished, isAuthenticated, languageId, categoryId, score, questions.length]);

  if (words.length < 4) {
    return (
      <EmptyState
        emoji="🧩"
        title="Cần ít nhất 4 từ để làm quiz"
        hint="Hãy chọn một danh mục có nhiều từ hơn."
      />
    );
  }

  if (finished) {
    const pct = questions.length ? Math.round((score / questions.length) * 100) : 0;
    const celebrate = pct >= 90;
    return (
      <div className="relative card flex flex-col items-center gap-4 overflow-hidden py-14 text-center">
        {celebrate && <ConfettiBurst reduced={reduced} />}
        <div className="text-5xl">{celebrate ? '🏆' : pct >= 50 ? '👍' : '📚'}</div>
        <p className="text-lg font-semibold text-text-primary">
          {score} / {questions.length} đúng
        </p>
        <p className="text-sm text-text-muted">{pct}%</p>
        <button
          type="button"
          onClick={regenerate}
          className="inline-flex items-center gap-2 rounded-full bg-neon-violet/20 px-5 py-2 text-sm font-medium text-neon-violet ring-1 ring-neon-violet/40 hover:bg-neon-violet/30"
        >
          <RotateCcw size={15} /> Làm lại
        </button>
      </div>
    );
  }

  const q = questions[index];
  if (!q) return null;
  const answered = selected !== null;

  const choose = (opt: string) => {
    if (answered) return;
    setSelected(opt);
    if (opt === q.correct) setScore((s) => s + 1);
  };

  const next = () => {
    if (index + 1 >= questions.length) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  };

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-3 flex items-center justify-between text-sm font-medium text-text-muted">
        <span>
          Câu {index + 1} / {questions.length}
        </span>
        <span className="text-neon-violet">Điểm: {score}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={q.key}
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8, pointerEvents: 'none' }}
          transition={{ duration: reduced ? 0 : 0.2, ease: 'easeOut' }}
        >
          <div className="card mb-4 flex min-h-24 items-center justify-center gap-3 p-6 text-center">
            <span className="text-2xl font-bold text-text-primary">{q.prompt}</span>
            <SpeakerButton text={q.word.word} reading={q.word.pronunciations?.[0]?.value} audioUrl={q.word.audioUrl} />
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {q.options.map((opt) => {
              const isCorrect = opt === q.correct;
              const isPicked = opt === selected;
              let cls =
                'border-[var(--border-color)] bg-[var(--bg-card)] text-text-primary hover:border-neon-violet/40';
              if (answered) {
                if (isCorrect) cls = 'border-neon-green/50 bg-neon-green/15 text-neon-green';
                else if (isPicked) cls = 'border-neon-pink/50 bg-neon-pink/15 text-neon-pink';
                else cls = 'border-[var(--border-color)] bg-[var(--bg-card)] text-text-muted';
              }
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => choose(opt)}
                  disabled={answered}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${cls}`}
                >
                  <span>{opt}</span>
                  {answered && isCorrect && <Check size={16} />}
                  {answered && isPicked && !isCorrect && <X size={16} />}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {answered && (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={next}
            className="inline-flex items-center gap-2 rounded-full bg-neon-violet/20 px-5 py-2 text-sm font-medium text-neon-violet ring-1 ring-neon-violet/40 hover:bg-neon-violet/30"
          >
            {index + 1 >= questions.length ? 'Xem kết quả' : 'Tiếp'} <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Collection sheet (create / rename / delete / pick target) ───
function CollectionSheet({
  code,
  collections,
  target,
  onPick,
  onChanged,
  onClose,
  onDeleted,
}: {
  code: string;
  collections: VocabCollection[];
  /** When set, clicking a collection adds this word/category into it. */
  target: { word?: VocabWord; categoryId?: number } | null;
  onPick: (collectionId: number) => void;
  onChanged: () => void;
  onClose: () => void;
  onDeleted: (collectionId: number) => void;
}) {
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  const create = async () => {
    const n = name.trim();
    // busy guard: Enter + click "Tạo" can fire together — the second request
    // would trip the DB unique constraint after the first one succeeds.
    if (!n || busy) return;
    setBusy(true);
    try {
      await languageApi.createCollection({ code, name: n });
      setName('');
      onChanged();
      toast.success(`Đã tạo bộ sưu tập “${n}”`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Không tạo được bộ sưu tập');
    } finally {
      setBusy(false);
    }
  };

  const rename = async (id: number) => {
    const n = editName.trim();
    if (!n || busy) return;
    setBusy(true);
    try {
      await languageApi.updateCollection(id, { name: n });
      setEditingId(null);
      onChanged();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Không đổi tên được');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (cl: VocabCollection) => {
    if (!window.confirm(`Xoá bộ sưu tập “${cl.name}”? Các từ trong đó không bị mất khỏi từ điển.`)) return;
    setBusy(true);
    try {
      await languageApi.deleteCollection(cl.id);
      onDeleted(cl.id);
      onChanged();
      toast.success('Đã xoá bộ sưu tập');
    } catch {
      toast.error('Không xoá được bộ sưu tập');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Bộ sưu tập từ vựng"
    >
      <div
        className="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-t-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold text-text-primary">
            {target
              ? target.word
                ? `Lưu “${target.word.word}” vào…`
                : 'Lưu cả chủ đề vào…'
              : 'Bộ sưu tập của bạn'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="rounded-full p-1.5 text-text-muted hover:text-text-primary"
          >
            <X size={16} />
          </button>
        </div>

        {/* Create new */}
        <div className="mb-3 flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') void create();
            }}
            placeholder="Tên bộ sưu tập mới… (vd: Từ khó, Ôn thi N5)"
            maxLength={120}
            className="min-w-0 flex-1 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-neon-violet/50 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => void create()}
            disabled={busy || !name.trim()}
            className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-neon-violet/20 px-3 py-2 text-sm font-medium text-neon-violet ring-1 ring-neon-violet/40 transition hover:bg-neon-violet/30 disabled:opacity-50"
          >
            <Plus size={14} /> Tạo
          </button>
        </div>

        {/* List */}
        {collections.length === 0 ? (
          <p className="py-6 text-center text-sm text-text-muted">
            Chưa có bộ sưu tập nào — tạo một cái ở trên nhé.
          </p>
        ) : (
          <div className="space-y-1.5">
            {collections.map((cl) => (
              <div
                key={cl.id}
                className="flex items-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2"
              >
                {editingId === cl.id ? (
                  <>
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') void rename(cl.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      maxLength={120}
                      autoFocus
                      className="min-w-0 flex-1 rounded-lg border border-neon-violet/40 bg-[var(--bg-card)] px-2 py-1 text-sm text-text-primary focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => void rename(cl.id)}
                      disabled={busy}
                      className="rounded-full p-1.5 text-neon-green hover:bg-neon-green/10"
                      aria-label="Lưu tên"
                    >
                      <Check size={15} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => (target ? onPick(cl.id) : undefined)}
                      disabled={busy}
                      className={`flex min-w-0 flex-1 items-center gap-2 text-left text-sm text-text-primary ${
                        target ? 'cursor-pointer hover:text-neon-violet' : 'cursor-default'
                      }`}
                    >
                      <span aria-hidden>{cl.icon || <Folder size={15} className="text-text-muted" />}</span>
                      <span className="truncate font-medium">{cl.name}</span>
                      <span className="shrink-0 text-xs text-text-muted">({cl.wordCount} từ)</span>
                      {target && <ChevronRight size={14} className="ml-auto shrink-0 text-text-muted" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(cl.id);
                        setEditName(cl.name);
                      }}
                      className="rounded-full p-1.5 text-text-muted hover:text-neon-violet"
                      aria-label={`Đổi tên ${cl.name}`}
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => void remove(cl)}
                      className="rounded-full p-1.5 text-text-muted hover:text-neon-pink"
                      aria-label={`Xoá ${cl.name}`}
                    >
                      <Trash2 size={13} />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {target && (
          <p className="mt-3 text-center text-xs text-text-muted">
            Chạm vào một bộ sưu tập để lưu. Từ trùng sẽ tự bỏ qua.
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Confetti (emoji burst, CSS) ─────────────────────────────────
function ConfettiBurst({ reduced }: { reduced: boolean }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        emoji: ['🎉', '✨', '🎊', '⭐'][i % 4],
        left: Math.random() * 100,
        delay: Math.random() * 0.3,
        dur: 1.2 + Math.random() * 0.8,
      })),
    [],
  );
  if (reduced) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute text-xl"
          style={{ left: `${p.left}%`, top: '-8%' }}
          initial={{ y: 0, opacity: 0, rotate: 0 }}
          animate={{ y: '120%', opacity: [0, 1, 1, 0], rotate: 360 }}
          transition={{ duration: p.dur, delay: p.delay, ease: 'easeIn' }}
        >
          {p.emoji}
        </motion.span>
      ))}
    </div>
  );
}
