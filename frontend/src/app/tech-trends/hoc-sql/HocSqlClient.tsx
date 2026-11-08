'use client';

/**
 * Khoá "Học SQL & Database từ số 0".
 *
 * Ghi chú giao diện, giống các chuyên đề khác dưới /tech-trends:
 *  - Trang tự mang nền tối cố định (#0a0a0f) và KHÔNG dùng biến thể `dark:`
 *    của Tailwind — ở dự án này `dark:` được giữ riêng cho khối Notes.
 *  - Tiến độ đọc từ localStorage CHỈ SAU KHI mount (`hydrated`), nếu không
 *    HTML server và client lệch nhau.
 *  - Mọi con số ở phần đầu lấy từ `STATS`, tính từ dữ liệu — không viết tay.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, BookOpen, CheckCircle2, Circle, Map, ArrowLeftRight,
  Layers, Search, X, Terminal, Clock, Lock, Sparkles, ListChecks,
} from 'lucide-react';
import {
  CHAPTERS, STATS, PROGRESS_KEY, STAGES, stageOf, deaccent,
  labModuleHref, type Chapter,
} from './data';
import Blocks from './Blocks';
import Figure from './Figures';
import RoadmapView from './RoadmapView';
import MssqlView from './MssqlView';
import FlashDeck from './FlashDeck';
import LabPanel from './LabPanel';

type TabId = 'hoc' | 'lotrinh' | 'mssql' | 'ontap' | 'tracuu';

const TABS: { id: TabId; label: string; icon: typeof BookOpen }[] = [
  { id: 'hoc', label: 'Bài học', icon: BookOpen },
  { id: 'lotrinh', label: 'Lộ trình', icon: Map },
  { id: 'mssql', label: 'SQL Server ↔ Postgres', icon: ArrowLeftRight },
  { id: 'ontap', label: 'Ôn tập', icon: Layers },
  { id: 'tracuu', label: 'Tra cứu', icon: Search },
];

/* ── Nội dung một chương ──────────────────────────────────────────── */

