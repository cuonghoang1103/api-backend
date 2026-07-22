'use client';

/**
 * Code Lab — hub landing.
 * Hero with animated stats + prominent search, group filter pills, track grid.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2, Sparkles, ArrowRight, Layers, BookOpen, Target } from 'lucide-react';
import { codeLabApi } from '@/lib/code-lab-api';
import type { CodeGroup, CodeStats } from '@/types/code-lab';
import { GroupGlyph, TrackCard, DifficultyBadge } from '@/components/code-lab/shared';

type Suggest = Awaited<ReturnType<typeof codeLabApi.autocomplete>>['data']['data'];

/** Count up to `value` once, respecting reduced-motion. */
function useCountUp(value: number, run: boolean, ms = 900) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setN(value); return;
    }
    let raf = 0; const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / ms);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, run, ms]);
  return n;
}

function StatTile({ icon, value, label, run, delay }: { icon: React.ReactNode; value: number; label: string; run: boolean; delay: string }) {
  const n = useCountUp(value, run);
  return (
    <div className={`cl-stat cl-in ${delay}`}>
      <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
        {icon}{label}
      </div>
      <div className="cl-stat-num text-3xl" style={{ color: 'var(--text-primary)' }}>{n.toLocaleString()}</div>
    </div>
  );
}

