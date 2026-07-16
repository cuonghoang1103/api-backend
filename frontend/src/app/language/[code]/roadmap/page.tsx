'use client';
/**
 * My Language — Lộ trình (Roadmap).
 *
 * A roadmap.sh-style learning path per language: ordered stages, each with nodes
 * placed on a central spine (branches alternate left/right on desktop, a single
 * timeline on mobile). Click a node → a detail drawer with the intro + a
 * "Học ngay" deep-link into the right section. Logged-in users can tick a node
 * done (checkmarks persist). Content is admin-managed / seeded (EN 0→IELTS 7.5,
 * JA 0→N2). Theme-aware (CSS vars, never `dark:`).
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Route,
  Type,
  BookOpen,
  GraduationCap,
  Headphones,
  MessagesSquare,
  Newspaper,
  HelpCircle,
  PenLine,
  Bot,
  Check,
  Play,
  Lock,
  X,
  ArrowRight,
  Sparkles,
  Loader2,
  Circle,
  Dumbbell,
} from 'lucide-react';
import { toast } from 'sonner';
import { languageApi, type Roadmap, type RoadmapNode } from '@/lib/language-api';
import type { VocabCategory } from '@/types/language';
import { MascotCoach, useDailyMascot } from '@/components/language/mascot/mascot';
import { SectionShell, EmptyState, ProgressRing, useLangUser } from '@/components/language/primitives';

const ICONS: Record<string, typeof Route> = {
  Type, BookOpen, GraduationCap, Headphones, MessagesSquare, Newspaper, HelpCircle, PenLine, Bot, Route,
};
const SECTION_WITH_LEVEL = new Set(['vocab', 'grammar', 'listening', 'reading', 'conversation', 'qna']);

function nodeHref(code: string, n: RoadmapNode): string | null {
  if (n.linkType === 'external' && n.linkRef) return n.linkRef;
  if (!n.linkType) return null;
  const base = `/language/${code}/${n.linkType}`;
  const params = new URLSearchParams();
  // vocab nodes carry the bound category id in linkRef — deep-link straight
  // into that category's word list (the practice binding uses the same ref).
  if (n.linkType === 'vocab' && n.linkRef && /^\d+$/.test(n.linkRef)) params.set('categoryId', n.linkRef);
  if (n.level && SECTION_WITH_LEVEL.has(n.linkType)) params.set('level', n.level);
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

type NodeStatus = 'done' | 'current' | 'todo';

/** Today's coach welcomes the learner and nudges them to the next unit. */
function RoadmapGreeting({ doneCount, total }: { doneCount: number; total: number }) {
  const { id, name } = useDailyMascot();
  const text =
    doneCount === 0
      ? `Chào bạn, mình là ${name}! Bấm vào một chặng để xem các bài học bên trong nhé 🌟`
      : doneCount >= total
        ? `Bạn đã đi hết lộ trình rồi — ${name} phục sát đất! 🏆`
        : `${name} đây! Bạn đã xong ${doneCount}/${total} chặng — học tiếp chặng phát sáng nha 💪`;
  return <MascotCoach id={id} mood={doneCount >= total ? 'cheer' : 'happy'} text={text} size={60} className="mb-4" />;
}

