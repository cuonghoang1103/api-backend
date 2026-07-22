'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowLeft, ArrowRight, Check, Circle, Play, X, Sparkles, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { roadmapApi, type RoadmapDetailT, type RoadmapNodeT } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { roadmapIcon } from './icons';

type NodeStatus = 'done' | 'current' | 'todo';

function nodeHref(n: RoadmapNodeT): { href: string; external: boolean } | null {
  if (!n.linkType || !n.linkRef) return null;
  if (n.linkType === 'code-lab') return { href: `/code-lab/${n.linkRef}`, external: false };
  if (n.linkType === 'roadmap') return { href: `/roadmap/${n.linkRef}`, external: false };
  if (n.linkType === 'external') {
    const isHttp = /^https?:\/\//.test(n.linkRef);
    return { href: n.linkRef, external: isHttp };
  }
  return null;
}

export default function RoadmapDetail({ slug }: { slug: string }) {
  const { isAuthenticated } = useAuthStore();
  const [data, setData] = useState<RoadmapDetailT | null>(null);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState<Set<number>>(new Set());
  const [active, setActive] = useState<RoadmapNodeT | null>(null);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    roadmapApi
      .get(slug)
      .then((res) => {
        if (!alive) return;
        const d = res.data.data ?? null;
        setData(d);
        setDone(new Set(d?.doneNodeIds ?? []));
      })
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
    <div className="mx-auto max-w-4xl px-4 pb-16 pt-20">
      <Link href="/roadmap" className="mb-4 inline-flex items-center gap-1 text-sm" style={{ color: 'var(--text-secondary, #888)' }}>
        <ArrowLeft size={15} /> Tất cả lộ trình
      </Link>

      {loading ? (
        <div className="flex justify-center py-24"><Loader2 className="animate-spin" style={{ color }} /></div>
      ) : !data ? (
        <p className="py-24 text-center text-sm" style={{ color: 'var(--text-secondary, #888)' }}>Không tìm thấy lộ trình.</p>
      ) : (
        <>
          <header className="mb-6">
            <h1 className="text-2xl font-extrabold sm:text-3xl" style={{ color: 'var(--text-primary)' }}>{data.title}</h1>
            {data.description && <p className="mt-1.5 text-sm" style={{ color: 'var(--text-secondary, #888)' }}>{data.description}</p>}
            {total > 0 && (
              <div className="mt-4 flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full" style={{ background: 'var(--surface-3, rgba(127,127,127,0.2))' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                </div>
                <span className="text-sm font-medium tabular-nums" style={{ color }}>{doneCount}/{total}</span>
              </div>
            )}
          </header>

          {/* Legend */}
          <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs" style={{ color: 'var(--text-secondary, #888)' }}>
            <span className="inline-flex items-center gap-1.5"><span className="inline-flex h-4 w-4 items-center justify-center rounded-full" style={{ background: '#22c55e33', color: '#22c55e' }}><Check size={11} /></span> Đã xong</span>
            <span className="inline-flex items-center gap-1.5"><span className="inline-flex h-4 w-4 items-center justify-center rounded-full" style={{ background: `${color}33`, color }}><Play size={10} /></span> Nên học tiếp</span>
            <span className="inline-flex items-center gap-1.5"><span className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold" style={{ background: '#06b6d422', color: '#06b6d4' }}>nhánh</span> Kỹ năng bổ trợ</span>
          </div>

          {data.stages.map((stage, si) => {
            const stageDone = stage.nodes.filter((n) => done.has(n.id)).length;
            return (
              <section key={`${stage.stage}-${si}`} className="pb-2">
                <div className="mb-4 flex items-center justify-center">
                  <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold" style={{ background: `${color}18`, color, boxShadow: `inset 0 0 0 1px ${color}40` }}>
                    <span className="text-xs opacity-70">Chặng {stage.stage + 1}</span>
                    {stage.stageLabel}
                    <span className="text-xs font-normal" style={{ color: 'var(--text-secondary, #888)' }}>{stageDone}/{stage.nodes.length}</span>
                  </span>
                </div>

                <div className="relative">
                  <div aria-hidden className="absolute left-4 bottom-2 top-2 w-px sm:left-1/2 sm:-translate-x-1/2" style={{ background: 'var(--border-color, rgba(127,127,127,0.25))' }} />
                  <ul className="space-y-4">
                    {stage.nodes.map((n, ni) => {
                      const st = statusOf(n.id);
                      const left = n.side === 'left' || (n.side === 'center' && ni % 2 === 1);
                      const Icon = roadmapIcon(n.icon);
                      const isBranch = n.kind === 'alternative';
                      return (
                        <li key={n.id} className="relative sm:grid sm:grid-cols-2 sm:gap-8">
                          <span
                            aria-hidden
                            className="absolute left-4 top-5 z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full sm:left-1/2"
                            style={{
                              boxShadow: '0 0 0 4px var(--bg-primary, #0a0a0a)',
                              background: st === 'done' ? '#22c55e33' : st === 'current' ? `${color}40` : 'var(--surface-3, rgba(127,127,127,0.25))',
                              color: st === 'done' ? '#22c55e' : st === 'current' ? color : 'var(--text-secondary, #888)',
                            }}
                          >
                            {st === 'done' ? <Check size={15} /> : st === 'current' ? <Play size={13} /> : <Icon size={14} />}
                          </span>

                          <div className={`pl-12 sm:pl-0 ${left ? 'sm:col-start-1 sm:pr-10' : 'sm:col-start-2 sm:pl-10'}`}>
                            <button
                              type="button"
                              onClick={() => setActive(n)}
                              className={`group w-full rounded-xl border p-3.5 text-left transition-all hover:-translate-y-0.5 ${left ? 'sm:text-right' : ''}`}
                              style={{
                                borderColor: st === 'current' ? `${color}80` : 'var(--border-color, rgba(127,127,127,0.2))',
                                background: 'var(--bg-secondary, rgba(127,127,127,0.04))',
                              }}
                            >
                              <div className={`flex items-center gap-2 ${left ? 'sm:flex-row-reverse' : ''}`}>
                                <Icon size={16} style={{ color: st === 'done' ? '#22c55e' : color }} />
                                {isBranch && <span className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold" style={{ background: '#06b6d422', color: '#06b6d4' }}>nhánh</span>}
                              </div>
                              <h3 className="mt-1.5 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{n.title}</h3>
                              {n.subtitle && <p className="mt-0.5 text-xs" style={{ color: 'var(--text-secondary, #888)' }}>{n.subtitle}</p>}
                              <span className={`mt-2 inline-flex items-center gap-1 text-[11px] font-medium ${left ? 'sm:flex-row-reverse' : ''}`} style={{ color: 'var(--text-secondary, #999)' }}>
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
        </>
      )}

      <AnimatePresence>
        {active && (
          <NodeDrawer
            node={active}
            status={statusOf(active.id)}
            color={color}
            isAuthenticated={isAuthenticated}
            toggling={toggling}
            onToggleDone={() => toggleDone(active.id)}
            onClose={() => setActive(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
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
      <a href={link.href} target="_blank" rel="noopener noreferrer" className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90" style={{ background: color }}>
        <ExternalLink size={16} /> Xem tài liệu
      </a>
    ) : (
      <Link href={link.href} onClick={onClose} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90" style={{ background: color }}>
        <Sparkles size={16} /> Học ngay <ArrowRight size={15} />
      </Link>
    )
  ) : null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 24, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 24, opacity: 0, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog" aria-modal="true" aria-label={node.title}
        className="flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border sm:rounded-2xl"
        style={{ background: 'var(--bg-primary, #111)', borderColor: 'var(--border-color, rgba(127,127,127,0.2))' }}
      >
        <div className="flex items-center gap-2.5 border-b px-4 py-3.5" style={{ borderColor: 'var(--border-color, rgba(127,127,127,0.2))' }}>
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ background: `${color}22`, color }}>
            <Icon size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              {node.kind === 'alternative' && <span className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold" style={{ background: '#06b6d422', color: '#06b6d4' }}>nhánh</span>}
              {isDone && <span className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold" style={{ background: '#22c55e22', color: '#22c55e' }}><Check size={10} /> đã xong</span>}
            </div>
            <p className="truncate text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{node.title}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Đóng" className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition hover:bg-black/10 dark:hover:bg-white/10" style={{ color: 'var(--text-secondary, #888)' }}>
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
          <button
            type="button" onClick={onToggleDone} disabled={toggling}
            className="inline-flex items-center justify-center gap-1.5 rounded-full border px-4 py-2.5 text-sm font-medium transition disabled:opacity-60"
            style={{
              borderColor: isDone ? '#22c55e50' : 'var(--border-color, rgba(127,127,127,0.3))',
              background: isDone ? '#22c55e18' : 'transparent',
              color: isDone ? '#22c55e' : 'var(--text-secondary, #aaa)',
            }}
          >
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