export default function CodeLabHubPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<CodeGroup[]>([]);
  const [stats, setStats] = useState<CodeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeGroup, setActiveGroup] = useState<number | 'all'>('all');

  const [q, setQ] = useState('');
  const [suggest, setSuggest] = useState<Suggest | null>(null);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const [g, s] = await Promise.all([codeLabApi.getGroups(), codeLabApi.getStats()]);
        setGroups(g.data.data || []);
        setStats(s.data.data || null);
      } catch { /* ignore */ } finally { setLoading(false); }
    })();
  }, []);

  // debounced autocomplete
  useEffect(() => {
    const term = q.trim();
    if (!term) { setSuggest(null); setOpen(false); return; }
    setSearching(true);
    const t = setTimeout(async () => {
      try {
        const res = await codeLabApi.autocomplete(term, 8);
        setSuggest(res.data.data);
        setOpen(true);
      } catch { /* ignore */ } finally { setSearching(false); }
    }, 220);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const visibleGroups = useMemo(() => groups.filter((g) => (g.tracks?.length ?? 0) > 0), [groups]);
  const tracks = useMemo(() => {
    const all = groups.flatMap((g) => (g.tracks || []).map((t) => ({ ...t, groupSlug: g.slug })));
    return activeGroup === 'all' ? all : all.filter((t) => t.groupId === activeGroup);
  }, [groups, activeGroup]);

  const submitSearch = () => {
    const term = q.trim();
    if (term) router.push(`/code-lab/search?q=${encodeURIComponent(term)}`);
  };

  const statsReady = !!stats;

  return (
    <div className="cl-root mx-auto max-w-6xl px-4 pb-16 pt-20" style={{ color: 'var(--text-primary)' }}>
      {/* ————— Hero ————— */}
      <section className="cl-hero cl-in mb-8 px-6 py-9 sm:px-10 sm:py-12">
        <div className="cl-eyebrow cl-in cl-in-1 mb-4">cuongthai · Code Lab</div>
        <h1 className="cl-display cl-in cl-in-1 max-w-2xl text-[2rem] sm:text-[2.9rem]">
          Learn a stack by <span className="cl-gradient-text">building</span> it —
          <br className="hidden sm:block" /> one graded exercise at a time.
        </h1>
        <p className="cl-in cl-in-2 mt-4 max-w-xl text-[15px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Structured roadmaps and hands-on exercises across every language and framework —
          from your first line of code to advanced, production-grade patterns.
        </p>

        {/* Search */}
        <div ref={boxRef} className="cl-in cl-in-2 relative mt-6 max-w-xl">
          <div className="cl-search">
            <Search size={19} style={{ color: 'var(--text-muted)' }} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') submitSearch(); }}
              onFocus={() => suggest && setOpen(true)}
              placeholder="Search exercises, tracks, concepts…"
              className="flex-1 bg-transparent text-[15px] outline-none"
              style={{ color: 'var(--text-primary)' }}
            />
            {searching && <Loader2 size={17} className="animate-spin" style={{ color: 'var(--text-muted)' }} />}
            {q && !searching && (
              <button onClick={() => { setQ(''); setSuggest(null); }} aria-label="Clear" className="grid place-items-center rounded-md p-0.5 hover:bg-[var(--bg-surface-hover)]">
                <X size={16} style={{ color: 'var(--text-muted)' }} />
              </button>
            )}
            <kbd className="hidden shrink-0 items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-medium sm:inline-flex" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains-mono, monospace)' }}>
              ⏎
            </kbd>
          </div>
          {open && suggest && (suggest.tracks.length > 0 || suggest.exercises.length > 0) && (
            <div className="cl-suggest">
              {suggest.tracks.length > 0 && (
                <div className="px-3.5 pb-1 pt-2.5 text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Tracks</div>
              )}
              {suggest.tracks.map((t) => (
                <Link key={`t${t.id}`} href={`/code-lab/${t.slug}`} className="cl-suggest-row" onClick={() => setOpen(false)}>
                  <span style={{ color: t.color || 'var(--accent-color)' }}><GroupGlyph icon={t.language} size={16} /></span>
                  <span style={{ color: 'var(--text-primary)' }}>{t.name}</span>
                  <span className="ml-auto text-xs" style={{ color: 'var(--text-muted)' }}>{t.language}</span>
                </Link>
              ))}
              {suggest.exercises.length > 0 && (
                <div className="px-3.5 pb-1 pt-2.5 text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Exercises</div>
              )}
              {suggest.exercises.map((ex) => (
                <Link key={`e${ex.id}`} href={`/code-lab/${ex.track?.slug || ''}/${ex.slug}`} className="cl-suggest-row" onClick={() => setOpen(false)}>
                  <span className="truncate" style={{ color: 'var(--text-primary)' }}>{ex.title}</span>
                  <span className="ml-auto"><DifficultyBadge difficulty={ex.difficulty} small /></span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        {stats && (
          <div className="mt-7 grid max-w-xl grid-cols-3 gap-3">
            <StatTile icon={<Layers size={12} />} value={stats.tracks} label="Tracks" run={statsReady} delay="cl-in-2" />
            <StatTile icon={<BookOpen size={12} />} value={stats.modules} label="Modules" run={statsReady} delay="cl-in-3" />
            <StatTile icon={<Target size={12} />} value={stats.exercises} label="Exercises" run={statsReady} delay="cl-in-4" />
          </div>
        )}
      </section>

      {/* ————— Group filter ————— */}
      <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        <button onClick={() => setActiveGroup('all')} className="cl-pill" data-active={activeGroup === 'all'}
          style={activeGroup === 'all' ? { background: 'var(--accent-color)' } : undefined}>
          <Sparkles size={14} /> All
        </button>
        {visibleGroups.map((g) => {
          const active = activeGroup === g.id;
          const accent = g.color || 'var(--accent-color)';
          return (
            <button key={g.id} onClick={() => setActiveGroup(g.id)} className="cl-pill" data-active={active}
              style={active ? { background: accent } : undefined}>
              <GroupGlyph slug={g.slug} icon={g.icon} size={14} />
              {g.name}
              <span className="text-[11px] font-semibold opacity-70">{g.tracks?.length ?? 0}</span>
            </button>
          );
        })}
      </div>

      {/* ————— Track grid ————— */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="cl-skel" />)}
        </div>
      ) : tracks.length === 0 ? (
        <div className="rounded-2xl border py-16 text-center text-sm" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
          No tracks yet. An admin can add them under <Link href="/admin/code-lab" className="underline">/admin/code-lab</Link>.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tracks.map((t, i) => <TrackCard key={t.id} track={t} index={i} />)}
        </div>
      )}

      <div className="mt-6 flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
        <ArrowRight size={13} /> Pick a track to open its roadmap, then work through the modules in order.
      </div>
    </div>
  );
}
