'use client';

/**
 * Code Lab — track roadmap.
 * Modules in order; each lists its exercises with a difficulty badge and a
 * solved checkmark. A progress ring shows how much of the track is solved.
 */
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Circle, Loader2, BookOpen, Clock, ExternalLink } from 'lucide-react';
import { codeLabApi } from '@/lib/code-lab-api';
import type { CodeTrack, MyProgressItem } from '@/types/code-lab';
import { useAuthStore } from '@/store/authStore';
import { DifficultyBadge, LevelPill, ProgressRing, TechIcon } from '@/components/code-lab/shared';
import { ModuleLesson } from '@/components/code-lab/ModuleLesson';

export default function TrackRoadmapPage() {
  const params = useParams<{ trackSlug: string }>();
  const slug = params.trackSlug;
  const isAuthed = useAuthStore((s) => s.isAuthenticated);

  const [track, setTrack] = useState<CodeTrack | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<Record<number, MyProgressItem>>({});
  // A deep link like /code-lab/java-core#module-249 arrives BEFORE the modules
  // exist, so the browser's own anchor jump finds nothing and stays at the top.
  // Resolve it ourselves once the data is in, and open that module's lesson —
  // the whole point of such a link is "take me to this topic".
  const [focusModuleId, setFocusModuleId] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await codeLabApi.getTrack(slug);
        setTrack(res.data.data);
        if (isAuthed && res.data.data?.id) {
          try {
            const p = await codeLabApi.myProgress(res.data.data.id);
            const map: Record<number, MyProgressItem> = {};
            (p.data.data || []).forEach((it) => { map[it.exerciseId] = it; });
            setProgress(map);
          } catch { /* ignore */ }
        }
      } catch { setTrack(null); } finally { setLoading(false); }
    })();
  }, [slug, isAuthed]);

  useEffect(() => {
    if (!track) return;
    const m = /#module-(\d+)/.exec(window.location.hash);
    if (!m) return;
    const id = Number(m[1]);
    setFocusModuleId(id);
    // one frame after paint, so the section is mounted
    const t = window.setTimeout(() => {
      document.getElementById(`module-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
    return () => window.clearTimeout(t);
  }, [track]);

  const { total, solved } = useMemo(() => {
    const all = (track?.modules || []).flatMap((m) => m.exercises || []);
    const s = all.filter((e) => progress[e.id]?.status === 'SOLVED').length;
    return { total: all.length, solved: s };
  }, [track, progress]);

  if (loading) return <div className="flex justify-center py-24"><Loader2 className="animate-spin" style={{ color: 'var(--text-muted)' }} /></div>;
  if (!track) return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center" style={{ color: 'var(--text-muted)' }}>
      Track not found. <Link href="/code-lab" className="underline">Back to Code Lab</Link>
    </div>
  );

  const accent = track.color || '#6366f1';

  return (
    <div className="mx-auto max-w-4xl px-4 pb-10 pt-20" style={{ color: 'var(--text-primary)' }}>
      <Link href="/code-lab" className="mb-4 inline-flex items-center gap-1 text-sm" style={{ color: 'var(--text-muted)' }}>
        <ArrowLeft size={15} /> Code Lab
      </Link>

      {/* Track header */}
      <div className="mb-6 flex items-start gap-4 rounded-xl border p-5" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl" style={{ background: `${accent}1a`, color: accent }}>
          <TechIcon slug={track.slug} name={track.name} icon={track.icon} color={track.color} size={30} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold">{track.name}</h1>
            <LevelPill level={track.level} />
          </div>
          {track.description && <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>{track.description}</p>}
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span>{track.language}</span>
            <span>{total} exercises</span>
            {track.docsUrl && (
              <a href={track.docsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline">
                <ExternalLink size={12} /> Official docs
              </a>
            )}
          </div>
        </div>
        {isAuthed && total > 0 && (
          <div className="flex flex-col items-center">
            <div className="relative">
              <ProgressRing value={total ? solved / total : 0} size={52} />
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">{Math.round((solved / total) * 100)}%</span>
            </div>
            <span className="mt-1 text-[11px]" style={{ color: 'var(--text-muted)' }}>{solved}/{total}</span>
          </div>
        )}
      </div>

      {/* Modules */}
      {(track.modules || []).length === 0 && (
        <div className="rounded-xl border py-12 text-center text-sm" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
          No modules yet.
        </div>
      )}
      <div className="space-y-5">
        {(track.modules || []).map((m, mi) => (
          <section
            key={m.id}
            id={`module-${m.id}`}
            className="scroll-mt-24 rounded-xl border transition-shadow"
            style={{
              background: 'var(--bg-card)',
              borderColor: focusModuleId === m.id ? 'var(--accent-color, #8b5cf6)' : 'var(--border-color)',
              boxShadow: focusModuleId === m.id ? '0 0 0 2px color-mix(in srgb, var(--accent-color, #8b5cf6) 35%, transparent)' : undefined,
            }}
          >
            <header className="flex items-center gap-2 border-b px-4 py-3" style={{ borderColor: 'var(--border-color)' }}>
              <span className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold" style={{ background: `${accent}22`, color: accent }}>{mi + 1}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold">{m.name}</h2>
                  <LevelPill level={m.level} />
                </div>
                {m.description && <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{m.description}</p>}
              </div>
              <BookOpen size={16} style={{ color: 'var(--text-muted)' }} />
            </header>
            <ModuleLesson moduleId={m.id} hasLesson={m.hasLesson} autoOpen={focusModuleId === m.id} />
            <ul>
              {(m.exercises || []).length === 0 && (
                <li className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>No exercises in this module yet.</li>
              )}
              {(m.exercises || []).map((ex, i) => {
                const isSolved = progress[ex.id]?.status === 'SOLVED';
                const inProgress = progress[ex.id]?.status === 'IN_PROGRESS';
                return (
                  <li key={ex.id} className="border-t first:border-t-0" style={{ borderColor: 'var(--border-color)' }}>
                    <Link href={`/code-lab/${track.slug}/${ex.slug}`} className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-[var(--bg-surface-hover)]">
                      {isSolved
                        ? <CheckCircle2 size={18} className="shrink-0" style={{ color: '#22c55e' }} />
                        : <Circle size={18} className="shrink-0" style={{ color: inProgress ? '#d97706' : 'var(--border-color)' }} />}
                      <span className="w-6 shrink-0 text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>{i + 1}.</span>
                      <span className="min-w-0 flex-1 truncate text-sm" style={{ color: 'var(--text-primary)' }}>{ex.title}</span>
                      {ex.estimatedMinutes ? (
                        <span className="hidden items-center gap-1 text-xs sm:flex" style={{ color: 'var(--text-muted)' }}>
                          <Clock size={12} />{ex.estimatedMinutes}m
                        </span>
                      ) : null}
                      <DifficultyBadge difficulty={ex.difficulty} small />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
