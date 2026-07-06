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
} from 'lucide-react';
import { toast } from 'sonner';

import { languageApi } from '@/lib/language-api';
import type { VocabCategory, VocabWord, LangLearnStatus } from '@/types/language';
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
    [code, debounced, activeCat, reviewMode],
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
              <Chip key={c.id} active={c.id === activeCat} onClick={() => setActiveCat(c.id)}>
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
          title="Chưa có từ vựng"
          hint={
            reviewMode
              ? 'Không có từ nào cần ôn hôm nay. Quay lại sau nhé!'
              : 'Danh mục này chưa có từ, hãy chọn danh mục khác.'
          }
        />
      ) : view === 'list' ? (
        <ListView
          words={words}
          statuses={statuses}
          isAuthenticated={isAuthenticated}
          onCycle={cycleStatus}
          canLoadMore={!debounced.trim() && page < totalPages}
          loadingMore={loadingMore}
          onLoadMore={loadMore}
        />
      ) : view === 'cards' ? (
        <FlashcardsView words={words} isAuthenticated={isAuthenticated} reduced={reduced} />
      ) : (
        <QuizView
          words={words}
          languageId={languageId}
          categoryId={reviewMode ? null : activeCat}
          isAuthenticated={isAuthenticated}
          reduced={reduced}
        />
      )}
    </SectionShell>
  );
}

// ─── List view ───────────────────────────────────────────────────
function ListView({
  words,
  statuses,
  isAuthenticated,
  onCycle,
  canLoadMore,
  loadingMore,
  onLoadMore,
}: {
  words: VocabWord[];
  statuses: Map<number, LangLearnStatus>;
  isAuthenticated: boolean;
  onCycle: (w: VocabWord) => void;
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
                  <StatusPill status={statuses.get(w.id) ?? 'NEW'} onClick={() => onCycle(w)} />
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
}: {
  words: VocabWord[];
  isAuthenticated: boolean;
  reduced: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setIndex(0);
    setFlipped(false);
    setDone(false);
  }, [words]);

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
  const flipDur = reduced ? 0 : 0.3;

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-3 text-center text-sm font-medium text-text-muted">
        {index + 1} / {words.length}
      </div>

      <div className="[perspective:1200px]">
        <motion.button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          className="relative block h-72 w-full cursor-pointer rounded-2xl [transform-style:preserve-3d]"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: flipDur, ease: 'easeInOut' }}
          aria-label="Lật thẻ"
        >
          {/* Front */}
          <div className="card absolute inset-0 flex flex-col items-center justify-center gap-4 [backface-visibility:hidden]">
            <span className="text-4xl font-bold text-text-primary">{w.word}</span>
            <SpeakerButton text={w.word} reading={w.pronunciations?.[0]?.value} audioUrl={w.audioUrl} />
            <span className="text-xs text-text-muted">Chạm để lật</span>
          </div>
          {/* Back */}
          <div className="card absolute inset-0 flex flex-col items-center justify-center gap-3 overflow-auto px-6 py-5 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
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