function ChapterView({ ch }: { ch: Chapter }) {
  const stage = stageOf(ch.no);
  return (
    <article>
      <header className="mb-6 border-b border-[var(--border-light)] pb-5">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-text-muted">CHƯƠNG {String(ch.no).padStart(2, '0')}</span>
          <span className="text-xs text-text-muted">·</span>
          <span className="text-xs text-text-muted">{stage.title}</span>
          <span className="inline-flex items-center gap-1 rounded-md border border-[var(--border-light)] bg-[var(--bg-surface-hover)] px-1.5 py-px text-[11px] text-text-secondary">
            <Clock className="h-3 w-3" /> {ch.minutes} phút
          </span>
        </div>
        <h2 className="text-2xl font-bold leading-tight text-text-primary sm:text-3xl">
          {ch.icon} {ch.title}
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-text-secondary">{ch.tagline}</p>

        <div className="mt-4 rounded-2xl border border-violet-400/25 bg-violet-500/[0.07] p-4">
          <p className="mb-2 flex items-center gap-2 text-sm font-bold text-tone-violet">
            <ListChecks className="h-4 w-4" /> Học xong chương này bạn LÀM được
          </p>
          <ul className="space-y-1.5">
            {ch.goals.map((g) => (
              <li key={g} className="flex gap-2.5 text-[14px] leading-relaxed text-text-secondary">
                <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400/70" />
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </div>
      </header>

      {ch.status === 'full' ? (
        <Blocks blocks={ch.blocks} />
      ) : (
        <div className="rounded-2xl border border-amber-400/25 bg-amber-500/[0.06] p-4 sm:p-5">
          <p className="mb-2 flex items-center gap-2 text-sm font-bold text-tone-amber">
            <Lock className="h-4 w-4" /> Chương này mới có khung — phần chữ đang viết
          </p>
          <p className="mb-4 text-[14.5px] leading-relaxed text-text-secondary">
            Nội dung chi tiết sẽ được bổ sung. Nhưng bạn <b className="text-text-primary">không phải chờ</b>:{' '}
            {ch.labCount} bài tập của chương này đã sẵn sàng bên Code Lab, mỗi bài có đề bài,
            gợi ý và lời giải chạy được trên PostgreSQL thật.
          </p>
          {ch.todo && (
            <>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">Các đề mục sẽ viết</p>
              <ul className="space-y-1.5">
                {ch.todo.map((t) => (
                  <li key={t} className="flex gap-2.5 text-[13.5px] leading-relaxed text-text-secondary">
                    <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-amber-400/60" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      <LabPanel chapter={ch} />

      {ch.flash && ch.flash.length > 0 && (
        <div className="mt-6">
          <FlashDeck cards={ch.flash} />
        </div>
      )}
    </article>
  );
}

/* ── Tab tra cứu ──────────────────────────────────────────────────── */

interface Hit { no: number; title: string; icon: string; kind: string; text: string }

function SearchTab({ onOpen }: { onOpen: (no: number) => void }) {
  const [q, setQ] = useState('');

  const index = useMemo<Hit[]>(() => {
    const out: Hit[] = [];
    CHAPTERS.forEach((c) => {
      c.goals.forEach((g) => out.push({ no: c.no, title: c.title, icon: c.icon, kind: 'Mục tiêu', text: g }));
      c.todo?.forEach((t) => out.push({ no: c.no, title: c.title, icon: c.icon, kind: 'Đề mục', text: t }));
      c.blocks.forEach((b) => {
        if (b.kind === 'h') out.push({ no: c.no, title: c.title, icon: c.icon, kind: 'Đề mục', text: b.text });
        else if (b.kind === 'p') out.push({ no: c.no, title: c.title, icon: c.icon, kind: 'Đoạn văn', text: b.text });
        else if (b.kind === 'note') out.push({ no: c.no, title: c.title, icon: c.icon, kind: b.title ? `Lưu ý · ${b.title}` : 'Lưu ý', text: b.text });
        else if (b.kind === 'mssql') out.push({ no: c.no, title: c.title, icon: c.icon, kind: 'Đối chiếu SQL Server', text: `${b.text} ${b.pg ?? ''} ${b.ms ?? ''}` });
        else if (b.kind === 'code') out.push({ no: c.no, title: c.title, icon: c.icon, kind: b.caption ?? 'Code', text: b.code });
        else if (b.kind === 'quiz') out.push({ no: c.no, title: c.title, icon: c.icon, kind: 'Câu hỏi', text: `${b.q} ${b.explain}` });
      });
      c.flash?.forEach((f) => out.push({ no: c.no, title: c.title, icon: c.icon, kind: 'Thẻ ôn', text: `${f.q} ${f.a}` }));
    });
    return out;
  }, []);

  const hits = useMemo(() => {
    const needle = deaccent(q.trim());
    if (needle.length < 2) return [];
    return index.filter((h) => deaccent(h.text).includes(needle)).slice(0, 60);
  }, [q, index]);

  return (
    <div>
      <div className="relative mb-4">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search the whole course — diacritics optional: null, join, index, transaction…"
          className="w-full rounded-xl border border-[var(--border-light)] bg-[var(--bg-surface-hover)] py-2.5 pl-10 pr-10 text-sm text-text-primary placeholder:text-text-muted focus:border-violet-400/50 focus:outline-none"
        />
        {q && (
          <button
            type="button"
            onClick={() => setQ('')}
            aria-label="Xoá từ khoá"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted transition-colors hover:text-text-primary"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {q.trim().length < 2 ? (
        <div className="rounded-2xl border border-[var(--border-light)] bg-[var(--bg-surface-hover)] px-4 py-8 text-center">
          <p className="mb-3 text-sm text-text-muted">Gõ ít nhất 2 ký tự. Thử vài từ hay tra:</p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {['null', 'join', 'index', 'group by', 'transaction', 'phan trang', 'kieu tien', 'timestamptz', 'upsert'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setQ(s)}
                className="rounded-lg border border-[var(--border-light)] bg-[var(--bg-surface-hover)] px-2.5 py-1 font-mono text-xs text-text-secondary transition-all hover:border-violet-400/40 hover:text-text-primary active:scale-95"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : hits.length === 0 ? (
        <p className="rounded-2xl border border-[var(--border-light)] bg-[var(--bg-surface-hover)] px-4 py-8 text-center text-sm text-text-muted">
          Không tìm thấy &quot;{q}&quot;. Thử từ khoá ngắn hơn.
        </p>
      ) : (
        <>
          <p className="mb-2 text-xs text-text-muted"><b className="text-text-secondary">{hits.length}</b> kết quả</p>
          <div className="space-y-1.5">
            {hits.map((h, i) => (
              <button
                key={`${h.no}-${i}`}
                type="button"
                onClick={() => onOpen(h.no)}
                className="block w-full rounded-xl border border-[var(--border-light)] bg-[var(--bg-surface-hover)] px-3.5 py-2.5 text-left transition-all hover:border-violet-400/40 hover:bg-[var(--bg-surface-hover)] active:scale-[0.99]"
              >
                <span className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] text-text-muted">CH.{String(h.no).padStart(2, '0')}</span>
                  <span className="text-[11px] text-text-secondary">{h.icon} {h.title}</span>
                  <span className="rounded border border-[var(--border-light)] bg-[var(--bg-surface-hover)] px-1.5 py-px text-[10px] text-text-muted">{h.kind}</span>
                </span>
                <span className="block line-clamp-2 text-[13px] leading-relaxed text-text-secondary">
                  {h.text.replace(/\*\*/g, '').replace(/`/g, '')}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Trang chính ──────────────────────────────────────────────────── */

export default function HocSqlClient() {
  const [tab, setTab] = useState<TabId>('hoc');
  const [activeNo, setActiveNo] = useState(0);
  const [done, setDone] = useState<Record<number, boolean>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      if (raw) setDone(JSON.parse(raw));
    } catch { /* localStorage bị chặn — cứ chạy tiếp, chỉ mất tiến độ */ }
    setHydrated(true);
  }, []);

  const toggleDone = useCallback((no: number) => {
    setDone((prev) => {
      const next = { ...prev, [no]: !prev[no] };
      try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(next)); } catch { /* bỏ qua */ }
      return next;
    });
  }, []);

  const ch = CHAPTERS.find((c) => c.no === activeNo) ?? CHAPTERS[0];
  const doneCount = hydrated ? CHAPTERS.filter((c) => done[c.no]).length : 0;

  const open = useCallback((no: number) => {
    setActiveNo(no);
    setTab('hoc');
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const allFlash = useMemo(
    () => CHAPTERS.flatMap((c) => (c.flash ?? []).map((f) => ({ ...f, no: c.no, chTitle: c.title }))),
    [],
  );

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <Link
          href="/tech-trends"
          className="mb-6 inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Về blog
        </Link>

        {/* ── Đầu trang ── */}
        <header className="mb-8">
          <p className="mb-2 text-sm font-medium uppercase tracking-wide text-tone-violet">
            Khoá học · {STATS.chapters} chương · PostgreSQL
          </p>
          <h1 className="text-3xl font-bold leading-tight text-text-primary sm:text-4xl">
            Học SQL &amp; Database từ số 0
          </h1>
          <p className="mt-3 max-w-3xl leading-relaxed text-text-secondary">
            Bắt đầu từ chỗ &quot;database là cái gì&quot; chứ không giả định bạn đã biết sẵn. Mỗi chương có sơ đồ
            giải thích, hình bấm được để tự thử, câu hỏi kiểm tra ngay sau mỗi phần, và nối thẳng sang
            bài tập chạy trên PostgreSQL thật. Học ở trường bằng SQL Server thì mọi bài đều có hộp đối chiếu
            hai bên, cộng một bảng tra cứu riêng.
          </p>

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <span className="text-text-secondary"><b className="text-text-primary">{STATS.chapters}</b> chương</span>
            <span className="text-text-secondary"><b className="text-text-primary">{STATS.labExercises}</b> bài tập Code Lab</span>
            <span className="text-text-secondary"><b className="text-text-primary">{STATS.figures}</b> sơ đồ</span>
            <span className="text-text-secondary"><b className="text-text-primary">{STATS.widgets}</b> hình bấm được</span>
            <span className="text-text-secondary"><b className="text-text-primary">{STATS.quizzes}</b> câu hỏi</span>
            <span className="text-text-secondary"><b className="text-text-primary">{STATS.codeBlocks}</b> khối code</span>
            <span className="text-text-secondary"><b className="text-text-primary">{STATS.mssqlBoxes}</b> hộp đối chiếu SQL Server</span>
            <span className="text-text-secondary"><b className="text-text-primary">{STATS.flashcards}</b> thẻ ôn</span>
          </div>

          {hydrated && (
            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between text-xs text-text-secondary">
                <span>Tiến độ của bạn</span>
                <span>{doneCount}/{STATS.chapters} chương</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[var(--bg-surface-active)]">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${(doneCount / STATS.chapters) * 100}%` }}
                />
              </div>
            </div>
          )}

          <p className="mt-4 rounded-xl border border-amber-400/20 bg-amber-500/[0.07] px-3.5 py-2.5 text-xs leading-relaxed text-tone-amber">
            <b>Trạng thái nội dung:</b> {STATS.chaptersFull}/{STATS.chapters} chương đã viết đủ phần chữ
            (chặng 1 và 2 — từ chưa biết gì tới JOIN, CTE, transaction).
            {' '}{STATS.chapters - STATS.chaptersFull} chương còn lại đang ở dạng khung: có mục tiêu, đề mục và
            đầy đủ bài tập bên Code Lab, phần chữ sẽ bổ sung dần.
          </p>
        </header>

        {/* ── Tabs ── */}
        <div className="mb-8 flex flex-wrap gap-2">
          {TABS.map((t) => {
            const Icon = t.icon;
            const on = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={[
                  'inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all active:scale-95',
                  on
                    ? 'border-violet-400/40 bg-violet-500/20 text-text-primary'
                    : 'border-[var(--border-light)] bg-[var(--bg-surface-hover)] text-text-secondary hover:border-[var(--border-light-hover)] hover:text-text-primary',
                ].join(' ')}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* ── Tab: Bài học ── */}
        {tab === 'hoc' && (
          <div>
            {/* Dải chọn chương */}
            <div className="mb-6 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
              <div className="flex gap-1.5 pb-1">
                {CHAPTERS.map((c) => {
                  const on = c.no === activeNo;
                  const isDone = hydrated && done[c.no];
                  return (
                    <button
                      key={c.no}
                      type="button"
                      onClick={() => setActiveNo(c.no)}
                      title={c.title}
                      className={[
                        'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border font-mono text-xs transition-all active:scale-95',
                        on
                          ? 'border-violet-400/60 bg-violet-500/25 text-text-primary'
                          : isDone
                            ? 'border-emerald-400/30 bg-emerald-500/10 text-tone-emerald'
                            : c.status === 'outline'
                              ? 'border-[var(--border-light)] bg-[var(--bg-surface-hover)] text-text-muted'
                              : 'border-[var(--border-light)] bg-[var(--bg-surface-hover)] text-text-secondary hover:text-text-primary',
                      ].join(' ')}
                    >
                      {c.no}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-[var(--border-light)] bg-[var(--bg-surface-hover)] p-4 sm:p-7">
              <ChapterView ch={ch} />

              {/* Đánh dấu xong + điều hướng */}
              <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-light)] pt-6">
                <button
                  type="button"
                  disabled={activeNo <= 0}
                  onClick={() => setActiveNo((n) => Math.max(0, n - 1))}
                  className="rounded-xl border border-[var(--border-light)] bg-[var(--bg-surface-hover)] px-4 py-2 text-sm text-text-secondary transition-all hover:border-[var(--border-light-hover)] disabled:opacity-30"
                >
                  ← Chương {Math.max(0, activeNo - 1)}
                </button>

                <button
                  type="button"
                  onClick={() => toggleDone(ch.no)}
                  className={[
                    'inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm transition-all active:scale-95',
                    hydrated && done[ch.no]
                      ? 'border-emerald-400/40 bg-emerald-500/20 text-tone-emerald'
                      : 'border-[var(--border-light)] bg-[var(--bg-surface-hover)] text-text-secondary hover:text-text-primary',
                  ].join(' ')}
                >
                  {hydrated && done[ch.no]
                    ? <><CheckCircle2 className="h-4 w-4" /> Đã học xong</>
                    : <><Circle className="h-4 w-4" /> Đánh dấu đã học</>}
                </button>

                <button
                  type="button"
                  disabled={activeNo >= CHAPTERS.length - 1}
                  onClick={() => setActiveNo((n) => Math.min(CHAPTERS.length - 1, n + 1))}
                  className="rounded-xl border border-[var(--border-light)] bg-[var(--bg-surface-hover)] px-4 py-2 text-sm text-text-secondary transition-all hover:border-[var(--border-light-hover)] disabled:opacity-30"
                >
                  Chương {Math.min(CHAPTERS.length - 1, activeNo + 1)} →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Lộ trình ── */}
        {tab === 'lotrinh' && (
          <div>
            <Figure
              name="course-map"
              title="Toàn cảnh khoá học"
              caption="Bốn chặng, 21 chương. Học tuần tự từ chương 0 nếu bạn mới bắt đầu."
            />
            <div className="mb-5 grid gap-2 sm:grid-cols-3">
              {STAGES.slice(0, 3).map((s) => (
                <div key={s.id} className="rounded-xl border border-[var(--border-light)] bg-[var(--bg-surface-hover)] p-3">
                  <p className="mb-1 text-xs font-semibold text-text-primary">{s.title}</p>
                  <p className="text-[12px] leading-relaxed text-text-muted">{s.subtitle}</p>
                </div>
              ))}
            </div>
            <RoadmapView
              chapters={CHAPTERS}
              active={activeNo}
              done={done}
              hydrated={hydrated}
              onPick={open}
            />
            <Link
              href={labModuleHref(858)}
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-500/15 px-4 py-2.5 text-sm font-semibold text-tone-emerald transition-all hover:bg-emerald-500/25 active:scale-95"
            >
              <Terminal className="h-4 w-4" />
              Mở track PostgreSQL bên Code Lab ({STATS.labExercises} bài)
            </Link>
          </div>
        )}

        {/* ── Tab: SQL Server ↔ Postgres ── */}
        {tab === 'mssql' && <MssqlView />}

        {/* ── Tab: Ôn tập ── */}
        {tab === 'ontap' && (
          <div>
            <p className="mb-4 text-sm leading-relaxed text-text-secondary">
              <b className="text-text-primary">{allFlash.length}</b> thẻ gom từ toàn bộ các chương đã viết.
              Tự trả lời trong đầu trước rồi mới lật — nhìn đáp án luôn thì não không ghi lại được gì.
            </p>
            <FlashDeck cards={allFlash} />

            <p className="mb-3 mt-8 flex items-center gap-2 text-sm font-semibold text-text-secondary">
              <Sparkles className="h-4 w-4 text-tone-violet" /> Ôn theo từng chương
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {CHAPTERS.filter((c) => c.flash?.length).map((c) => (
                <button
                  key={c.no}
                  type="button"
                  onClick={() => open(c.no)}
                  className="flex items-center gap-3 rounded-xl border border-[var(--border-light)] bg-[var(--bg-surface-hover)] px-3.5 py-2.5 text-left transition-all hover:border-violet-400/40 hover:bg-[var(--bg-surface-hover)] active:scale-[0.99]"
                >
                  <span className="text-lg">{c.icon}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] font-medium text-text-primary">{c.title}</span>
                    <span className="block text-[11px] text-text-muted">{c.flash?.length} thẻ</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Tab: Tra cứu ── */}
        {tab === 'tracuu' && <SearchTab onOpen={open} />}
      </div>
    </div>
  );
}
