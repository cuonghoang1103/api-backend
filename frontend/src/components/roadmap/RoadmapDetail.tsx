'use client';

/**
 * Trang một lộ trình (/roadmap/[slug]) — bố cục 12/11/2026:
 *   • Đầu trang: tên, mô tả, số chặng/bước/bước có bài học trên web, vòng tiến độ, nút "Học tiếp".
 *   • Cột trái (desktop) dính: mục lục chặng + tiến độ từng chặng, tự sáng chặng đang xem.
 *   • Cột phải: thanh tìm + lọc (chưa xong / có bài học / bước chính), mỗi chặng là một khối thẻ dạng lưới.
 *   • Bấm thẻ ⇒ StepPanel (bài học trên web → giảng giải → đọc thêm). Bước đang mở nằm trên URL (?buoc=<id>) nên
 *     bấm sang bài học rồi Back vẫn về đúng bước, và chia sẻ link được.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Loader2, ArrowLeft, ArrowRight, Check, Play, GitBranch, Search, X, ChevronDown, Lightbulb, BookOpenText,
  GraduationCap, Layers, ListTree, Route,
} from 'lucide-react';
import { toast } from 'sonner';
import { roadmapApi, type RoadmapDetailT, type RoadmapNodeT, type RoadmapStageT } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useLocaleContext } from '@/context/LocaleContext';
import { roadmapIcon } from './icons';
import { LESSON_KIND, T, type Lang, type Strings } from './roadmapUi';
import StepPanel from './StepPanel';

const EASE = [0.16, 1, 0.3, 1] as const;
// Chặng dài hơn NGUONG bước thì mở sẵn MO_SAN bước, phần còn lại bấm mới hiện.
const NGUONG = 16;
const MO_SAN = 12;

type Loc = 'all' | 'todo' | 'linked' | 'core';
type NodeStatus = 'done' | 'current' | 'todo';

function ProgressRing({ pct, color, size = 92 }: { pct: number; color: string; size?: number }) {
  const r = (size - 10) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={8} stroke="var(--bg-surface-hover, rgba(127,127,127,0.18))" />
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={8} stroke={color} strokeLinecap="round"
          strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c - (c * pct) / 100 }}
          transition={{ duration: 0.9, ease: EASE }} />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-extrabold tabular-nums" style={{ color: 'var(--text-primary)' }}>{pct}%</span>
      </span>
    </div>
  );
}

function Stat({ icon: Icon, value, label }: { icon: typeof Layers; value: number | string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-secondary)' }}>
      <Icon size={13} /> <strong className="font-semibold tabular-nums" style={{ color: 'var(--text-primary)' }}>{value}</strong> {label}
    </span>
  );
}

function StepCard({
  n, st, color, s, onOpen, onToggle,
}: { n: RoadmapNodeT; st: NodeStatus; color: string; s: Strings; onOpen: () => void; onToggle: () => void }) {
  const Icon = roadmapIcon(n.icon);
  const isBranch = n.kind === 'alternative';
  const isInfo = n.kind === 'info';
  const lessons = n.lessons ?? [];
  const kinds = [...new Set(lessons.map((l) => l.kieu))].slice(0, 4);
  const done = st === 'done';
  const cur = st === 'current';
  return (
    <div
      role="button" tabIndex={0} onClick={onOpen}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(); } }}
      className="group relative flex h-full cursor-pointer flex-col rounded-2xl border p-3.5 text-left outline-none transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2"
      style={{
        borderColor: cur ? `${color}99` : isBranch ? '#06b6d455' : 'var(--border-color)',
        borderStyle: isBranch ? 'dashed' : 'solid',
        background: cur ? `linear-gradient(135deg, ${color}16, var(--bg-card) 55%)` : 'var(--bg-card)',
        boxShadow: cur ? `0 0 0 1px ${color}33, 0 8px 28px -14px ${color}` : undefined,
        ['--tw-ring-color' as string]: color,
      }}>
      <div className="flex items-start gap-3">
        <button type="button" aria-label={done ? s.markedDone : s.markDone}
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition hover:scale-110"
          style={{
            borderColor: done ? '#22c55e' : cur ? color : 'var(--border-light, var(--border-color))',
            background: done ? '#22c55e' : 'transparent', color: '#fff',
          }}>
          {done ? <Check size={13} strokeWidth={3} /> : cur ? <Play size={9} style={{ color }} className="fill-current" /> : null}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <Icon size={14} className="shrink-0 opacity-70" style={{ color: done ? '#22c55e' : color }} />
            <h3 className="line-clamp-2 text-[14px] font-semibold leading-snug" style={{ color: 'var(--text-primary)', textDecoration: done ? 'none' : undefined, opacity: done ? 0.75 : 1 }}>{n.title}</h3>
          </div>
          {(n.subtitle || n.description) && (
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{n.subtitle || n.description}</p>
          )}
        </div>
      </div>
      <div className="mt-auto flex flex-wrap items-center gap-1.5 pl-9 pt-2.5">
        {cur && <span className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white" style={{ background: color }}>{s.next}</span>}
        {isBranch && <span className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold" style={{ background: '#06b6d41c', color: '#0891b2' }}><GitBranch size={9} /> {s.branch}</span>}
        {isInfo && <span className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold" style={{ background: 'var(--bg-surface-hover)', color: 'var(--text-secondary)' }}><Lightbulb size={9} /> {s.concept}</span>}
        {lessons.length > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold" style={{ background: `${color}18`, color }}>
            <span className="flex -space-x-0.5">
              {kinds.map((k) => { const K = LESSON_KIND[k]?.icon ?? GraduationCap; return <K key={k} size={10} />; })}
            </span>
            {s.lessonsOnSite(lessons.length)}
          </span>
        )}
        {n.hasBody && <span className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium" style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}><BookOpenText size={9} /> {s.reading}</span>}
        <ArrowRight size={13} className="ml-auto opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-60" style={{ color: 'var(--text-secondary)' }} />
      </div>
    </div>
  );
}

export default function RoadmapDetail({ slug }: { slug: string }) {
  const { isAuthenticated } = useAuthStore();
  const { locale } = useLocaleContext();
  const lang: Lang = locale === 'vi' ? 'vi' : 'en';
  const s = T[lang] as Strings;
  const reduce = useReducedMotion();
  const [data, setData] = useState<RoadmapDetailT | null>(null);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState<Set<number>>(new Set());
  const [activeId, setActiveId] = useState<number | null>(null);
  const [toggling, setToggling] = useState(false);
  const [tim, setTim] = useState('');
  const [loc, setLoc] = useState<Loc>('all');
  const [moRong, setMoRong] = useState<Set<number>>(new Set());
  const [dong, setDong] = useState<Set<number>>(new Set());
  const [changDangXem, setChangDangXem] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    roadmapApi.get(slug)
      .then((res) => {
        if (!alive) return;
        const d = res.data.data ?? null;
        setData(d); setDone(new Set(d?.doneNodeIds ?? []));
        // Mở lại bước trên URL (?buoc=) — đường về sau khi bấm sang bài học.
        const id = Number(new URLSearchParams(window.location.search).get('buoc'));
        if (id && d?.stages.some((st) => st.nodes.some((n) => n.id === id))) setActiveId(id);
      })
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [slug]);

  // Đồng bộ bước đang mở lên URL (replaceState: không chồng lịch sử mỗi lần chuyển bước).
  useEffect(() => {
    if (loading) return;
    const u = new URL(window.location.href);
    if (activeId) u.searchParams.set('buoc', String(activeId)); else u.searchParams.delete('buoc');
    window.history.replaceState(window.history.state, '', u.toString());
  }, [activeId, loading]);

  const flat = useMemo(() => (data?.stages ?? []).flatMap((st) => st.nodes.map((n) => ({ n, st }))), [data]);
  const viTri = useMemo(() => new Map(flat.map((x, i) => [x.n.id, i])), [flat]);
  const currentId = useMemo(() => flat.find((x) => !done.has(x.n.id))?.n.id ?? null, [flat, done]);
  const statusOf = useCallback((id: number): NodeStatus => (done.has(id) ? 'done' : id === currentId ? 'current' : 'todo'), [done, currentId]);

  const toggleDone = useCallback(async (nodeId: number) => {
    if (!isAuthenticated) { toast.info(s.loginToSave); return; }
    setToggling(true);
    const dao = (prev: Set<number>) => { const next = new Set(prev); next.has(nodeId) ? next.delete(nodeId) : next.add(nodeId); return next; };
    setDone(dao);
    try {
      const res = await roadmapApi.toggleDone(nodeId);
      const isDone = res.data.data?.done;
      setDone((prev) => { const next = new Set(prev); isDone ? next.add(nodeId) : next.delete(nodeId); return next; });
    } catch {
      setDone(dao);
      toast.error(lang === 'vi' ? 'Không lưu được, thử lại sau.' : 'Could not save, try again.');
    } finally { setToggling(false); }
  }, [isAuthenticated, s.loginToSave, lang]);

  const khoa = tim.trim().toLowerCase();
  const chang: RoadmapStageT[] = useMemo(() => {
    if (!data) return [];
    const hop = (n: RoadmapNodeT) =>
      (!khoa || `${n.title} ${n.subtitle ?? ''} ${n.description ?? ''}`.toLowerCase().includes(khoa))
      && (loc !== 'todo' || !done.has(n.id))
      && (loc !== 'linked' || (n.lessons?.length ?? 0) > 0)
      && (loc !== 'core' || n.kind === 'primary');
    if (!khoa && loc === 'all') return data.stages;
    return data.stages.map((st) => ({ ...st, nodes: st.nodes.filter(hop) })).filter((st) => st.nodes.length > 0);
  }, [data, khoa, loc, done]);
  const dangLoc = !!khoa || loc !== 'all';
  const soKhop = useMemo(() => chang.reduce((a, st) => a + st.nodes.length, 0), [chang]);

  // Mục lục tự sáng chặng đang nằm trên màn hình.
  const quan = useRef<IntersectionObserver | null>(null);
  useEffect(() => {
    if (!data) return;
    quan.current?.disconnect();
    const io = new IntersectionObserver((entries) => {
      const thay = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (thay) setChangDangXem(Number((thay.target as HTMLElement).dataset.stage));
    }, { rootMargin: '-90px 0px -65% 0px' });
    document.querySelectorAll('[data-stage]').forEach((el) => io.observe(el));
    quan.current = io;
    return () => io.disconnect();
  }, [data, chang]);

  const total = data?.total ?? 0;
  const doneCount = flat.filter((x) => done.has(x.n.id)).length;
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;
  const color = data?.color || '#6366f1';
  const linked = flat.filter((x) => (x.n.lessons?.length ?? 0) > 0).length;
  // Khoá trên web phủ lộ trình này nhiều nhất (gom từ bài đã gắn vào các bước) — để người học thấy "học cả khoá nào".
  const khoaPhu = useMemo(() => {
    const m = new Map<string, { slug: string; ten: string; buoc: number; academy: boolean; ma?: string }>();
    for (const { n } of flat) {
      const daDem = new Set<string>();
      for (const l of n.lessons ?? []) {
        const k = l.href.match(/^\/courses\/([^/?]+)/)?.[1];
        if (!k || daDem.has(k)) continue;
        daDem.add(k);
        const ten = (l.nguon ?? k).split(' · ')[0];
        const cu = m.get(k) ?? { slug: k, ten, buoc: 0, academy: !!l.academy, ma: l.ma };
        cu.buoc += 1; m.set(k, cu);
      }
    }
    return [...m.values()].sort((a, b) => b.buoc - a.buoc).slice(0, 8);
  }, [flat]);
  const Icon = roadmapIcon(data?.icon);
  const active = activeId != null ? flat[viTri.get(activeId) ?? -1] : undefined;
  const ai = activeId != null ? viTri.get(activeId) ?? -1 : -1;
  const currentNode = currentId != null ? flat[viTri.get(currentId)!]?.n : undefined;

  const cuonToi = (stage: number) => {
    const el = document.getElementById(`chang-${stage}`);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 84, behavior: reduce ? 'auto' : 'smooth' });
  };

  const LOC: Array<[Loc, string]> = [['all', s.fAll], ['todo', s.fTodo], ['linked', s.fLinked], ['core', s.fCore]];

  return (
    <div className="relative mx-auto max-w-[1280px] px-4 pb-24 pt-20 sm:px-6">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px]" style={{ background: `radial-gradient(60% 70% at 30% 0%, ${color}22, transparent 70%)` }} />

      <Link href="/roadmap" className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium transition hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>
        <ArrowLeft size={15} /> {s.back}
      </Link>

      {loading ? (
        <div className="flex justify-center py-28"><Loader2 className="animate-spin" style={{ color }} /></div>
      ) : !data ? (
        <p className="py-28 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>{s.notFound}</p>
      ) : (
        <>
          {/* Đầu trang */}
          <motion.header initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: EASE, duration: 0.5 }}
            className="relative mb-8 overflow-hidden rounded-3xl border p-5 sm:p-7" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>
            <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-25 blur-3xl" style={{ background: color }} />
            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0 flex-1">
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${color}, ${color}b3)` }}>
                    <Icon size={28} />
                  </span>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color }}>{data.type === 'role' ? s.role : s.skill}</span>
                    <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl" style={{ color: 'var(--text-primary)' }}>{data.title}</h1>
                  </div>
                </div>
                {data.description && <p className="max-w-3xl text-sm leading-relaxed sm:text-[15px]" style={{ color: 'var(--text-secondary)' }}>{data.description}</p>}
                <div className="mt-4 flex flex-wrap gap-2">
                  <Stat icon={Layers} value={data.stages.length} label={s.stages} />
                  <Stat icon={Route} value={total} label={s.steps} />
                  {linked > 0 && <Stat icon={GraduationCap} value={linked} label={s.statLinked} />}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-5 md:flex-col md:items-center md:gap-3">
                <ProgressRing pct={pct} color={color} />
                <div className="text-center">
                  <p className="text-xs tabular-nums" style={{ color: 'var(--text-secondary)' }}>{doneCount}/{total} {s.done}</p>
                  {currentNode && (
                    <button type="button" onClick={() => setActiveId(currentNode.id)}
                      className="mt-2 inline-flex max-w-[220px] items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
                      style={{ background: color }} title={currentNode.title}>
                      <Play size={13} className="shrink-0 fill-current" />
                      <span className="truncate">{doneCount ? s.resume : s.start}: {currentNode.title}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.header>

          {khoaPhu.length > 0 && (
            <section className="mb-8">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em]" style={{ color: 'var(--text-secondary)' }}>
                <GraduationCap size={15} /> {s.coursesCover}
              </h2>
              <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                {khoaPhu.map((k) => (
                  <Link key={k.slug} href={`/courses/${k.slug}`}
                    className="group flex items-center gap-3 rounded-2xl border p-3 transition hover:-translate-y-0.5 hover:shadow-lg"
                    style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold" style={{ background: `${color}1c`, color }}>
                      {k.academy ? (k.ma?.slice(0, 3) ?? 'FU') : <GraduationCap size={17} />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-1 text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>{k.ten}</span>
                      <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{k.academy ? `${s.academy}${k.ma ? ` · ${k.ma}` : ''} · ` : ''}{s.coversSteps(k.buoc)}</span>
                    </span>
                    <ArrowRight size={14} className="shrink-0 opacity-30 transition group-hover:translate-x-0.5 group-hover:opacity-80" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="grid gap-8 lg:grid-cols-[264px_minmax(0,1fr)]">
            {/* Mục lục */}
            <aside className="hidden lg:block">
              <nav className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-1 [scrollbar-width:thin]" aria-label={s.contents}>
                <p className="mb-2 flex items-center gap-1.5 px-2 text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: 'var(--text-secondary)' }}>
                  <ListTree size={13} /> {s.contents}
                </p>
                <ol className="space-y-0.5">
                  {data.stages.map((st) => {
                    const xong = st.nodes.filter((n) => done.has(n.id)).length;
                    const p = st.nodes.length ? xong / st.nodes.length : 0;
                    const dang = changDangXem === st.stage;
                    return (
                      <li key={st.stage}>
                        <button type="button" onClick={() => cuonToi(st.stage)}
                          className="group flex w-full items-start gap-2.5 rounded-xl px-2 py-2 text-left transition hover:bg-[var(--bg-surface-hover)]"
                          style={{ background: dang ? `${color}14` : undefined }}>
                          <span className="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                            style={{ background: p === 1 ? '#22c55e' : dang ? color : 'var(--bg-surface-hover)', color: p === 1 || dang ? '#fff' : 'var(--text-secondary)' }}>
                            {p === 1 ? <Check size={11} strokeWidth={3} /> : st.stage + 1}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="line-clamp-2 text-[13px] font-medium leading-snug" style={{ color: dang ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{st.stageLabel}</span>
                            <span className="mt-1 flex items-center gap-2">
                              <span className="h-1 flex-1 overflow-hidden rounded-full" style={{ background: 'var(--bg-surface-hover)' }}>
                                <span className="block h-full rounded-full transition-all" style={{ width: `${p * 100}%`, background: p === 1 ? '#22c55e' : color }} />
                              </span>
                              <span className="text-[10px] tabular-nums" style={{ color: 'var(--text-secondary)' }}>{xong}/{st.nodes.length}</span>
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </nav>
            </aside>

            <main className="min-w-0">
              {/* Tìm + lọc */}
              <div className="sticky top-16 z-20 -mx-1 mb-6 rounded-2xl px-1 py-2 backdrop-blur-md" style={{ background: 'color-mix(in srgb, var(--bg-primary) 82%, transparent)' }}>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="relative flex-1">
                    <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-50" style={{ color: 'var(--text-secondary)' }} />
                    <input value={tim} onChange={(e) => setTim(e.target.value)} placeholder={s.searchSteps(total)}
                      className="w-full rounded-xl border py-2.5 pl-9 pr-9 text-sm outline-none transition focus:shadow-md"
                      style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} />
                    {tim && (
                      <button type="button" onClick={() => setTim('')} aria-label="Clear"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 transition hover:bg-[var(--bg-surface-hover)]">
                        <X size={14} style={{ color: 'var(--text-secondary)' }} />
                      </button>
                    )}
                  </div>
                  <div className="flex gap-1 overflow-x-auto rounded-xl border p-1" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>
                    {LOC.map(([k, label]) => (
                      <button key={k} type="button" onClick={() => setLoc(k)}
                        className="whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition"
                        style={loc === k ? { background: color, color: '#fff' } : { color: 'var(--text-secondary)' }}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                {dangLoc && <p className="mt-2 px-1 text-xs" style={{ color: 'var(--text-secondary)' }}>{soKhop ? s.matches(soKhop) : s.noSteps}</p>}
              </div>

              <div className="relative">
                <div aria-hidden className="absolute bottom-0 left-[15px] top-2 hidden w-px sm:block" style={{ background: `linear-gradient(${color}66, ${color}10)` }} />
                {chang.map((st) => {
                  const goc = data.stages.find((x) => x.stage === st.stage)!;
                  const xong = goc.nodes.filter((n) => done.has(n.id)).length;
                  const daDong = dong.has(st.stage) && !dangLoc;
                  const daMo = dangLoc || moRong.has(st.stage);
                  const hien = daMo || st.nodes.length <= NGUONG ? st.nodes : st.nodes.slice(0, MO_SAN);
                  const conLai = st.nodes.length - hien.length;
                  const het = xong === goc.nodes.length;
                  return (
                    <section key={st.stage} id={`chang-${st.stage}`} data-stage={st.stage} className="relative mb-10 sm:pl-12">
                      <button type="button" onClick={() => setDong((p) => { const n = new Set(p); n.has(st.stage) ? n.delete(st.stage) : n.add(st.stage); return n; })}
                        className="group mb-4 flex w-full items-center gap-3 text-left">
                        <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-md sm:absolute sm:left-0"
                          style={{ background: het ? '#22c55e' : color, boxShadow: `0 0 0 5px var(--bg-primary)` }}>
                          {het ? <Check size={15} strokeWidth={3} /> : st.stage + 1}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-lg font-bold leading-tight tracking-tight" style={{ color: 'var(--text-primary)' }}>{st.stageLabel}</span>
                          <span className="mt-1 flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                            <span className="h-1 w-24 overflow-hidden rounded-full" style={{ background: 'var(--bg-surface-hover)' }}>
                              <span className="block h-full rounded-full" style={{ width: `${(xong / goc.nodes.length) * 100}%`, background: het ? '#22c55e' : color }} />
                            </span>
                            <span className="tabular-nums">{xong}/{goc.nodes.length} {s.done}</span>
                          </span>
                        </span>
                        <ChevronDown size={18} className="shrink-0 transition" style={{ color: 'var(--text-secondary)', transform: daDong ? 'rotate(-90deg)' : undefined }} />
                      </button>

                      <AnimatePresence initial={false}>
                        {!daDong && (
                          <motion.div initial={reduce ? false : { height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: EASE }} className="overflow-hidden">
                            <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
                              {hien.map((n) => (
                                <StepCard key={n.id} n={n} st={statusOf(n.id)} color={color} s={s}
                                  onOpen={() => setActiveId(n.id)} onToggle={() => toggleDone(n.id)} />
                              ))}
                            </div>
                            {conLai > 0 && (
                              <button type="button" onClick={() => setMoRong((p) => new Set(p).add(st.stage))}
                                className="mt-3 inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-semibold transition hover:shadow-md"
                                style={{ borderColor: `${color}55`, color, background: `${color}10` }}>
                                {s.showMore(conLai)} <ChevronDown size={13} />
                              </button>
                            )}
                            {daMo && !dangLoc && st.nodes.length > NGUONG && (
                              <button type="button" onClick={() => setMoRong((p) => { const n = new Set(p); n.delete(st.stage); return n; })}
                                className="mt-3 text-xs font-medium underline-offset-2 hover:underline" style={{ color: 'var(--text-secondary)' }}>
                                {s.collapse}
                              </button>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </section>
                  );
                })}
              </div>
            </main>
          </div>
        </>
      )}

      <AnimatePresence>
        {active && (
          <StepPanel key="panel" slug={slug} node={active.n} stageLabel={active.st.stageLabel} stageNo={active.st.stage + 1}
            color={color} lang={lang} s={s} isDone={done.has(active.n.id)} isAuthenticated={isAuthenticated} toggling={toggling}
            onToggleDone={() => toggleDone(active.n.id)} onClose={() => setActiveId(null)}
            onPrev={ai > 0 ? () => setActiveId(flat[ai - 1].n.id) : null}
            onNext={ai >= 0 && ai < flat.length - 1 ? () => setActiveId(flat[ai + 1].n.id) : null}
            posLabel={`${ai + 1}/${flat.length}`} />
        )}
      </AnimatePresence>
    </div>
  );
}
