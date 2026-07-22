'use client';

/**
 * Code Lab — track roadmap.
 * Modules in order; each lists its exercises with a difficulty badge and a
 * solved checkmark. A progress ring shows how much of the track is solved.
 */
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Circle, Loader2, BookOpen, Clock, ExternalLink, Target } from 'lucide-react';
import { codeLabApi } from '@/lib/code-lab-api';
import type { CodeTrack, MyProgressItem } from '@/types/code-lab';
import { useAuthStore } from '@/store/authStore';
import { DifficultyBadge, LevelPill, ProgressRing, TechIcon } from '@/components/code-lab/shared';
import { ModuleLesson } from '@/components/code-lab/ModuleLesson';
import { SkillCoverage } from '@/components/code-lab/SkillCoverage';

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

  const accent = track.color || 'var(--accent-color)';
  const pct = total ? Math.round((solved / total) * 100) : 0;

  return (
    <div className="cl-root mx-auto max-w-4xl px-4 pb-14 pt-20" style={{ color: 'var(--text-primary)', ['--cl-accent' as string]: accent } as React.CSSProperties}>
      <Link href="/code-lab" className="mb-4 inline-flex items-center gap-1.5 text-sm transition-colors hover:opacity-80" style={{ color: 'var(--text-muted)' }}>
        <ArrowLeft size={15} /> Code Lab
      </Link>

      {/* Track header — hero */}
      <div className="cl-hero cl-in mb-6 p-6 sm:p-7">
        <div className="flex items-start gap-4">
          <span className="cl-track-icon shrink-0" style={{ height: 60, width: 60, borderRadius: 16 }}>
            <TechIcon slug={track.slug} name={track.name} icon={track.icon} color={track.color} size={32} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="cl-display text-2xl">{track.name}</h1>
              <LevelPill level={track.level} />
            </div>
            {track.description && <p className="mt-1.5 max-w-xl text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{track.description}</p>}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)', background: 'var(--bg-card)' }}>
                <TechIcon slug={track.slug} name={track.name} icon={track.icon} color={track.color} size={13} />{track.language}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)', background: 'var(--bg-card)' }}>
                <Target size={12} />{total} exercises
              </span>
              {track.docsUrl && (
                <a href={track.docsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-white transition-transform hover:-translate-y-0.5" style={{ background: accent }}>
                  <ExternalLink size={12} /> Official docs
                </a>
              )}
            </div>
          </div>
          {isAuthed && total > 0 && (
            <div className="flex shrink-0 flex-col items-center">
              <div className="relative">
                <ProgressRing value={total ? solved / total : 0} size={64} />
                <span className="cl-stat-num absolute inset-0 flex items-center justify-center text-sm">{pct}%</span>
              </div>
              <span className="mt-1 text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>{solved}/{total} solved</span>
            </div>
          )}
        </div>
        {isAuthed && total > 0 && (
          <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full" style={{ background: 'var(--bg-surface)' }}>
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${accent}, color-mix(in srgb, ${accent} 55%, #22c55e))` }} />
          </div>
        )}
      </div>

      {/* Modules */}
      {(track.modules || []).length === 0 && (
        <div className="rounded-xl border py-12 text-center text-sm" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
          No modules yet.
        </div>
      )}
      <SkillCoverage trackSlug={slug} />

      <div className="space-y-5">
        {(track.modules || []).map((m, mi) => {
          const modAll = (m.exercises || []).length;
          const modSolved = (m.exercises || []).filter((e) => progress[e.id]?.status === 'SOLVED').length;
          const modDone = modAll > 0 && modSolved === modAll;
          const focused = focusModuleId === m.id;
          return (
          <section
            key={m.id}
            id={`module-${m.id}`}
            className="scroll-mt-24 overflow-hidden rounded-2xl border transition-all"
            style={{
              background: 'var(--bg-card)',
              borderColor: focused ? accent : 'var(--border-color)',
              boxShadow: focused ? `0 0 0 3px color-mix(in srgb, ${accent} 25%, transparent)` : undefined,
            }}
          >
            <header className="flex items-center gap-3 border-b px-4 py-3.5" style={{ borderColor: 'var(--border-color)' }}>
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl text-sm font-bold cl-stat-num"
                style={modDone
                  ? { background: '#22c55e', color: '#fff' }
                  : { background: `color-mix(in srgb, ${accent} 15%, transparent)`, color: accent, border: `1px solid color-mix(in srgb, ${accent} 30%, transparent)` }}>
                {modDone ? <CheckCircle2 size={17} /> : mi + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{m.name}</h2>
                  <LevelPill level={m.level} />
                </div>
                {m.description && <p className="mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>{m.description}</p>}
              </div>
              {isAuthed && modAll > 0 && (
                <span className="hidden shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums sm:inline-block"
                  style={{ background: 'var(--bg-surface)', color: modDone ? '#22c55e' : 'var(--text-muted)' }}>
                  {modSolved}/{modAll}
                </span>
              )}
            </header>
            <ModuleLesson moduleId={m.id} hasLesson={m.hasLesson} autoOpen={focused} />
            <ul>
              {modAll === 0 && (
                <li className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>No exercises in this module yet.</li>
              )}
              {(m.exercises || []).map((ex, i) => {
                const isSolved = progress[ex.id]?.status === 'SOLVED';
                const inProgress = progress[ex.id]?.status === 'IN_PROGRESS';
                return (
                  <li key={ex.id} className="group border-t first:border-t-0" style={{ borderColor: 'var(--border-color)' }}>
                    <Link href={`/code-lab/${track.slug}/${ex.slug}`} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[var(--bg-surface-hover)]">
                      {isSolved
                        ? <CheckCircle2 size={19} className="shrink-0" style={{ color: '#22c55e' }} />
                        : <Circle size={19} className="shrink-0" style={{ color: inProgress ? '#d97706' : 'var(--border-color)' }} />}
                      <span className="w-6 shrink-0 text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>{i + 1}.</span>
                      <span className="min-w-0 flex-1 truncate text-sm font-medium transition-colors group-hover:text-[var(--cl-accent)]" style={{ color: isSolved ? 'var(--text-secondary)' : 'var(--text-primary)' }}>{ex.title}</span>
                      {inProgress && !isSolved && (
                        <span className="hidden rounded-full px-2 py-0.5 text-[10px] font-semibold sm:inline-block" style={{ background: 'rgba(217,119,6,0.14)', color: '#d97706' }}>In progress</span>
                      )}
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
          );
        })}
      </div>
    </div>
  );
}
