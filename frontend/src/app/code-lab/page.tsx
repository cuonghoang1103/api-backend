'use client';

/**
 * Code Lab — hub landing.
 * Top: title + full-text search with autocomplete.
 * Group tabs → filter the track grid. Click a track → its roadmap.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2, Code2 } from 'lucide-react';
import { codeLabApi } from '@/lib/code-lab-api';
import type { CodeGroup, CodeStats } from '@/types/code-lab';
import { GroupGlyph, TrackCard, DifficultyBadge } from '@/components/code-lab/shared';

type Suggest = Awaited<ReturnType<typeof codeLabApi.autocomplete>>['data']['data'];

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

  return (
    <div className="mx-auto max-w-6xl px-4 pb-10 pt-20" style={{ color: 'var(--text-primary)' }}>
      {/* Hero */}
      <div className="mb-6">
        <div className="mb-1 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: 'rgba(99,102,241,0.14)', color: '#6366f1' }}>
            <Code2 size={20} />
          </span>
          <h1 className="text-2xl font-bold">Code Lab</h1>
        </div>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Learning roadmaps + graded exercises across every language and framework — from zero to advanced.
        </p>
        {stats && (
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span><b style={{ color: 'var(--text-primary)' }}>{stats.tracks}</b> tracks</span>
            <span><b style={{ color: 'var(--text-primary)' }}>{stats.modules}</b> modules</span>
            <span><b style={{ color: 'var(--text-primary)' }}>{stats.exercises}</b> exercises</span>
          </div>
        )}
      </div>

      {/* Search */}
      <div ref={boxRef} className="relative mb-6">
        <div className="flex items-center gap-2 rounded-xl border px-3 py-2" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
          <Search size={18} style={{ color: 'var(--text-muted)' }} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') submitSearch(); }}
            onFocus={() => suggest && setOpen(true)}
            placeholder="Search exercises, tracks, concepts…"
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: 'var(--text-primary)' }}
          />
          {searching && <Loader2 size={16} className="animate-spin" style={{ color: 'var(--text-muted)' }} />}
          {q && !searching && <button onClick={() => { setQ(''); setSuggest(null); }} aria-label="Clear"><X size={16} style={{ color: 'var(--text-muted)' }} /></button>}
        </div>
        {open && suggest && (suggest.tracks.length > 0 || suggest.exercises.length > 0) && (
          <div className="absolute z-30 mt-1 w-full overflow-hidden rounded-xl border shadow-lg" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            {suggest.tracks.length > 0 && (
              <div className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Tracks</div>
            )}
            {suggest.tracks.map((t) => (
              <Link key={`t${t.id}`} href={`/code-lab/${t.slug}`} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--bg-surface-hover)]" onClick={() => setOpen(false)}>
                <span style={{ color: t.color || '#6366f1' }}><GroupGlyph icon={t.language} size={15} /></span>
                <span style={{ color: 'var(--text-primary)' }}>{t.name}</span>
                <span className="ml-auto text-xs" style={{ color: 'var(--text-muted)' }}>{t.language}</span>
              </Link>
            ))}
            {suggest.exercises.length > 0 && (
              <div className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Exercises</div>
            )}
            {suggest.exercises.map((ex) => (
              <Link key={`e${ex.id}`} href={`/code-lab/${ex.track?.slug || ''}/${ex.slug}`} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--bg-surface-hover)]" onClick={() => setOpen(false)}>
                <span className="truncate" style={{ color: 'var(--text-primary)' }}>{ex.title}</span>
                <span className="ml-auto"><DifficultyBadge difficulty={ex.difficulty} small /></span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Group tabs */}
      <div className="mb-5 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveGroup('all')}
          className="rounded-full px-3 py-1.5 text-sm font-medium transition-colors"
          style={activeGroup === 'all'
            ? { background: '#6366f1', color: '#fff' }
            : { background: 'var(--bg-surface)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}
        >
          All
        </button>
        {visibleGroups.map((g) => {
          const active = activeGroup === g.id;
          const accent = g.color || '#6366f1';
          return (
            <button
              key={g.id}
              onClick={() => setActiveGroup(g.id)}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors"
              style={active
                ? { background: accent, color: '#fff' }
                : { background: 'var(--bg-surface)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}
            >
              <GroupGlyph slug={g.slug} icon={g.icon} size={14} />
              {g.name}
            </button>
          );
        })}
      </div>

      {/* Track grid */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin" style={{ color: 'var(--text-muted)' }} /></div>
      ) : tracks.length === 0 ? (
        <div className="rounded-xl border py-16 text-center text-sm" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
          No tracks yet. An admin can add them under <Link href="/admin/code-lab" className="underline">/admin/code-lab</Link>.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tracks.map((t) => <TrackCard key={t.id} track={t} />)}
        </div>
      )}
    </div>
  );
}
