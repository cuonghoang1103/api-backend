'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Loader2, ArrowLeft, ArrowRight, Check, Circle, Play, X, Sparkles, ExternalLink, GitBranch } from 'lucide-react';
import { toast } from 'sonner';
import { roadmapApi, type RoadmapDetailT, type RoadmapNodeT } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { roadmapIcon } from './icons';

const EASE = [0.16, 1, 0.3, 1] as const;
type NodeStatus = 'done' | 'current' | 'todo';

function nodeHref(n: RoadmapNodeT): { href: string; external: boolean } | null {
  if (!n.linkType || !n.linkRef) return null;
  if (n.linkType === 'code-lab') return { href: `/code-lab/${n.linkRef}`, external: false };
  if (n.linkType === 'roadmap') return { href: `/roadmap/${n.linkRef}`, external: false };
  if (n.linkType === 'external') return { href: n.linkRef, external: /^https?:\/\//.test(n.linkRef) };
  return null;
}

/** Circular progress ring. */
function ProgressRing({ pct, color, size = 52 }: { pct: number; color: string; size?: number }) {
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={5} stroke="var(--surface-3, rgba(127,127,127,0.2))" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={5} stroke={color} strokeLinecap="round"
          strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c - (c * pct) / 100 }}
          transition={{ duration: 0.8, ease: EASE }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold tabular-nums" style={{ color }}>{pct}%</span>
    </div>
  );
}

