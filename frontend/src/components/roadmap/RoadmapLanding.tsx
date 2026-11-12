'use client';

/**
 * /roadmap — danh sách lộ trình (bố cục 12/11/2026): đầu trang có số liệu thật (lộ trình · bước · bước có bài học trên
 * web), ô tìm + tab Tất cả / Vai trò / Kỹ năng, hàng "Đang học dở" khi đã đăng nhập, rồi lưới thẻ có thanh tiến độ.
 * Chữ giao diện theo ngôn ngữ chung của web (LocaleContext), không còn nút EN/VI riêng của trang.
 */
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Loader2, ArrowRight, Search, X, Layers, Route, GraduationCap, Sparkles, PlayCircle, Briefcase, Wrench } from 'lucide-react';
import { roadmapApi, type RoadmapListItemT } from '@/lib/api';
import { useLocaleContext } from '@/context/LocaleContext';
import { roadmapIcon } from './icons';
import { T, type Lang, type Strings } from './roadmapUi';

const EASE = [0.16, 1, 0.3, 1] as const;
type Tab = 'all' | 'role' | 'skill';

function RoadmapCard({ r, index, s }: { r: RoadmapListItemT; index: number; s: Strings }) {
  const reduce = useReducedMotion();
  const Icon = roadmapIcon(r.icon);
  const color = r.color || '#6366f1';
  const pct = r.nodeCount ? Math.round((r.doneCount / r.nodeCount) * 100) : 0;
  return (
    <motion.div initial={reduce ? false : { opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-30px' }}
      transition={{ ease: EASE, duration: 0.4, delay: Math.min(index * 0.03, 0.24) }}>
      <Link href={`/roadmap/${r.slug}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
        style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>
        <div aria-hidden className="absolute inset-x-0 top-0 h-1" style={{ background: `linear-gradient(90deg, ${color}, ${color}55)` }} />
        <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-35" style={{ background: color }} />
        <div className="relative mb-3 flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-md" style={{ background: `linear-gradient(135deg, ${color}, ${color}b3)` }}>
            <Icon size={22} />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-bold" style={{ color: 'var(--text-primary)' }}>{r.title}</h3>
            <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color }}>{r.type === 'role' ? s.role : s.skill}</span>
          </div>
        </div>
        {r.description && <p className="relative line-clamp-3 flex-1 text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{r.description}</p>}
        <div className="relative mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
          <span className="inline-flex items-center gap-1"><Layers size={11} /> {r.stageCount} {s.stages}</span>
          <span className="inline-flex items-center gap-1"><Route size={11} /> {r.nodeCount} {s.steps}</span>
          {r.linkedCount > 0 && <span className="inline-flex items-center gap-1 font-semibold" style={{ color }}><GraduationCap size={11} /> {r.linkedCount} {s.withLessons}</span>}
        </div>
        {r.doneCount > 0 ? (
          <div className="relative mt-3 flex items-center gap-2">
            <span className="h-1.5 flex-1 overflow-hidden rounded-full" style={{ background: 'var(--bg-surface-hover)' }}>
              <span className="block h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
            </span>
            <span className="text-[11px] font-semibold tabular-nums" style={{ color }}>{pct}%</span>
          </div>
        ) : (
          <span className="relative mt-3 inline-flex items-center gap-1 text-[13px] font-semibold transition-all group-hover:gap-2" style={{ color }}>
            {s.open} <ArrowRight size={14} />
          </span>
        )}
      </Link>
    </motion.div>
  );
}

function StatTile({ value, label, icon: Icon }: { value: number; label: string; icon: typeof Layers }) {
  return (
    <div className="rounded-2xl border px-4 py-3" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>
      <div className="flex items-center gap-2">
        <Icon size={16} style={{ color: 'var(--accent-color)' }} />
        <span className="text-2xl font-extrabold tabular-nums tracking-tight" style={{ color: 'var(--text-primary)' }}>{value.toLocaleString('vi-VN')}</span>
      </div>
      <p className="mt-0.5 text-xs" style={{ color: 'var(--text-secondary)' }}>{label}</p>
    </div>
  );
}

export default function RoadmapLanding() {
  const reduce = useReducedMotion();
  const { locale } = useLocaleContext();
  const lang: Lang = locale === 'vi' ? 'vi' : 'en';
  const s = T[lang] as Strings;
  const [role, setRole] = useState<RoadmapListItemT[]>([]);
  const [skill, setSkill] = useState<RoadmapListItemT[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('all');
  const [tim, setTim] = useState('');

  useEffect(() => {
    let alive = true;
    roadmapApi.list()
      .then((res) => { if (!alive) return; const d = res.data.data; setRole(d?.role ?? []); setSkill(d?.skill ?? []); })
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

  const all = useMemo(() => [...role, ...skill], [role, skill]);
  const tong = useMemo(() => ({
    steps: all.reduce((a, r) => a + r.nodeCount, 0),
    linked: all.reduce((a, r) => a + r.linkedCount, 0),
  }), [all]);
  const dangHoc = useMemo(() => all.filter((r) => r.doneCount > 0).sort((a, b) => b.doneCount / b.nodeCount - a.doneCount / a.nodeCount), [all]);

  const khoa = tim.trim().toLowerCase();
  const loc = (ds: RoadmapListItemT[]) => (khoa ? ds.filter((r) => `${r.title} ${r.slug} ${r.description ?? ''}`.toLowerCase().includes(khoa)) : ds);
  const roleL = tab === 'skill' ? [] : loc(role);
  const skillL = tab === 'role' ? [] : loc(skill);

  const TABS: Array<[Tab, string, number]> = [['all', s.all, all.length], ['role', s.role, role.length], ['skill', s.skill, skill.length]];

  return (
    <div className="relative mx-auto max-w-[1280px] px-4 pb-24 pt-20 sm:px-6">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[460px]" style={{ background: 'radial-gradient(55% 70% at 25% 0%, color-mix(in srgb, var(--accent-color) 22%, transparent), transparent 70%)' }} />

      <motion.header initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: EASE, duration: 0.5 }}
        className="mb-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)', color: 'var(--accent-color)' }}>
            <Sparkles size={13} /> {s.eyebrow}
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl" style={{ color: 'var(--text-primary)' }}>{s.heroTitle}</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{s.heroLead}</p>
        </div>
        {!loading && all.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <StatTile value={all.length} label={s.statPaths} icon={Route} />
            <StatTile value={tong.steps} label={s.statSteps} icon={Layers} />
            <StatTile value={tong.linked} label={s.statLinked} icon={GraduationCap} />
          </div>
        )}
      </motion.header>

      {loading ? (
        <div className="flex justify-center py-24"><Loader2 className="animate-spin" style={{ color: 'var(--accent-color)' }} /></div>
      ) : all.length === 0 ? (
        <p className="py-24 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>{s.empty}</p>
      ) : (
        <>
          {dangHoc.length > 0 && !khoa && (
            <section className="mb-10">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em]" style={{ color: 'var(--text-secondary)' }}>
                <PlayCircle size={15} /> {s.continueLearning}
              </h2>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {dangHoc.slice(0, 6).map((r) => {
                  const Icon = roadmapIcon(r.icon); const c = r.color || '#6366f1'; const p = Math.round((r.doneCount / r.nodeCount) * 100);
                  return (
                    <Link key={r.slug} href={`/roadmap/${r.slug}`} className="flex min-w-[260px] items-center gap-3 rounded-2xl border p-3.5 transition hover:shadow-lg"
                      style={{ borderColor: `${c}55`, background: `linear-gradient(135deg, ${c}14, var(--bg-card) 60%)` }}>
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white" style={{ background: c }}><Icon size={19} /></span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{r.title}</span>
                        <span className="mt-1.5 flex items-center gap-2">
                          <span className="h-1.5 flex-1 overflow-hidden rounded-full" style={{ background: 'var(--bg-surface-hover)' }}><span className="block h-full rounded-full" style={{ width: `${p}%`, background: c }} /></span>
                          <span className="text-[11px] font-semibold tabular-nums" style={{ color: c }}>{r.doneCount}/{r.nodeCount}</span>
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          <div className="sticky top-16 z-20 -mx-1 mb-8 flex flex-col gap-2 rounded-2xl px-1 py-2 backdrop-blur-md sm:flex-row sm:items-center"
            style={{ background: 'color-mix(in srgb, var(--bg-primary) 82%, transparent)' }}>
            <div className="relative flex-1">
              <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 opacity-50" style={{ color: 'var(--text-secondary)' }} />
              <input value={tim} onChange={(e) => setTim(e.target.value)} placeholder={s.searchPaths}
                className="w-full rounded-xl border py-2.5 pl-10 pr-9 text-sm outline-none transition focus:shadow-md"
                style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} />
              {tim && (
                <button type="button" onClick={() => setTim('')} aria-label="Clear" className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 transition hover:bg-[var(--bg-surface-hover)]">
                  <X size={14} style={{ color: 'var(--text-secondary)' }} />
                </button>
              )}
            </div>
            <div className="flex gap-1 rounded-xl border p-1" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>
              {TABS.map(([k, label, n]) => (
                <button key={k} type="button" onClick={() => setTab(k)}
                  className="whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-semibold transition"
                  style={tab === k ? { background: 'var(--accent-color)', color: '#fff' } : { color: 'var(--text-secondary)' }}>
                  {label} <span className="opacity-70">{n}</span>
                </button>
              ))}
            </div>
          </div>

          {[['role', s.role, s.roleSub, roleL, Briefcase] as const, ['skill', s.skill, s.skillSub, skillL, Wrench] as const].map(([k, title, sub, items, HIcon]) =>
            items.length > 0 && (
              <section key={k} className="mb-12">
                <div className="mb-4 flex items-end gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--accent-color)' }}><HIcon size={17} /></span>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>{title} <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>· {items.length}</span></h2>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{sub}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {items.map((r, i) => <RoadmapCard key={r.slug} r={r} index={i} s={s} />)}
                </div>
              </section>
            ),
          )}
          {roleL.length + skillL.length === 0 && (
            <p className="py-16 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>{s.noMatch} “{tim.trim()}”.</p>
          )}
        </>
      )}
    </div>
  );
}