export default function RoadmapPage() {
  const code = String(useParams().code);
  const { isAuthenticated } = useLangUser();
  const [data, setData] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState<Set<number>>(new Set());
  const [active, setActive] = useState<RoadmapNode | null>(null);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    languageApi
      .roadmap(code)
      .then((res) => {
        if (!alive) return;
        const d = res.data.data ?? null;
        setData(d);
        setDone(new Set(d?.doneNodeIds ?? []));
      })
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [code]);

  // Flat reading order → the first not-done node is "current".
  const flatIds = useMemo(
    () => (data?.stages ?? []).flatMap((s) => s.nodes.map((n) => n.id)),
    [data],
  );
  const currentId = useMemo(() => flatIds.find((id) => !done.has(id)) ?? null, [flatIds, done]);
  const statusOf = useCallback(
    (id: number): NodeStatus => (done.has(id) ? 'done' : id === currentId ? 'current' : 'todo'),
    [done, currentId],
  );

  const toggleDone = useCallback(async (nodeId: number) => {
    if (!isAuthenticated) { toast.info('Đăng nhập để lưu tiến độ lộ trình.'); return; }
    setToggling(true);
    // Optimistic.
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId); else next.add(nodeId);
      return next;
    });
    try {
      const res = await languageApi.roadmapToggleDone(nodeId);
      const isDone = res.data.data?.done;
      setDone((prev) => {
        const next = new Set(prev);
        if (isDone) next.add(nodeId); else next.delete(nodeId);
        return next;
      });
    } catch {
      // Revert on failure.
      setDone((prev) => {
        const next = new Set(prev);
        if (next.has(nodeId)) next.delete(nodeId); else next.add(nodeId);
        return next;
      });
      toast.error('Không lưu được, thử lại sau.');
    } finally {
      setToggling(false);
    }
  }, [isAuthenticated]);

  const total = data?.total ?? 0;
  const doneCount = done.size;
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  return (
    <SectionShell
      code={code}
      title="Lộ trình"
      icon={<Route className="text-neon-violet" />}
      right={
        total > 0 ? (
          <div className="flex items-center gap-2.5">
            <ProgressRing value={pct} size={44} label={`${pct}`} />
            <span className="text-sm text-text-muted">{doneCount}/{total} chặng</span>
          </div>
        ) : undefined
      }
    >
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-neon-violet" />
        </div>
      ) : !data || total === 0 ? (
        <EmptyState
          emoji="🗺️"
          title="Chưa có lộ trình cho ngôn ngữ này"
          hint="Quản trị viên có thể tạo hoặc seed lộ trình trong trang admin."
        />
      ) : (
        <div className="space-y-2">
          <RoadmapGreeting doneCount={doneCount} total={total} />

          {/* Legend */}
          <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-text-muted">
            <span className="inline-flex items-center gap-1.5"><span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-neon-green/20 text-neon-green"><Check size={11} /></span> Đã xong</span>
            <span className="inline-flex items-center gap-1.5"><span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-neon-violet/25 text-neon-violet"><Play size={10} /></span> Nên học tiếp</span>
            <span className="inline-flex items-center gap-1.5"><span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[var(--bg-surface)] ring-1 ring-[var(--border-color)]"><Circle size={8} className="text-text-muted" /></span> Chưa học</span>
            <span className="inline-flex items-center gap-1.5"><span className="rounded-full bg-neon-cyan/15 px-1.5 py-0.5 text-[10px] font-semibold text-neon-cyan">nhánh</span> Kỹ năng bổ trợ (thứ tự linh hoạt)</span>
          </div>

          {data.stages.map((stage, si) => {
            const stageDone = stage.nodes.filter((n) => done.has(n.id)).length;
            return (
              <section key={`${stage.stage}-${si}`} className="pb-2">
                {/* Stage header */}
                <div className="mb-4 flex items-center justify-center">
                  <span className="inline-flex items-center gap-2 rounded-full bg-neon-violet/10 px-4 py-1.5 text-sm font-semibold text-neon-violet ring-1 ring-neon-violet/25">
                    <span className="text-xs opacity-70">Chặng {stage.stage + 1}</span>
                    {stage.stageLabel}
                    <span className="text-xs font-normal text-text-muted">{stageDone}/{stage.nodes.length}</span>
                  </span>
                </div>

                {/* Spine + nodes */}
                <div className="relative">
                  <div
                    aria-hidden
                    className="absolute left-4 top-2 bottom-2 w-px bg-[var(--border-color)] sm:left-1/2 sm:-translate-x-1/2"
                  />
                  <ul className="space-y-4">
                    {stage.nodes.map((n, ni) => {
                      const st = statusOf(n.id);
                      const left = n.side === 'left' || (n.side === 'center' && ni % 2 === 1);
                      const Icon = (n.icon && ICONS[n.icon]) || Route;
                      const isBranch = n.kind === 'alternative';
                      return (
                        <li key={n.id} className="relative sm:grid sm:grid-cols-2 sm:gap-8">
                          {/* Dot on the spine */}
                          <span
                            aria-hidden
                            className={`absolute left-4 top-5 z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full ring-4 ring-[var(--bg-primary)] sm:left-1/2 ${
                              st === 'done'
                                ? 'bg-neon-green/20 text-neon-green'
                                : st === 'current'
                                  ? 'bg-neon-violet/25 text-neon-violet'
                                  : 'bg-[var(--bg-surface)] text-text-muted ring-4'
                            }`}
                          >
                            {st === 'done' ? <Check size={15} /> : st === 'current' ? <Play size={13} /> : <Icon size={14} />}
                          </span>

                          {/* Card — left or right column on desktop; offset past the line on mobile */}
                          <div className={`pl-12 sm:pl-0 ${left ? 'sm:col-start-1 sm:pr-10' : 'sm:col-start-2 sm:pl-10'}`}>
                            <button
                              type="button"
                              onClick={() => setActive(n)}
                              className={`card group w-full p-3.5 text-left transition hover:-translate-y-0.5 ${
                                left ? 'sm:text-right' : ''
                              } ${st === 'current' ? 'ring-1 ring-neon-violet/50' : ''}`}
                            >
                              <div className={`flex items-center gap-2 ${left ? 'sm:flex-row-reverse' : ''}`}>
                                <Icon size={16} className={st === 'done' ? 'text-neon-green' : 'text-neon-violet'} />
                                {n.level && (
                                  <span className="rounded-full bg-neon-violet/10 px-1.5 py-0.5 text-[10px] font-semibold text-neon-violet ring-1 ring-neon-violet/25">{n.level}</span>
                                )}
                                {isBranch && (
                                  <span className="rounded-full bg-neon-cyan/15 px-1.5 py-0.5 text-[10px] font-semibold text-neon-cyan">nhánh</span>
                                )}
                              </div>
                              <h3 className="mt-1.5 font-heading text-sm font-semibold text-text-primary">{n.title}</h3>
                              {n.subtitle && <p className="mt-0.5 text-xs text-text-muted">{n.subtitle}</p>}
                              <span className={`mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-text-secondary ${left ? 'sm:flex-row-reverse' : ''}`}>
                                Xem chi tiết <ArrowRight size={12} className="transition group-hover:translate-x-0.5" />
                              </span>
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </section>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {active && (
          <NodeDrawer
            code={code}
            node={active}
            status={statusOf(active.id)}
            isAuthenticated={isAuthenticated}
            toggling={toggling}
            onToggleDone={() => toggleDone(active.id)}
            onClose={() => setActive(null)}
          />
        )}
      </AnimatePresence>
    </SectionShell>
  );
}

function NodeDrawer({
  code,
  node,
  status,
  isAuthenticated,
  toggling,
  onToggleDone,
  onClose,
}: {
  code: string;
  node: RoadmapNode;
  status: NodeStatus;
  isAuthenticated: boolean;
  toggling: boolean;
  onToggleDone: () => void;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const Icon = (node.icon && ICONS[node.icon]) || Route;
  const href = nodeHref(code, node);
  const isDone = status === 'done';

  // The node names an abstract theme ("Đời sống cơ bản") that rarely matches a
  // catalogue category by name, so a single deep-link can only ever be
  // approximate. What IS precise: the level's real categories. Load them and
  // show the unit's actual lessons right here — tap one, land in that exact
  // word list — the way a Duolingo unit opens into its lessons.
  const [lessons, setLessons] = useState<VocabCategory[] | null>(null);
  const wantsLessons = node.linkType === 'vocab' && !!node.level;
  useEffect(() => {
    if (!wantsLessons) return;
    let alive = true;
    languageApi
      .vocabCategories(code)
      .then((r) => {
        if (!alive) return;
        const all = r.data.data ?? [];
        setLessons(all.filter((c) => c.level === node.level && (c.wordCount ?? c._count?.words ?? 0) > 0));
      })
      .catch(() => alive && setLessons([]));
    return () => { alive = false; };
  }, [code, node.level, wantsLessons]);

  if (!mounted) return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 24, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 24, opacity: 0, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={node.title}
        className="card flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl"
      >
        <div className="flex items-center gap-2.5 border-b border-[var(--border-color)] px-4 py-3.5">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neon-violet/15 text-neon-violet">
            <Icon size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              {node.level && <span className="rounded-full bg-neon-violet/10 px-1.5 py-0.5 text-[10px] font-semibold text-neon-violet ring-1 ring-neon-violet/25">{node.level}</span>}
              {node.kind === 'alternative' && <span className="rounded-full bg-neon-cyan/15 px-1.5 py-0.5 text-[10px] font-semibold text-neon-cyan">nhánh</span>}
              {isDone && <span className="inline-flex items-center gap-1 rounded-full bg-neon-green/15 px-1.5 py-0.5 text-[10px] font-semibold text-neon-green"><Check size={10} /> đã xong</span>}
            </div>
            <p className="truncate font-heading text-base font-semibold text-text-primary">{node.title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-text-muted transition hover:bg-[var(--bg-surface)] hover:text-text-primary"
          >
            <X size={18} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          {node.subtitle && <p className="mb-2 text-sm font-medium text-text-secondary">{node.subtitle}</p>}
          {node.description ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">{node.description}</p>
          ) : (
            <p className="text-sm text-text-muted">Chưa có phần giới thiệu cho chặng này.</p>
          )}

          {wantsLessons && (
            <div className="mt-4">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
                Bài học trong chặng này {lessons ? `(${lessons.length})` : ''}
              </h4>
              {lessons === null ? (
                <div className="flex justify-center py-4"><Loader2 size={18} className="animate-spin text-neon-violet" /></div>
              ) : lessons.length === 0 ? (
                <p className="rounded-xl bg-[var(--bg-surface)] p-3 text-sm text-text-muted ring-1 ring-[var(--border-color)]">
                  Nội dung cấp {node.level} đang được bổ sung — quay lại sau nhé.
                </p>
              ) : (
                <ul className="space-y-1.5">
                  {lessons.map((c) => {
                    const bound = node.linkRef === String(c.id);
                    return (
                      <li key={c.id}>
                        <Link
                          href={`/language/${code}/vocab?categoryId=${c.id}${node.level ? `&level=${node.level}` : ''}`}
                          className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm ring-1 transition hover:ring-neon-violet/40 ${
                            bound ? 'bg-neon-violet/10 ring-neon-violet/30' : 'bg-[var(--bg-surface)] ring-[var(--border-color)]'
                          }`}
                        >
                          <span className="text-lg leading-none">{c.icon || '📘'}</span>
                          <span className="min-w-0 flex-1 truncate font-medium text-text-primary">
                            {c.name.includes('·') ? c.name.slice(c.name.lastIndexOf('·') + 1).trim() : c.name}
                          </span>
                          <span className="shrink-0 text-xs text-text-muted">{c.wordCount ?? c._count?.words ?? 0} từ</span>
                          <ArrowRight size={14} className="shrink-0 text-text-muted" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 border-t border-[var(--border-color)] px-4 py-3 sm:flex-row">
          {href && (
            node.linkType === 'external' ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-neon-violet px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                <Sparkles size={16} /> Học ngay
              </a>
            ) : (
              <Link
                href={href}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-neon-violet px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                <Sparkles size={16} /> Học ngay <ArrowRight size={15} />
              </Link>
            )
          )}
          {node.linkType === 'vocab' && (
            <Link
              href={`/language/${code}/practice`}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-neon-green/15 px-4 py-2.5 text-sm font-semibold text-neon-green ring-1 ring-neon-green/30 transition hover:bg-neon-green/25"
            >
              <Dumbbell size={16} /> Luyện tập
            </Link>
          )}
          <button
            type="button"
            onClick={onToggleDone}
            disabled={toggling}
            className={`inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium ring-1 transition disabled:opacity-60 ${
              isDone
                ? 'bg-neon-green/15 text-neon-green ring-neon-green/30'
                : 'bg-[var(--bg-surface)] text-text-secondary ring-[var(--border-color)] hover:text-neon-violet hover:ring-neon-violet/40'
            }`}
          >
            {toggling ? <Loader2 size={15} className="animate-spin" /> : isDone ? <Check size={15} /> : <Circle size={15} />}
            {isDone ? 'Đã xong' : 'Đánh dấu xong'}
          </button>
        </div>
        {!isAuthenticated && (
          <p className="px-4 pb-3 text-center text-[11px] text-text-muted">Đăng nhập để lưu tiến độ lộ trình.</p>
        )}
      </motion.div>
    </motion.div>,
    document.body,
  );
}