export default function RoadmapDetail({ slug }: { slug: string }) {
  const { isAuthenticated } = useAuthStore();
  const reduce = useReducedMotion();
  const [data, setData] = useState<RoadmapDetailT | null>(null);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState<Set<number>>(new Set());
  const [active, setActive] = useState<RoadmapNodeT | null>(null);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    roadmapApi.get(slug)
      .then((res) => { if (!alive) return; const d = res.data.data ?? null; setData(d); setDone(new Set(d?.doneNodeIds ?? [])); })
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [slug]);

  const flatIds = useMemo(() => (data?.stages ?? []).flatMap((s) => s.nodes.map((n) => n.id)), [data]);
  const currentId = useMemo(() => flatIds.find((id) => !done.has(id)) ?? null, [flatIds, done]);
  const statusOf = useCallback(
    (id: number): NodeStatus => (done.has(id) ? 'done' : id === currentId ? 'current' : 'todo'),
    [done, currentId],
  );

  const toggleDone = useCallback(async (nodeId: number) => {
    if (!isAuthenticated) { toast.info('Đăng nhập để lưu tiến độ lộ trình.'); return; }
    setToggling(true);
    setDone((prev) => { const next = new Set(prev); next.has(nodeId) ? next.delete(nodeId) : next.add(nodeId); return next; });
    try {
      const res = await roadmapApi.toggleDone(nodeId);
      const isDone = res.data.data?.done;
      setDone((prev) => { const next = new Set(prev); isDone ? next.add(nodeId) : next.delete(nodeId); return next; });
    } catch {
      setDone((prev) => { const next = new Set(prev); next.has(nodeId) ? next.delete(nodeId) : next.add(nodeId); return next; });
      toast.error('Không lưu được, thử lại sau.');
    } finally { setToggling(false); }
  }, [isAuthenticated]);

  const total = data?.total ?? 0;
  const doneCount = done.size;
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;
  const color = data?.color || 'var(--accent-color, #6366f1)';

  return (
    <div className="relative mx-auto max-w-4xl px-4 pb-20 pt-20">
      {/* ambient glow */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-10 -z-10 mx-auto h-72 max-w-2xl rounded-full opacity-[0.18] blur-[90px]" style={{ background: color }} />

      <Link href="/roadmap" className="mb-5 inline-flex items-center gap-1 text-sm transition hover:opacity-80" style={{ color: 'var(--text-secondary, #888)' }}>
        <ArrowLeft size={15} /> Tất cả lộ trình
      </Link>

      {loading ? (
        <div className="flex justify-center py-24"><Loader2 className="animate-spin" style={{ color }} /></div>
      ) : !data ? (
        <p className="py-24 text-center text-sm" style={{ color: 'var(--text-secondary, #888)' }}>Không tìm thấy lộ trình.</p>
      ) : (
        <>
          <motion.header initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: EASE, duration: 0.5 }}
            className="mb-8 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl" style={{ backgroundImage: `linear-gradient(120deg, var(--text-primary), ${color})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                {data.title}
              </h1>
              {data.description && <p className="mt-2 max-w-xl text-sm leading-relaxed" style={{ color: 'var(--text-secondary, #888)' }}>{data.description}</p>}
            </div>
            {total > 0 && <ProgressRing pct={pct} color={color} />}
          </motion.header>

          {/* Legend */}
          <div className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs" style={{ color: 'var(--text-secondary, #888)' }}>
            <Legend swatch={<span className="inline-flex h-4 w-4 items-center justify-center rounded-full" style={{ background: '#22c55e33', color: '#22c55e' }}><Check size={11} /></span>} label="Đã xong" />
            <Legend swatch={<span className="inline-flex h-4 w-4 items-center justify-center rounded-full" style={{ background: `${color}33`, color }}><Play size={10} /></span>} label="Nên học tiếp" />
            <Legend swatch={<GitBranch size={13} style={{ color: '#06b6d4' }} />} label="Nhánh — kỹ năng bổ trợ" />
          </div>

          {data.stages.map((stage, si) => {
            const stageDone = stage.nodes.filter((n) => done.has(n.id)).length;
            const allDone = stageDone === stage.nodes.length;
            return (
              <section key={`${stage.stage}-${si}`} className="pb-3">
                {/* Stage badge */}
                <div className="mb-5 flex items-center justify-center">
                  <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold shadow-sm"
                    style={{ background: `linear-gradient(135deg, ${color}22, ${color}0d)`, color, boxShadow: `inset 0 0 0 1px ${color}40` }}>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: color }}>{stage.stage + 1}</span>
                    {stage.stageLabel}
                    <span className="text-xs font-normal opacity-70">{allDone ? '✓' : `${stageDone}/${stage.nodes.length}`}</span>
                  </span>
                </div>

                {/* Trunk + nodes */}
                <div className="relative">
                  <div aria-hidden className="absolute left-[22px] bottom-3 top-3 w-0.5 rounded-full sm:left-1/2 sm:-translate-x-1/2"
                    style={{ background: `linear-gradient(${color}55, ${color}18)` }} />
                  <ul className="space-y-5">
                    {stage.nodes.map((n, ni) => {
                      const st = statusOf(n.id);
                      const left = n.side === 'left' || (n.side === 'center' && ni % 2 === 1);
                      const Icon = roadmapIcon(n.icon);
                      const isBranch = n.kind === 'alternative';
                      const isInfo = n.kind === 'info';
                      return (
                        <motion.li key={n.id} className="relative sm:grid sm:grid-cols-2 sm:gap-10"
                          initial={reduce ? false : { opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }}
                          transition={{ ease: EASE, duration: 0.45, delay: Math.min(ni * 0.04, 0.25) }}>
                          {/* dot */}
                          <span aria-hidden className="absolute left-[22px] top-6 z-10 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full sm:left-1/2"
                            style={{
                              boxShadow: st === 'current' ? `0 0 0 4px var(--bg-primary, #0a0a0a), 0 0 16px 2px ${color}` : '0 0 0 4px var(--bg-primary, #0a0a0a)',
                              background: st === 'done' ? '#22c55e' : st === 'current' ? color : 'var(--bg-secondary, #1a1a1a)',
                              color: st === 'todo' ? 'var(--text-secondary, #888)' : '#fff',
                              border: st === 'todo' ? '1.5px solid var(--border-color, rgba(127,127,127,0.4))' : 'none',
                            }}>
                            {st === 'done' ? <Check size={16} /> : st === 'current' ? <Play size={13} /> : <Icon size={15} />}
                          </span>

                          {/* branch connector (desktop) */}
                          {isBranch && (
                            <span aria-hidden className={`absolute top-[26px] hidden h-px sm:block ${left ? 'right-1/2 mr-4' : 'left-1/2 ml-4'}`}
                              style={{ width: 'calc(50% - 3.5rem)', background: `repeating-linear-gradient(90deg, #06b6d4, #06b6d4 4px, transparent 4px, transparent 8px)` }} />
                          )}

                          <div className={`pl-14 sm:pl-0 ${left ? 'sm:col-start-1 sm:pr-14' : 'sm:col-start-2 sm:pl-14'}`}>
                            <motion.button type="button" onClick={() => setActive(n)}
                              whileHover={reduce ? undefined : { y: -3 }} whileTap={{ scale: 0.985 }}
                              className={`group w-full overflow-hidden rounded-2xl border p-4 text-left backdrop-blur-sm transition-shadow hover:shadow-xl ${left ? 'sm:text-right' : ''}`}
                              style={{
                                borderColor: st === 'current' ? `${color}90` : isBranch ? '#06b6d455' : 'var(--border-color, rgba(127,127,127,0.18))',
                                borderStyle: isBranch ? 'dashed' : 'solid',
                                background: st === 'current'
                                  ? `linear-gradient(135deg, ${color}14, var(--bg-secondary, rgba(127,127,127,0.05)))`
                                  : 'var(--bg-secondary, rgba(127,127,127,0.05))',
                                opacity: isInfo ? 0.92 : 1,
                              }}>
                              <div className={`flex items-center gap-2.5 ${left ? 'sm:flex-row-reverse' : ''}`}>
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
                                  style={{ background: st === 'done' ? 'linear-gradient(135deg,#22c55e,#16a34a)' : `linear-gradient(135deg, ${color}, ${color}bb)` }}>
                                  <Icon size={17} />
                                </span>
                                <div className={`min-w-0 flex-1 ${left ? 'sm:text-right' : ''}`}>
                                  <h3 className="truncate text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{n.title}</h3>
                                  {n.subtitle && <p className="mt-0.5 truncate text-xs" style={{ color: 'var(--text-secondary, #888)' }}>{n.subtitle}</p>}
                                </div>
                              </div>
                              <div className={`mt-2.5 flex items-center gap-2 ${left ? 'sm:flex-row-reverse' : ''}`}>
                                {isBranch && <span className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold" style={{ background: '#06b6d422', color: '#06b6d4' }}><GitBranch size={9} /> nhánh</span>}
                                {n.linkType && <span className="rounded-full px-1.5 py-0.5 text-[10px] font-medium" style={{ background: `${color}18`, color }}>{n.linkType === 'external' ? 'Tài liệu' : 'Học ngay'}</span>}
                                <span className={`inline-flex items-center gap-1 text-[11px] font-medium ${left ? 'sm:ml-auto sm:flex-row-reverse' : 'ml-auto'}`} style={{ color: 'var(--text-secondary, #999)' }}>
                                  Chi tiết <ArrowRight size={11} className="transition group-hover:translate-x-0.5" />
                                </span>
                              </div>
                            </motion.button>
                          </div>
                        </motion.li>
                      );
                    })}
                  </ul>
                </div>
              </section>
            );
          })}
        </>
      )}

      <AnimatePresence>
        {active && (
          <NodeDrawer node={active} status={statusOf(active.id)} color={color} isAuthenticated={isAuthenticated}
            toggling={toggling} onToggleDone={() => toggleDone(active.id)} onClose={() => setActive(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function Legend({ swatch, label }: { swatch: React.ReactNode; label: string }) {
  return <span className="inline-flex items-center gap-1.5">{swatch} {label}</span>;
}

function NodeDrawer({
  node, status, color, isAuthenticated, toggling, onToggleDone, onClose,
}: {
  node: RoadmapNodeT; status: NodeStatus; color: string; isAuthenticated: boolean;
  toggling: boolean; onToggleDone: () => void; onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const Icon = roadmapIcon(node.icon);
  const link = nodeHref(node);
  const isDone = status === 'done';
  if (!mounted) return null;

  const learnBtn = link ? (
    link.external ? (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90" style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}>
        <ExternalLink size={16} /> Xem tài liệu
      </a>
    ) : (
      <Link href={link.href} onClick={onClose} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90" style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}>
        <Sparkles size={16} /> Học ngay <ArrowRight size={15} />
      </Link>
    )
  ) : null;

  return createPortal(
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
      <motion.div initial={{ y: 24, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 24, opacity: 0, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 320, damping: 30 }} onClick={(e) => e.stopPropagation()}
        role="dialog" aria-modal="true" aria-label={node.title}
        className="flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border sm:rounded-2xl"
        style={{ background: 'var(--bg-primary, #111)', borderColor: 'var(--border-color, rgba(127,127,127,0.2))' }}>
        <div className="relative flex items-center gap-3 border-b px-4 py-4" style={{ borderColor: 'var(--border-color, rgba(127,127,127,0.2))' }}>
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.12]" style={{ background: `linear-gradient(120deg, ${color}, transparent 70%)` }} />
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow" style={{ background: `linear-gradient(135deg, ${color}, ${color}bb)` }}>
            <Icon size={19} />
          </span>
          <div className="relative min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              {node.kind === 'alternative' && <span className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold" style={{ background: '#06b6d422', color: '#06b6d4' }}><GitBranch size={9} /> nhánh</span>}
              {isDone && <span className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold" style={{ background: '#22c55e22', color: '#22c55e' }}><Check size={10} /> đã xong</span>}
            </div>
            <p className="truncate text-base font-bold" style={{ color: 'var(--text-primary)' }}>{node.title}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Đóng" className="relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition hover:bg-black/10 dark:hover:bg-white/10" style={{ color: 'var(--text-secondary, #888)' }}>
            <X size={18} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          {node.subtitle && <p className="mb-2 text-sm font-medium" style={{ color: 'var(--text-secondary, #aaa)' }}>{node.subtitle}</p>}
          {node.description ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed" style={{ color: 'var(--text-secondary, #aaa)' }}>{node.description}</p>
          ) : (
            <p className="text-sm" style={{ color: 'var(--text-secondary, #888)' }}>Chưa có phần giới thiệu.</p>
          )}
        </div>

        <div className="flex flex-col gap-2 border-t px-4 py-3 sm:flex-row" style={{ borderColor: 'var(--border-color, rgba(127,127,127,0.2))' }}>
          {learnBtn}
          <button type="button" onClick={onToggleDone} disabled={toggling}
            className="inline-flex items-center justify-center gap-1.5 rounded-full border px-4 py-2.5 text-sm font-medium transition disabled:opacity-60"
            style={{
              borderColor: isDone ? '#22c55e50' : 'var(--border-color, rgba(127,127,127,0.3))',
              background: isDone ? '#22c55e18' : 'transparent',
              color: isDone ? '#22c55e' : 'var(--text-secondary, #aaa)',
            }}>
            {toggling ? <Loader2 size={15} className="animate-spin" /> : isDone ? <Check size={15} /> : <Circle size={15} />}
            {isDone ? 'Đã xong' : 'Đánh dấu xong'}
          </button>
        </div>
        {!isAuthenticated && <p className="px-4 pb-3 text-center text-[11px]" style={{ color: 'var(--text-secondary, #888)' }}>Đăng nhập để lưu tiến độ.</p>}
      </motion.div>
    </motion.div>,
    document.body,
  );
}
